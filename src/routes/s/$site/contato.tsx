import { createFileRoute } from "@tanstack/react-router";

import { ContactPageView } from "@/components/pages/contact-page";

export const Route = createFileRoute("/s/$site/contato")({
  head: () => ({
    meta: [
      { title: "Contato e orçamento — marca parceira" },
      { name: "description", content: "WhatsApp, telefone, e-mail e formulário de orçamento." },
      { property: "og:title", content: "Contato e orçamento — marca parceira" },
      { property: "og:description", content: "Fale direto com a marcenaria e receba um orçamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPageView,
});
