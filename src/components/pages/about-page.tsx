import { Hammer, Leaf, Users } from "lucide-react";

import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";

export function AboutPageView() {
  const { settings } = useSite();
  const { t, formatNumber } = useI18n();

  const valores = [
    { icon: Hammer, title: t("about.value1.title"), text: t("about.value1.text") },
    { icon: Leaf, title: t("about.value2.title"), text: t("about.value2.text") },
    { icon: Users, title: t("about.value3.title"), text: t("about.value3.text") },
  ];

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="site-container py-10 sm:py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("about.eyebrow")}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{t("about.title")}</h1>
        </div>
      </div>

      <section className="site-container grid gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-10 lg:items-center">
        <img
          src="/produtos/oficina.jpg"
          alt={t("about.title")}
          className="aspect-4/3 w-full rounded-lg object-cover"
        />
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">{t("about.subtitle")}</h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{settings?.about_text}</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="font-display text-2xl text-wood sm:text-3xl">{settings?.years_experience}+</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t("home.stats.years")}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-wood sm:text-3xl">
                {formatNumber(settings?.projects_done ?? 0)}+
              </p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t("home.stats.pieces")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-10 sm:py-14">
        <div className="site-container grid gap-6 sm:grid-cols-3 sm:gap-8">
          {valores.map((v) => (
            <div key={v.title}>
              <v.icon className="size-6 text-wood" />
              <p className="mt-3 font-display text-lg">{v.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
        <h2 className="font-display text-2xl sm:text-3xl">{t("about.ctaTitle")}</h2>
        <p className="mt-3 text-muted-foreground">{t("about.ctaText")}</p>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90">
            <SiteLink page="contato">{t("about.ctaPrimary")}</SiteLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <SiteLink page="produtos">{t("home.viewCatalog")}</SiteLink>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
