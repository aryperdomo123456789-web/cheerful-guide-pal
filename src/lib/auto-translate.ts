import { useCallback, useEffect, useState } from "react";

import { DEFAULT_LANGUAGE, useI18n } from "@/lib/i18n";
import { translateContent } from "@/lib/translate.functions";

/**
 * Tradução automática de conteúdo dinâmico (nomes de produtos, descrições,
 * categorias, depoimentos, textos cadastrados no admin).
 *
 * Como funciona:
 * 1. O componente pede a tradução de um texto com `tr(texto)`.
 * 2. Se ainda não existir, o texto entra numa fila e é traduzido em lote.
 * 3. A tradução fica em cache no banco + localStorage, então textos novos
 *    cadastrados no futuro são traduzidos sozinhos na primeira visita.
 */

const STORAGE_KEY = "auto-tr-v1";
const memory = new Map<string, string>();
const attempted = new Set<string>();
const queue = new Map<string, Set<string>>();
const listeners = new Set<() => void>();

let hydrated = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const cacheKey = (lang: string, text: string) => `${lang}\u0000${text}`;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") memory.set(key, value);
    }
  } catch {
    /* cache corrompido: ignora */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const entries = Array.from(memory.entries()).slice(-4000);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch {
      /* quota cheia: segue sem persistir */
    }
  }, 800);
}

function notify() {
  listeners.forEach((fn) => fn());
}

async function flush() {
  flushTimer = null;
  const pending = Array.from(queue.entries());
  queue.clear();

  for (const [language, set] of pending) {
    const texts = Array.from(set);
    for (let i = 0; i < texts.length; i += 40) {
      const chunk = texts.slice(i, i + 40);
      try {
        const result = await translateContent({ data: { language, texts: chunk } });
        const map = result?.translations ?? {};
        let changed = false;
        for (const [source, translated] of Object.entries(map)) {
          if (typeof translated !== "string" || !translated.trim()) continue;
          memory.set(cacheKey(language, source), translated);
          changed = true;
        }
        if (changed) {
          persist();
          notify();
        }
      } catch {
        /* falhou: mantém o texto original */
      }
    }
  }
}

function enqueue(language: string, text: string) {
  if (typeof window === "undefined") return;
  const key = cacheKey(language, text);
  if (attempted.has(key)) return;
  attempted.add(key);
  const set = queue.get(language) ?? new Set<string>();
  set.add(text);
  queue.set(language, set);
  if (!flushTimer) flushTimer = setTimeout(() => void flush(), 120);
}

/**
 * Retorna uma função `tr(texto)` que devolve o texto no idioma do site.
 * Enquanto a tradução não chega, mostra o texto original (sem piscar layout).
 */
export function useAutoTranslate() {
  const { language } = useI18n();
  const [, setTick] = useState(0);

  useEffect(() => {
    hydrate();
    const listener = () => setTick((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return useCallback(
    (text?: string | null): string => {
      const value = (text ?? "").toString();
      if (!value.trim()) return value;
      if (language === DEFAULT_LANGUAGE) return value;
      if (value.trim().length > 2000) return value;
      hydrate();
      const hit = memory.get(cacheKey(language, value.trim()));
      if (hit) return hit;
      enqueue(language, value.trim());
      return value;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );
}
