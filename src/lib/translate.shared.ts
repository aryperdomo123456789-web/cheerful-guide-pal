import { z } from "zod";

export const LANG_NAMES: Record<string, string> = {
  "pt-BR": "Português do Brasil",
  "pt-PT": "Português de Portugal",
  "en-US": "English (United States)",
  "es-ES": "Español (España)",
  "fr-FR": "Français",
  "it-IT": "Italiano",
  "de-DE": "Deutsch",
};

export const translateSchema = z.object({
  language: z.string().min(2).max(10),
  texts: z.array(z.string().min(1).max(2000)).min(1).max(60),
});

/** Hash estável e curto para usar como chave de cache. */
export function hashText(text: string) {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + i, 2246822519) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}`;
}
