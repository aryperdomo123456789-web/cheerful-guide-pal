import { Hammer, Leaf, Users } from "lucide-react";

import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { SiteLink, useSite } from "@/lib/site-context";

const valores = [
  { icon: Hammer, title: "Feito à mão", text: "Cada peça passa pela bancada, não por uma linha de montagem." },
  { icon: Leaf, title: "Madeira com história", text: "Trabalhamos com maciços nobres e madeira de demolição." },
  { icon: Users, title: "Marcenaria familiar", text: "Atendimento direto com quem fabrica, do projeto à entrega." },
];

export function AboutPageView() {
  const { settings } = useSite();

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
          {valores.map((v) => (
            <div key={v.title}>
              <v.icon className="size-6 text-wood" />
              <p className="mt-3 font-display text-lg">{v.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl">Quer conhecer a oficina?</h2>
        <p className="mt-3 text-muted-foreground">
          Agende uma visita ou mande sua ideia — respondemos com projeto e orçamento.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90">
            <SiteLink page="contato">Falar com a marcenaria</SiteLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <SiteLink page="produtos">Ver catálogo</SiteLink>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
