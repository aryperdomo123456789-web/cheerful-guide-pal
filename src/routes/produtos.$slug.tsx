import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailView } from "@/components/pages/product-detail";
import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/produtos/$slug")({
  head: () => ({
    meta: [
      { title: "Móvel em madeira maciça — Marcenaria Raiz" },
      {
        name: "description",
        content:
          "Detalhes da peça: madeira, medidas, acabamento e orçamento sob medida direto com a marcenaria.",
      },
      { property: "og:title", content: "Móvel em madeira maciça — Marcenaria Raiz" },
      { property: "og:description", content: "Peça feita à mão em madeira maciça, adaptável em medidas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return (
    <SiteProvider>
      <ProductDetailView slug={slug} />
    </SiteProvider>
  );
}
