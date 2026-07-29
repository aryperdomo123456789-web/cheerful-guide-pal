import { createFileRoute } from "@tanstack/react-router";

import { ProductsPageView } from "@/components/pages/products-page";
import { validateProductSearch, type ProductSearch } from "@/lib/product-search";
import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/produtos/")({
  validateSearch: validateProductSearch,
  head: () => ({
    meta: [
      { title: "Catálogo de móveis rústicos — Marcenaria Raiz" },
      {
        name: "description",
        content:
          "Catálogo completo de móveis em madeira maciça: mesas, cristaleiras, buffets, armários, racks e camas. Filtre por categoria e ambiente.",
      },
      { property: "og:title", content: "Catálogo de móveis rústicos — Marcenaria Raiz" },
      {
        property: "og:description",
        content: "Filtre por categoria, ambiente e preço e peça seu orçamento pelo WhatsApp.",
      },
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
    <SiteProvider>
      <ProductsPageView
        search={search}
        setSearch={(patch) =>
          navigate({ search: (prev: ProductSearch) => ({ ...prev, ...patch }), replace: true })
        }
        clearFilters={() => navigate({ search: { ordem: search.ordem }, replace: true })}
      />
    </SiteProvider>
  );
}
