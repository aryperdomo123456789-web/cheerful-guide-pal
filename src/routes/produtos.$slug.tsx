import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Check, Ruler, TreePine } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { QuoteForm } from "@/components/site/quote-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import {
  ambientesQuery,
  categoriesQuery,
  formatPrice,
  productsQuery,
  settingsQuery,
  whatsappLink,
} from "@/lib/site-data";

export const Route = createFileRoute("/produtos/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Marcenaria Raiz` },
      {
        name: "description",
        content: "Móvel em madeira maciça com fabricação própria, medidas sob medida e entrega montada.",
      },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Marcenaria Raiz` },
      {
        property: "og:description",
        content: "Peça artesanal em madeira maciça. Peça seu orçamento pelo WhatsApp.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products } = useQuery(productsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: ambientes } = useQuery(ambientesQuery);
  const { data: settings } = useQuery(settingsQuery);
  const [active, setActive] = useState(0);

  const product = products?.find((p) => p.slug === slug);
  const showPrices = settings?.show_prices ?? true;

  if (!products) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">Carregando...</div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Peça não encontrada</h1>
          <Button asChild className="mt-6">
            <Link to="/produtos">Voltar ao catálogo</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const category = categories?.find((c) => c.id === product.category_id);
  const ambiente = ambientes?.find((a) => a.id === product.ambiente_id);
  const related = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 3);
  const images = product.images.length ? product.images : ["/produtos/oficina.jpg"];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/produtos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar ao catálogo
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={images[active]}
                alt={product.name}
                className="aspect-4/3 w-full object-cover"
              />
            </div>
            {images.length > 1 ? (
              <div className="mt-3 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`size-20 overflow-hidden rounded-md border-2 ${
                      i === active ? "border-ember" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {category?.name}
              {ambiente ? ` · ${ambiente.name}` : ""}
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            <div className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-5 text-sm">
              <p className="flex items-center gap-2">
                <TreePine className="size-4 text-wood" /> <strong>Madeira:</strong> {product.wood_type}
              </p>
              <p className="flex items-center gap-2">
                <Ruler className="size-4 text-wood" /> <strong>Medidas:</strong>{" "}
                {product.dimensions || "Sob medida"}
              </p>
              <p className="flex items-center gap-2">
                <Check className="size-4 text-wood" /> Adaptamos medidas, cor e ferragens
              </p>
            </div>

            {showPrices ? (
              <div className="mt-6">
                {product.sale_price != null && product.price != null ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    <span className="font-display text-4xl text-ember">{formatPrice(product.sale_price)}</span>
                  </div>
                ) : (
                  <span className="font-display text-4xl">{formatPrice(product.price)}</span>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Frete e montagem calculados no orçamento.
                </p>
              </div>
            ) : null}

            <Button
              asChild
              size="lg"
              className="mt-6 w-full bg-ember text-ember-foreground hover:bg-ember/90 sm:w-auto"
            >
              <a
                href={whatsappLink(
                  settings?.whatsapp ?? "",
                  `Olá! Tenho interesse na peça: ${product.name}`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Pedir orçamento no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Prefere que a gente te chame?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Deixe seus dados que respondemos em até 1 dia útil.
            </p>
            <div className="mt-6">
              <QuoteForm productName={product.name} />
            </div>
          </div>

          {related.length ? (
            <div>
              <h2 className="font-display text-2xl">Peças parecidas</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} showPrice={showPrices} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </SiteLayout>
  );
}
