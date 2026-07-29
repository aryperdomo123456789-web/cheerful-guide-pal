import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { formatPrice, type Product } from "@/lib/site-data";

export function ProductCard({
  product,
  showPrice = true,
}: {
  product: Product;
  showPrice?: boolean;
}) {
  const cover = product.images?.[0] ?? "/produtos/oficina.jpg";
  const hasSale = product.sale_price != null && product.price != null;

  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={cover}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_featured ? (
          <Badge className="absolute left-3 top-3 bg-ember text-ember-foreground">Destaque</Badge>
        ) : null}
        {hasSale ? (
          <Badge variant="secondary" className="absolute right-3 top-3">
            Promoção
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.wood_type}
          {product.dimensions ? ` · ${product.dimensions}` : ""}
        </p>

        {showPrice ? (
          <div className="mt-auto pt-3">
            {hasSale ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="font-display text-xl text-ember">{formatPrice(product.sale_price)}</span>
              </div>
            ) : (
              <span className="font-display text-xl">{formatPrice(product.price)}</span>
            )}
          </div>
        ) : (
          <span className="mt-auto pt-3 text-sm font-medium text-ember">Ver detalhes</span>
        )}
      </div>
    </Link>
  );
}
