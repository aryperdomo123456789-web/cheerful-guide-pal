import { createFileRoute } from "@tanstack/react-router";

import { HomePageView } from "@/components/pages/home-page";
import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marcenaria Raiz — móveis rústicos em madeira maciça" },
      {
        name: "description",
        content:
          "Móveis rústicos em madeira maciça e de demolição: mesas, cristaleiras, buffets, camas e projetos sob medida com entrega em todo o Brasil.",
      },
      { property: "og:title", content: "Marcenaria Raiz — móveis rústicos em madeira maciça" },
      {
        property: "og:description",
        content: "Fabricação própria, madeira maciça e projetos sob medida. Peça seu orçamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteProvider>
      <HomePageView />
    </SiteProvider>
  ),
});
