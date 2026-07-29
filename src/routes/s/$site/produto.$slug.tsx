import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailView } from "@/components/pages/product-detail";

export const Route = createFileRoute("/s/$site/produto/$slug")({
  head: () => ({
    meta: [
      { title: "Detalhes da peça — marca parceira" },
      { name: "description", content: "Madeira, medidas, acabamento e orçamento direto com a marcenaria." },
      { property: "og:title", content: "Detalhes da peça — marca parceira" },
      { property: "og:description", content: "Peça feita à mão em madeira maciça, adaptável em medidas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductDetailView slug={slug} />;
}
