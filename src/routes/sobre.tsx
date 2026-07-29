import { createFileRoute } from "@tanstack/react-router";

import { AboutPageView } from "@/components/pages/about-page";
import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "A Marcenaria — história, oficina e processo | Marcenaria Raiz" },
      {
        name: "description",
        content:
          "Conheça a oficina: marcenaria familiar especializada em madeira maciça e de demolição, com produção artesanal e entrega em todo o Brasil.",
      },
      { property: "og:title", content: "A Marcenaria — história, oficina e processo" },
      {
        property: "og:description",
        content: "Marcenaria familiar de móveis rústicos em madeira maciça, com produção 100% própria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteProvider>
      <AboutPageView />
    </SiteProvider>
  ),
});
