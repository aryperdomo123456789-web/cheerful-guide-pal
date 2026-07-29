import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hammer, Leaf, Users } from "lucide-react";

import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { settingsQuery } from "@/lib/site-data";

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
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Quem somos</p>
          <h1 className="mt-2 font-display text-4xl">A Marcenaria</h1>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
        <img
          src="/produtos/oficina.jpg"
          alt="Oficina de marcenaria com bancadas e ferramentas"
          className="aspect-4/3 w-full rounded-lg object-cover"
        />
        <div>
          <h2 className="font-display text-3xl">Madeira, mão e paciência</h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{settings?.about_text}</p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="font-display text-3xl text-wood">{settings?.years_experience}+</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">anos de oficina</p>
            </div>
            <div>
              <p className="font-display text-3xl text-wood">
                {(settings?.projects_done ?? 0).toLocaleString("pt-BR")}+
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">peças entregues</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
          {[
            { icon: Hammer, t: "Produção própria", d: "Nada terceirizado: quem desenha é quem executa." },
            { icon: Leaf, t: "Madeira com origem", d: "Reaproveitamento de demolição e madeira de manejo." },
            { icon: Users, t: "Atendimento direto", d: "Você fala com o marceneiro, não com um call center." },
          ].map((i) => (
            <div key={i.t}>
              <i.icon className="size-6 text-wood" />
              <p className="mt-3 font-display text-lg">{i.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl">Quer visitar a oficina?</h2>
        <p className="mt-3 text-muted-foreground">
          {settings?.address} · {settings?.opening_hours}
        </p>
        <Button asChild size="lg" className="mt-6 bg-ember text-ember-foreground hover:bg-ember/90">
          <Link to="/contato">Agendar visita</Link>
        </Button>
      </section>
    </SiteLayout>
  );
}
