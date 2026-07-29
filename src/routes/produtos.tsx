import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ambientesQuery, categoriesQuery, productsQuery, settingsQuery } from "@/lib/site-data";

type ProductSearch = {
  categoria?: string;
  ambiente?: string;
  q?: string;
  ordem?: "relevancia" | "menor-preco" | "maior-preco" | "nome";
};

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
    ambiente: typeof search.ambiente === "string" ? search.ambiente : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    ordem:
      search.ordem === "menor-preco" ||
      search.ordem === "maior-preco" ||
      search.ordem === "nome" ||
      search.ordem === "relevancia"
        ? search.ordem
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo de móveis rústicos — Marcenaria Raiz" },
      {
        name: "description",
        content:
          "Catálogo completo de móveis em madeira maciça: mesas, cristaleiras, buffets, armários, racks, camas e projetos sob medida. Filtre por categoria e ambiente.",
      },
      { property: "og:title", content: "Catálogo de móveis rústicos — Marcenaria Raiz" },
      {
        property: "og:description",
        content: "Filtre por categoria, ambiente e preço e peça seu orçamento pelo WhatsApp.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: settings } = useQuery(settingsQuery);
  const { data: products, isLoading } = useQuery(productsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: ambientes } = useQuery(ambientesQuery);

  const showPrices = settings?.show_prices ?? true;

  const setSearch = (patch: Partial<ProductSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const filtered = useMemo(() => {
    const categoryId = categories?.find((c) => c.slug === search.categoria)?.id;
    const ambienteId = ambientes?.find((a) => a.slug === search.ambiente)?.id;
    const term = (search.q ?? "").trim().toLowerCase();

    let list = (products ?? []).filter((p) => {
      if (categoryId && p.category_id !== categoryId) return false;
      if (ambienteId && p.ambiente_id !== ambienteId) return false;
      if (term && !`${p.name} ${p.short_description} ${p.wood_type}`.toLowerCase().includes(term))
        return false;
      return true;
    });

    const value = (p: (typeof list)[number]) => p.sale_price ?? p.price ?? Number.MAX_SAFE_INTEGER;
    if (search.ordem === "menor-preco") list = [...list].sort((a, b) => value(a) - value(b));
    if (search.ordem === "maior-preco") list = [...list].sort((a, b) => value(b) - value(a));
    if (search.ordem === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return list;
  }, [products, categories, ambientes, search]);

  const hasFilters = Boolean(search.categoria || search.ambiente || search.q);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl">Nossos móveis</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Todas as peças podem ser adaptadas em medida, tipo de madeira e acabamento. Preço final confirmado no
            orçamento.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        {/* FILTROS */}
        <aside className="space-y-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-wood" />
            <p className="font-display text-lg">Filtros</p>
            {hasFilters ? (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-xs"
                onClick={() =>
                  navigate({ search: { ordem: search.ordem }, replace: true })
                }
              >
                <X className="mr-1 size-3" /> limpar
              </Button>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="busca">Buscar</Label>
            <Input
              id="busca"
              placeholder="Mesa, cristaleira, peroba..."
              value={search.q ?? ""}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Categoria</p>
            <div className="flex flex-col gap-1">
              <FilterButton
                active={!search.categoria}
                onClick={() => setSearch({ categoria: undefined })}
                label="Todas"
              />
              {(categories ?? []).map((c) => (
                <FilterButton
                  key={c.id}
                  active={search.categoria === c.slug}
                  onClick={() => setSearch({ categoria: c.slug })}
                  label={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Ambiente</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={!search.ambiente}
                onClick={() => setSearch({ ambiente: undefined })}
                label="Todos"
              />
              {(ambientes ?? []).map((a) => (
                <FilterChip
                  key={a.id}
                  active={search.ambiente === a.slug}
                  onClick={() => setSearch({ ambiente: a.slug })}
                  label={a.name}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* LISTA */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : `${filtered.length} peça(s) encontrada(s)`}
            </p>
            <Select
              value={search.ordem ?? "relevancia"}
              onValueChange={(v) => setSearch({ ordem: v as ProductSearch["ordem"] })}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Ordenar: relevância</SelectItem>
                <SelectItem value="menor-preco">Menor preço</SelectItem>
                <SelectItem value="maior-preco">Maior preço</SelectItem>
                <SelectItem value="nome">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 && !isLoading ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-display text-xl">Nenhuma peça com esses filtros</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Fazemos sob medida — fale com a gente e criamos a peça do seu jeito.
              </p>
              <Button asChild className="mt-5 bg-ember text-ember-foreground hover:bg-ember/90">
                <Link to="/contato">Pedir sob medida</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} showPrice={showPrices} />
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-wood text-wood-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-ember bg-ember text-ember-foreground"
          : "border-border text-muted-foreground hover:border-wood hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
