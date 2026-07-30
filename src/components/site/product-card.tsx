import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";
import { useAutoTranslate } from "@/lib/auto-translate";
import { type Product } from "@/lib/site-data";


export function ProductCard({
  product,
  showPrice = true,
}: {
  product: Product;
  showPrice?: boolean;
}) {
  const { t, formatPrice } = useI18n();
  const tr = useAutoTranslate();
  const { theme } = useSite();
  const isStore = theme === "kee";
  const cover = product.images?.[0] ?? "/produtos/oficina.jpg";
  const alt = product.images?.[1] ?? null;
  const hasSale = product.sale_price != null && product.price != null;
  const discount =
    hasSale && product.price
      ? Math.round(((product.price - (product.sale_price ?? 0)) / product.price) * 100)
      : 0;
  const finalPrice = product.sale_price ?? product.price ?? null;

  // Troca de imagem: hover no desktop, visibilidade/toque no mobile.
  const mediaRef = useRef<HTMLDivElement>(null);
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    if (!alt) return;
    const el = mediaRef.current;
    if (!el || typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSwapped(entry.isIntersecting && entry.intersectionRatio > 0.65),
      { threshold: [0, 0.65, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [alt]);

  return (
    <SiteLink
      page="produto"
      productSlug={product.slug}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div
        ref={mediaRef}
        onTouchStart={() => (alt ? setSwapped(true) : undefined)}
        className={`relative overflow-hidden bg-muted ${isStore ? "aspect-square" : "aspect-4/3"}`}
      >
        <img
          src={cover}
          alt={tr(product.name)}
          loading="lazy"
          className={`size-full transition-all duration-500 group-hover:scale-105 ${
            isStore ? "object-contain p-2" : "object-cover"
          } ${alt ? (swapped ? "opacity-0" : "opacity-100 group-hover:opacity-0") : ""}`}
        />
        {alt ? (
          <img
            src={alt}
            alt={tr(product.name)}
            loading="lazy"
            aria-hidden
            className={`absolute inset-0 size-full transition-all duration-500 group-hover:scale-105 ${
              isStore ? "object-contain p-2" : "object-cover"
            } ${swapped ? "opacity-100 scale-105" : "opacity-0 group-hover:opacity-100"}`}
          />
        ) : null}

        {isStore ? (
          discount > 0 ? (
            <span className="absolute left-3 top-3 flex size-12 flex-col items-center justify-center rounded-full bg-ember text-[0.65rem] font-bold leading-tight text-ember-foreground">
              {discount}%<span>OFF</span>
            </span>
          ) : null
        ) : (
          <>
            {product.is_featured ? (
              <Badge className="absolute left-3 top-3 bg-ember text-ember-foreground">
                {t("card.featured")}
              </Badge>
            ) : null}
            {hasSale ? (
              <Badge variant="secondary" className="absolute right-3 top-3">
                {t("card.sale")}
              </Badge>
            ) : null}
          </>
        )}
      </div>


      <div className={`flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4 ${isStore ? "text-center" : ""}`}>
        <h3 className="font-display text-base leading-snug sm:text-lg">{tr(product.name)}</h3>
        {isStore ? null : (
          <>
            <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">{tr(product.short_description)}</p>
            <p className="line-clamp-1 text-[0.7rem] uppercase tracking-wide text-muted-foreground sm:text-xs">
              {tr(product.wood_type)}
              {product.dimensions ? ` · ${product.dimensions}` : ""}
            </p>
          </>
        )}

        {showPrice ? (
          <div className="mt-auto pt-3">
            {finalPrice == null ? (
              <span className="text-sm text-muted-foreground">{t("card.onRequestPrice")}</span>
            ) : (
              <>
                {hasSale ? (
                  <div className={`flex items-baseline gap-2 ${isStore ? "justify-center" : ""}`}>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="font-display text-lg text-ember sm:text-xl">
                      {formatPrice(product.sale_price)}
                    </span>
                  </div>
                ) : (
                  <span className="font-display text-lg sm:text-xl">{formatPrice(product.price)}</span>
                )}
                {isStore ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("card.installments", { n: 10, value: formatPrice(finalPrice / 10) })}
                  </p>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <span className="mt-auto pt-3 text-sm font-medium text-ember">{t("card.details")}</span>
        )}
      </div>

    </SiteLink>
  );
}
