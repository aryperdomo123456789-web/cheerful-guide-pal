import { createFileRoute } from "@tanstack/react-router";

import { AboutPageView } from "@/components/pages/about-page";

export const Route = createFileRoute("/s/$site/sobre")({
  head: () => ({
    meta: [
      { title: "A marcenaria — marca parceira" },
      { name: "description", content: "História, oficina e processo de fabricação em madeira maciça." },
      { property: "og:title", content: "A marcenaria — marca parceira" },
      { property: "og:description", content: "Produção artesanal em madeira maciça e de demolição." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPageView,
});
