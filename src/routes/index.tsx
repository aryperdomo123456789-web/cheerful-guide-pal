import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Axe, Hammer, Ruler, ShieldCheck, Star, TreePine, Truck } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import {
  ambientesQuery,
  categoriesQuery,
  productsQuery,
  settingsQuery,
  testimonialsQuery,
  whatsappLink,
} from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marcenaria Raiz — Móveis rústicos em madeira maciça" },
      {
        name: "description",
        content:
          "Mesas, cristaleiras, buffets, armários e projetos sob medida em madeira maciça e madeira de demolição. Produção própria, entrega montada.",
      },
      { property: "og:title", content: "Marcenaria Raiz — Móveis rústicos em madeira maciça" },
      {
        property: "og:description",
        content:
          "Móveis rústicos feitos à mão na nossa oficina: mesas, cristaleiras, buffets e projetos sob medida.",
      },
    ],
  }),
  component: HomePage,
});

const diferenciais = [
  { icon: TreePine, title: "Madeira maciça de verdade", text: "Peroba, demolição e maciços nobres. Nada de MDF disfarçado." },
  { icon: Hammer, title: "Fabricação própria", text: "Da tábua bruta ao acabamento final, tudo sai da nossa oficina." },
  { icon: Ruler, title: "Sob medida", text: "Ajustamos medidas, cor e ferragens ao seu ambiente." },
  { icon: Truck, title: "Entrega montada", text: "Enviamos para todo o Brasil com montagem nas principais capitais." },
];

const etapas = [
  { n: "01", title: "Conversa", text: "Você manda as medidas e fotos do espaço pelo WhatsApp." },
  { n: "02", title: "Projeto e orçamento", text: "Desenhamos a peça, definimos madeira, acabamento e prazo." },
  { n: "03", title: "Oficina", text: "Corte, montagem, lixamento e acabamento feitos à mão." },
  { n: "04", title: "Entrega", text: "Embalamos, transportamos e montamos na sua casa." },
];

function HomePage() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: products } = useQuery(productsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: ambientes } = useQuery(ambientesQuery);
  const { data: testimonials } = useQuery(testimonialsQuery);

  const destaques = (products ?? []).filter((p) => p.is_featured).slice(0, 6);
  const showPrices = settings?.show_prices ?? true;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate">
        <img
          src="/produtos/hero-sala-jantar.jpg"
          alt="Sala de jantar com mesa de madeira maciça"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
        <div className="mx-auto max-w-6xl px-4 py-28 sm:py-36">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            {settings?.tagline}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-white sm:text-6xl">
            {settings?.hero_title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">{settings?.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90">
              <a
                href={whatsappLink(settings?.whatsapp ?? "", "Olá! Quero um orçamento de móvel em madeira maciça.")}
                target="_blank"
                rel="noreferrer"
              >
                {settings?.hero_cta ?? "Pedir orçamento"}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/produtos">Ver catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="border-b border-border bg-sand">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
          {[
            { v: `${settings?.years_experience ?? 0}+`, l: "anos de oficina" },
            { v: `${(settings?.projects_done ?? 0).toLocaleString("pt-BR")}+`, l: "peças entregues" },
            { v: "100%", l: "madeira maciça" },
            { v: "5 anos", l: "de garantia estrutural" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-2xl text-wood sm:text-3xl">{s.v}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Catálogo</p>
            <h2 className="mt-2 font-display text-3xl">Escolha por tipo de móvel</h2>
          </div>
          <Link to="/produtos" className="hidden text-sm font-medium text-ember hover:underline sm:block">
            Ver tudo
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.slug }}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-wood hover:bg-sand"
            >
              <Axe className="size-5 text-wood" />
              <p className="mt-3 font-display text-lg leading-tight">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* AMBIENTES */}
      <section className="bg-sand py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl">Ou navegue por ambiente</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {(ambientes ?? []).map((a) => (
              <Link
                key={a.id}
                to="/produtos"
                search={{ ambiente: a.slug }}
                className="rounded-full border border-wood/40 bg-background px-4 py-2 text-sm font-medium text-wood transition-colors hover:bg-wood hover:text-wood-foreground"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Da oficina</p>
        <h2 className="mt-2 font-display text-3xl">Peças em destaque</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((p) => (
            <ProductCard key={p.id} product={p} showPrice={showPrices} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/produtos">Ver catálogo completo</Link>
          </Button>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((d) => (
            <div key={d.title}>
              <d.icon className="size-6 text-wood" />
              <p className="mt-3 font-display text-lg">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESSO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <img
            src="/produtos/oficina.jpg"
            alt="Interior da oficina de marcenaria"
            className="aspect-4/3 w-full rounded-lg object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Como funciona</p>
            <h2 className="mt-2 font-display text-3xl">Do seu espaço à peça pronta</h2>
            <div className="mt-8 space-y-6">
              {etapas.map((e) => (
                <div key={e.n} className="flex gap-4">
                  <span className="font-display text-xl text-wood">{e.n}</span>
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl">Quem já tem em casa</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {(testimonials ?? []).map((t) => (
              <figure key={t.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex gap-0.5 text-ember">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.content}"</blockquote>
                <figcaption className="mt-4 text-sm font-medium">
                  {t.author}
                  <span className="block text-xs font-normal text-muted-foreground">{t.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <ShieldCheck className="mx-auto size-8 text-wood" />
        <h2 className="mt-4 font-display text-3xl">Vamos tirar seu móvel do papel?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Mande as medidas do espaço e uma foto. Devolvemos projeto e orçamento sem compromisso.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90">
            <a
              href={whatsappLink(settings?.whatsapp ?? "", "Olá! Quero um orçamento.")}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contato">Enviar pelo formulário</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
