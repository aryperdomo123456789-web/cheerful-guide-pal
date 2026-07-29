import { createFileRoute } from "@tanstack/react-router";

import { HomePageView } from "@/components/pages/home-page";

export const Route = createFileRoute("/s/$site/")({
  head: () => ({
    meta: [
      { title: "Móveis em madeira maciça — marca parceira" },
      {
        name: "description",
        content: "Catálogo de móveis em madeira maciça, fabricação própria e orçamento pelo WhatsApp.",
      },
      { property: "og:title", content: "Móveis em madeira maciça — marca parceira" },
      { property: "og:description", content: "Peças rústicas feitas à mão, sob medida para o seu espaço." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePageView,
});
