import { createFileRoute } from "@tanstack/react-router";

import { ContactPageView } from "@/components/pages/contact-page";
import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e orçamento — Marcenaria Raiz" },
      {
        name: "description",
        content:
          "Peça um orçamento de móvel em madeira maciça: WhatsApp, telefone, e-mail e endereço da oficina.",
      },
      { property: "og:title", content: "Contato e orçamento — Marcenaria Raiz" },
      {
        property: "og:description",
        content: "Fale direto com a marcenaria e receba projeto e orçamento sem compromisso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteProvider>
      <ContactPageView />
    </SiteProvider>
  ),
});
