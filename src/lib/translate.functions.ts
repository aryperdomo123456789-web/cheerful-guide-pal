import { createServerFn } from "@tanstack/react-start";

import { LANG_NAMES, hashText, translateSchema } from "@/lib/translate.shared";

/**
 * Traduz textos dinâmicos (produtos, categorias, depoimentos, textos do admin)
 * para o idioma escolhido no painel. Usa cache no banco, então cada frase é
 * traduzida uma única vez — inclusive conteúdos cadastrados no futuro.
 */
export const translateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => translateSchema.parse(data))
  .handler(async ({ data }) => {
    const language = data.language;
    const target = LANG_NAMES[language];
    if (!target || language === "pt-BR") {
      return { translations: {} as Record<string, string> };
    }

    const texts = Array.from(
      new Set(data.texts.map((t) => t.trim()).filter((t) => t.length > 0)),
    );
    if (texts.length === 0) return { translations: {} as Record<string, string> };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const hashes = texts.map((t) => hashText(t));
    const out: Record<string, string> = {};

    const { data: cached } = await supabaseAdmin
      .from("content_translations")
      .select("source_hash, translated_text")
      .eq("lang", language)
      .in("source_hash", hashes);

    const cachedMap = new Map(
      (cached ?? []).map((row) => [row.source_hash as string, row.translated_text as string]),
    );

    const missing: string[] = [];
    texts.forEach((text, i) => {
      const hit = cachedMap.get(hashes[i]);
      if (hit) out[text] = hit;
      else missing.push(text);
    });

    if (missing.length === 0) return { translations: out };

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      // Sem chave de IA configurada: devolve só o que estiver em cache.
      return { translations: out };
    }

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                `Você é um tradutor profissional de e-commerce de móveis de madeira maciça. ` +
                `Traduza cada item do array para ${target}. ` +
                `Mantenha nomes próprios de marca, códigos e medidas. Não adicione comentários. ` +
                `Responda APENAS um JSON no formato {"items":["tradução 1","tradução 2"]} ` +
                `com exatamente ${missing.length} itens, na mesma ordem recebida.`,
            },
            { role: "user", content: JSON.stringify({ items: missing }) },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        console.error("translateContent: gateway", response.status);
        return { translations: out };
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = payload.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as { items?: unknown };
      const items = Array.isArray(parsed.items) ? parsed.items : [];

      const rows: Array<{
        lang: string;
        source_hash: string;
        source_text: string;
        translated_text: string;
      }> = [];

      missing.forEach((text, i) => {
        const value = items[i];
        if (typeof value !== "string" || value.trim().length === 0) return;
        out[text] = value;
        rows.push({
          lang: language,
          source_hash: hashText(text),
          source_text: text,
          translated_text: value,
        });
      });

      if (rows.length > 0) {
        await supabaseAdmin
          .from("content_translations")
          .upsert(rows, { onConflict: "lang,source_hash", ignoreDuplicates: true });
      }
    } catch (error) {
      console.error("translateContent:", error);
    }

    return { translations: out };
  });
