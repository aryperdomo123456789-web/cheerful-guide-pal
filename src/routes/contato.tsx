import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { QuoteForm } from "@/components/site/quote-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { settingsQuery, whatsappLink } from "@/lib/site-data";

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
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Fale com a gente</p>
          <h1 className="mt-2 font-display text-4xl">Contato e orçamento</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="font-display text-2xl">Conte o que você precisa</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quanto mais detalhes (medidas, foto do espaço, prazo), mais preciso fica o orçamento.
          </p>
          <div className="mt-8">
            <QuoteForm />
          </div>
        </div>

        <aside className="space-y-6 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="font-display text-xl">{settings?.brand_name}</p>
            <p className="text-sm text-muted-foreground">{settings?.tagline}</p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.email}
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.address}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.opening_hours}
            </li>
          </ul>
          <Button asChild className="w-full bg-ember text-ember-foreground hover:bg-ember/90">
            <a
              href={whatsappLink(settings?.whatsapp ?? "", "Olá! Quero falar sobre um móvel.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 size-4" /> Chamar no WhatsApp
            </a>
          </Button>
        </aside>
      </div>
    </SiteLayout>
  );
}
