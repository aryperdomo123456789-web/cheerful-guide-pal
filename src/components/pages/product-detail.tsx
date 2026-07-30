import { ArrowLeft, MessageCircle, Ruler, TreePine } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/site/product-card";
import { QuoteForm } from "@/components/site/quote-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

export function ProductDetailView({ slug }: { slug: string }) {
  const { settings, products, categories, ambientes, isLoading } = useSite();
  const { t, formatPrice } = useI18n();
  const [active, setActive] = useState(0);

  const product = products.find((p) => p.slug === slug);
  const showPrice = settings?.show_prices ?? true;

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <h1 className="font-display text-2xl sm:text-3xl">
            {isLoading ? t("products.loading") : t("detail.notFound")}
          </h1>
          {!isLoading ? (
            <>
              <p className="mt-3 text-muted-foreground">{t("detail.notFoundText")}</p>
              <Button asChild className="mt-6 bg-ember text-ember-foreground hover:bg-ember/90">
                <SiteLink page="produtos">{t("home.viewCatalog")}</SiteLink>
              </Button>
            </>
          ) : null}
        </div>
      </SiteLayout>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const ambiente = ambientes.find((a) => a.id === product.ambiente_id);
  const images = product.images?.length ? product.images : ["/produtos/oficina.jpg"];
  const related = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);

  return (
    <SiteLayout>
      <div className="site-container py-6 sm:py-8">
        <SiteLink
          page="produtos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> {t("detail.back")}
        </SiteLink>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <img src={images[active]} alt={product.name} className="aspect-4/3 w-full object-cover" />
            </div>
            {images.length > 1 ? (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-md border sm:size-20 ${
                      i === active ? "border-ember" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {category ? <Badge variant="secondary">{category.name}</Badge> : null}
              {ambiente ? <Badge variant="outline">{ambiente.name}</Badge> : null}
              {product.is_featured ? (
                <Badge className="bg-ember text-ember-foreground">{t("card.featured")}</Badge>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.short_description}</p>

            {showPrice ? (
              <div className="mt-6 flex flex-wrap items-end gap-3">
                {product.sale_price != null && product.price != null ? (
                  <>
                    <span className="font-display text-2xl text-ember sm:text-3xl">
                      {formatPrice(product.sale_price)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
                )}
              </div>
            ) : null}

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <TreePine className="mt-0.5 size-4 shrink-0 text-wood" /> {product.wood_type}
              </li>
              {product.dimensions ? (
                <li className="flex gap-3">
                  <Ruler className="mt-0.5 size-4 shrink-0 text-wood" /> {product.dimensions}
                </li>
              ) : null}
            </ul>

            <Button asChild size="lg" className="mt-7 w-full bg-ember text-ember-foreground hover:bg-ember/90">
              <a
                href={whatsappLink(
                  settings?.whatsapp ?? "",
                  t("wa.product", { product: product.name }),
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 size-4" /> {t("detail.quoteWhatsapp")}
              </a>
            </Button>

            {product.description ? (
              <div className="mt-8">
                <h2 className="font-display text-xl">{t("detail.about")}</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <section className="mt-12 rounded-lg border border-border bg-card p-4 sm:mt-16 sm:p-8">
          <h2 className="font-display text-xl sm:text-2xl">{t("detail.quoteTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("detail.quoteText")}</p>
          <div className="mt-6">
            <QuoteForm productName={product.name} />
          </div>
        </section>

        {related.length ? (
          <section className="mt-12 sm:mt-16">
            <h2 className="font-display text-xl sm:text-2xl">{t("detail.related")}</h2>
            <div className="mt-6 grid gap-5 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} showPrice={showPrice} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
