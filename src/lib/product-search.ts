export type ProductSearch = {
  categoria?: string;
  ambiente?: string;
  q?: string;
  ordem?: "relevancia" | "menor-preco" | "maior-preco" | "nome";
};

export function validateProductSearch(search: Record<string, unknown>): ProductSearch {
  return {
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
    ambiente: typeof search.ambiente === "string" ? search.ambiente : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    ordem:
      search.ordem === "menor-preco" ||
      search.ordem === "maior-preco" ||
      search.ordem === "nome" ||
      search.ordem === "relevancia"
        ? search.ordem
        : undefined,
  };
}
