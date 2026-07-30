import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";
import { type Product } from "@/lib/site-data";


export function ProductCard({
  product,
  showPrice = true,
}: {
  product: Product;
  showPrice?: boolean;
}) {
  const { t, formatPrice } = useI18n();
  const { theme } = useSite();
  const isStore = theme === "kee";
  const cover = product.images?.[0] ?? "/produtos/oficina.jpg";
  const hasSale = product.sale_price != null && product.price != null;
  const discount =
    hasSale && product.price
      ? Math.round(((product.price - (product.sale_price ?? 0)) / product.price) * 100)
      : 0;
  const finalPrice = product.sale_price ?? product.price ?? null;

  return (
    <SiteLink
      page="produto"
      productSlug={product.slug}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className={`relative overflow-hidden bg-muted ${isStore ? "aspect-square" : "aspect-4/3"}`}>
        <img
          src={cover}
          alt={product.name}
          loading="lazy"
          className={`size-full transition-transform duration-500 group-hover:scale-105 ${
            isStore ? "object-contain p-2" : "object-cover"
          }`}
        />
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
        <h3 className="font-display text-base leading-snug sm:text-lg">{product.name}</h3>
        {isStore ? null : (
          <>
            <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">{product.short_description}</p>
            <p className="line-clamp-1 text-[0.7rem] uppercase tracking-wide text-muted-foreground sm:text-xs">
              {product.wood_type}
              {product.dimensions ? ` · ${product.dimensions}` : ""}
            </p>
          </>
        )}

        {showPrice ? (
          <div className="mt-auto pt-3">
            {finalPrice == null ? (
              <span className="text-sm text-muted-foreground">Preço sob consulta</span>
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
                    em até <strong>10x</strong> de <strong>{formatPrice(finalPrice / 10)}</strong> sem juros
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
