/**
 * Utilitários de erro compartilhados.
 *
 * Regra do projeto: nenhum `catch` deve engolir o erro em silêncio nem
 * mostrar `[object Object]` para o usuário. Sempre passe pelo
 * `getErrorMessage` antes de exibir algo na interface.
 */

const DEFAULT_MESSAGE = "Algo deu errado. Tente novamente.";

/** Extrai uma mensagem legível de qualquer valor lançado (Error, PostgrestError, string...). */
export function getErrorMessage(error: unknown, fallback: string = DEFAULT_MESSAGE): string {
  if (!error) return fallback;
  if (typeof error === "string") return error.trim() || fallback;
  if (error instanceof Error) return error.message || fallback;

  if (typeof error === "object") {
    const maybe = error as { message?: unknown; error_description?: unknown; details?: unknown };
    for (const value of [maybe.message, maybe.error_description, maybe.details]) {
      if (typeof value === "string" && value.trim()) return value;
    }
  }

  return fallback;
}

/** Normaliza qualquer valor lançado em um `Error` de verdade. */
export function toError(error: unknown, fallback?: string): Error {
  return error instanceof Error ? error : new Error(getErrorMessage(error, fallback));
}
