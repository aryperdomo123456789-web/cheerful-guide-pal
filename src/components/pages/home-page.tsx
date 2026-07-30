import { Axe, Hammer, Ruler, ShieldCheck, Star, TreePine, Truck } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

export function HomePageView() {
  const { settings, products, categories, ambientes, testimonials } = useSite();
  const { t, formatNumber } = useI18n();

  const destaques = products.filter((p) => p.is_featured).slice(0, 6);
  const showPrices = settings?.show_prices ?? true;

  const diferenciais = [
    { icon: TreePine, title: t("home.diff1.title"), text: t("home.diff1.text") },
    { icon: Hammer, title: t("home.diff2.title"), text: t("home.diff2.text") },
    { icon: Ruler, title: t("home.diff3.title"), text: t("home.diff3.text") },
    { icon: Truck, title: t("home.diff4.title"), text: t("home.diff4.text") },
  ];

  const etapas = [
    { n: "01", title: t("home.step1.title"), text: t("home.step1.text") },
    { n: "02", title: t("home.step2.title"), text: t("home.step2.text") },
    { n: "03", title: t("home.step3.title"), text: t("home.step3.text") },
    { n: "04", title: t("home.step4.title"), text: t("home.step4.text") },
  ];

  return (
    <SiteLayout>
      <section className="relative isolate">
        <img
          src="/produtos/hero-sala-jantar.jpg"
          alt={settings?.hero_title ?? ""}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/65 to-black/40 sm:bg-linear-to-r sm:from-black/80 sm:via-black/60 sm:to-black/25" />
        <div className="site-container py-16 sm:py-28 lg:py-36">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/70 sm:text-xs sm:tracking-[0.3em]">
            {settings?.tagline}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-white sm:mt-4 sm:text-5xl lg:text-6xl">
            {settings?.hero_title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
            {settings?.hero_subtitle}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="w-full bg-ember text-ember-foreground hover:bg-ember/90 sm:w-auto"
            >

              <a
                href={whatsappLink(settings?.whatsapp ?? "", t("wa.quote"))}
                target="_blank"
                rel="noreferrer"
              >
                {settings?.hero_cta || t("home.heroCta")}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <SiteLink page="produtos">{t("home.viewCatalog")}</SiteLink>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-sand">
        <div className="site-container grid grid-cols-2 gap-4 py-8 sm:grid-cols-4 sm:gap-6">
          {[
            { v: `${settings?.years_experience ?? 0}+`, l: t("home.stats.years") },
            { v: `${formatNumber(settings?.projects_done ?? 0)}+`, l: t("home.stats.pieces") },
            { v: "100%", l: t("home.stats.solid") },
            { v: t("home.stats.warrantyValue"), l: t("home.stats.warranty") },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-2xl text-wood sm:text-3xl">{s.v}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {t("home.catalogEyebrow")}
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">{t("home.catalogTitle")}</h2>
          </div>
          <SiteLink page="produtos" className="hidden text-sm font-medium text-ember hover:underline sm:block">
            {t("home.viewAll")}
          </SiteLink>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <SiteLink
              key={c.id}
              page="produtos"
              search={{ categoria: c.slug }}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-wood hover:bg-sand"
            >
              <Axe className="size-5 text-wood" />
              <p className="mt-3 font-display text-lg leading-tight">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
            </SiteLink>
          ))}
        </div>
      </section>

      <section className="bg-sand py-10 sm:py-14">
        <div className="site-container">
          <h2 className="font-display text-2xl sm:text-3xl">{t("home.roomsTitle")}</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {ambientes.map((a) => (
              <SiteLink
                key={a.id}
                page="produtos"
                search={{ ambiente: a.slug }}
                className="rounded-full border border-wood/40 bg-background px-4 py-2 text-sm font-medium text-wood transition-colors hover:bg-wood hover:text-wood-foreground"
              >
                {a.name}
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-12 sm:py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t("home.workshopEyebrow")}
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{t("home.featuredTitle")}</h2>
        <div className="mt-8 grid gap-5 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {destaques.map((p) => (
            <ProductCard key={p.id} product={p} showPrice={showPrices} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <SiteLink page="produtos">{t("home.fullCatalog")}</SiteLink>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-card py-12 sm:py-16">
        <div className="site-container grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {diferenciais.map((d) => (
            <div key={d.title}>
              <d.icon className="size-6 text-wood" />
              <p className="mt-3 font-display text-lg">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-center">
          <img
            src="/produtos/oficina.jpg"
            alt={t("home.howTitle")}
            className="aspect-4/3 w-full rounded-lg object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("home.howEyebrow")}</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">{t("home.howTitle")}</h2>
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

      <section className="bg-sand py-12 sm:py-16">
        <div className="site-container">
          <h2 className="font-display text-2xl sm:text-3xl">{t("home.testimonialsTitle")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {testimonials.map((tm) => (
              <figure key={tm.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex gap-0.5 text-ember">
                  {Array.from({ length: tm.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                  "{tm.content}"
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium">
                  {tm.author}
                  <span className="block text-xs font-normal text-muted-foreground">{tm.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-14 text-center sm:py-20">
        <ShieldCheck className="mx-auto size-8 text-wood" />
        <h2 className="mt-4 font-display text-3xl">{t("home.ctaTitle")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("home.ctaText")}</p>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90">
            <a href={whatsappLink(settings?.whatsapp ?? "", t("wa.short"))} target="_blank" rel="noreferrer">
              {t("home.ctaWhatsapp")}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <SiteLink page="contato">{t("home.ctaForm")}</SiteLink>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
