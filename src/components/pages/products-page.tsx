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
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";
import type { ProductSearch } from "@/lib/product-search";

export function ProductsPageView({
  search,
  setSearch,
  clearFilters,
}: {
  search: ProductSearch;
  setSearch: (patch: Partial<ProductSearch>) => void;
  clearFilters: () => void;
}) {
  const { settings, products, categories, ambientes, isLoading } = useSite();
  const { t, language } = useI18n();
  const showPrices = settings?.show_prices ?? true;

  const filtered = useMemo(() => {
    const categoryId = categories.find((c) => c.slug === search.categoria)?.id;
    const ambienteId = ambientes.find((a) => a.slug === search.ambiente)?.id;
    const term = (search.q ?? "").trim().toLowerCase();

    let list = products.filter((p) => {
      if (categoryId && p.category_id !== categoryId) return false;
      if (ambienteId && p.ambiente_id !== ambienteId) return false;
      if (term && !`${p.name} ${p.short_description} ${p.wood_type}`.toLowerCase().includes(term))
        return false;
      return true;
    });

    const value = (p: (typeof list)[number]) => p.sale_price ?? p.price ?? Number.MAX_SAFE_INTEGER;
    if (search.ordem === "menor-preco") list = [...list].sort((a, b) => value(a) - value(b));
    if (search.ordem === "maior-preco") list = [...list].sort((a, b) => value(b) - value(a));
    if (search.ordem === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name, language));
    return list;
  }, [products, categories, ambientes, search, language]);

  const hasFilters = Boolean(search.categoria || search.ambiente || search.q);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("products.eyebrow")}</p>
          <h1 className="mt-2 font-display text-4xl">{t("products.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("products.intro")}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-wood" />
            <p className="font-display text-lg">{t("products.filters")}</p>
            {hasFilters ? (
              <Button variant="ghost" size="sm" className="ml-auto h-7 px-2 text-xs" onClick={clearFilters}>
                <X className="mr-1 size-3" /> {t("products.clear")}
              </Button>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="busca">{t("products.search")}</Label>
            <Input
              id="busca"
              placeholder={t("products.searchPlaceholder")}
              value={search.q ?? ""}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {t("products.category")}
            </p>
            <div className="flex flex-col gap-1">
              <FilterButton
                active={!search.categoria}
                onClick={() => setSearch({ categoria: undefined })}
                label={t("products.allF")}
              />
              {categories.map((c) => (
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
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{t("products.room")}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={!search.ambiente}
                onClick={() => setSearch({ ambiente: undefined })}
                label={t("products.allM")}
              />
              {ambientes.map((a) => (
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

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {isLoading ? t("products.loading") : t("products.count", { n: filtered.length })}
            </p>
            <Select
              value={search.ordem ?? "relevancia"}
              onValueChange={(v) => setSearch({ ordem: v as ProductSearch["ordem"] })}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">{t("products.sort.relevance")}</SelectItem>
                <SelectItem value="menor-preco">{t("products.sort.priceAsc")}</SelectItem>
                <SelectItem value="maior-preco">{t("products.sort.priceDesc")}</SelectItem>
                <SelectItem value="nome">{t("products.sort.name")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 && !isLoading ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-display text-xl">{t("products.emptyTitle")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("products.emptyText")}</p>
              <Button asChild className="mt-5 bg-ember text-ember-foreground hover:bg-ember/90">
                <SiteLink page="contato">{t("products.emptyCta")}</SiteLink>
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

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
