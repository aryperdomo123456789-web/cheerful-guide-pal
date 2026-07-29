import { createFileRoute } from "@tanstack/react-router";

import { ProductsPageView } from "@/components/pages/products-page";
import { validateProductSearch, type ProductSearch } from "@/lib/product-search";

export const Route = createFileRoute("/s/$site/produtos")({
  validateSearch: validateProductSearch,
  head: () => ({
    meta: [
      { title: "Catálogo de móveis — marca parceira" },
      {
        name: "description",
        content: "Filtre o catálogo por categoria e ambiente e peça seu orçamento.",
      },
      { property: "og:title", content: "Catálogo de móveis — marca parceira" },
      { property: "og:description", content: "Móveis em madeira maciça, filtráveis por categoria e ambiente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsRoute,
});

function ProductsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ProductsPageView
      search={search}
      setSearch={(patch) =>
        navigate({ search: (prev: ProductSearch) => ({ ...prev, ...patch }), replace: true })
      }
      clearFilters={() => navigate({ search: { ordem: search.ordem }, replace: true })}
    />
  );
}
