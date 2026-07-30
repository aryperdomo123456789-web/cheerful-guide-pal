import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Facebook, Instagram, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState, type FormEvent } from "react";

import { SiteSwitcher } from "@/components/site/site-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite, useSiteHref } from "@/lib/site-context";
import { useAutoTranslate } from "@/lib/auto-translate";

/**
 * Cabeçalho no estilo loja (Site 2 / tema K&E):
 * barra de aviso + contato, faixa da marca com busca, e menu verde com
 * categorias e ambientes vindos do banco.
 */
export function KeeHeader() {
  const { settings, categories, ambientes } = useSite();
  const { t } = useI18n();
  const tr = useAutoTranslate();
  const href = useSiteHref();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<null | "moveis" | "ambientes">(null);

  const target = href("produtos");

  const goSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate({
      to: target.to,
      params: target.params,
      search: { q: term.trim() || undefined },
    } as never);
  };

  const catLink = (slug: string) => ({ categoria: slug });

  const flat = [
    { label: t("kee.cane"), search: catLink("moveis-palhinha") },
    { label: `${t("kee.new")} ⭐`, search: catLink("lancamentos") },
    { label: t("kee.sets"), search: catLink("conjuntos") },
    { label: t("kee.promos"), search: catLink("promocoes") },
    { label: t("kee.ready"), search: catLink("pronta-entrega") },
  ];

  const menuCats = categories.filter(
    (c) => !flat.some((f) => f.search.categoria === c.slug),
  );

  return (
    <header className="sticky top-0 z-40">
      {/* faixa de aviso */}
      <div className="bg-wood py-2 text-center text-[0.7rem] font-medium text-primary-foreground sm:text-xs">
        {tr(settings?.tagline) || t("nav.quote")}
      </div>

      {/* contato + social */}
      <div className="hidden bg-wood/95 py-2 text-primary-foreground md:block">
        <div className="site-container flex items-center justify-between text-xs">
          <span className="truncate opacity-90">
            {settings?.phone} {settings?.opening_hours ? `· ${settings.opening_hours}` : ""}
          </span>
          <span className="flex items-center gap-3 opacity-90">
            {settings?.facebook ? (
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook className="size-4" />
              </a>
            ) : null}
            {settings?.instagram ? (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="size-4" />
              </a>
            ) : null}
          </span>
        </div>
      </div>

      {/* marca + busca */}
      <div className="bg-wood pb-4 pt-3 text-primary-foreground">
        <div className="site-container flex items-center gap-3 sm:gap-6">
          <SiteLink page="home" className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-xl tracking-[0.12em] sm:text-3xl">
              {settings?.brand_name ?? "K&E"}
            </span>
            <span className="truncate text-[0.55rem] uppercase tracking-[0.3em] opacity-80 sm:text-[0.65rem]">
              {t("kee.rustic")}
            </span>
          </SiteLink>

          <form onSubmit={goSearch} className="relative hidden flex-1 md:block">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("kee.searchPlaceholder")}
              className="h-12 w-full rounded-md bg-background px-4 pr-12 text-sm text-foreground outline-hidden"
            />
            <button
              type="submit"
              aria-label={t("kee.search")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Search className="size-5" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-3 md:ml-0">
            <Link to="/auth" className="hidden min-h-11 items-center gap-2 px-2 text-sm sm:flex">
              <User className="size-5" />
              {t("kee.account")}
            </Link>
            <SiteLink
              page="produtos"
              className="flex size-11 items-center justify-center"
              aria-label={t("kee.catalog")}
            >
              <ShoppingCart className="size-5" />
            </SiteLink>


            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 shrink-0 border-primary-foreground/30 bg-transparent text-primary-foreground lg:hidden"
                  aria-label={t("nav.menu")}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
                <div className="mt-10">
                  <SiteSwitcher className="w-full" />
                </div>
                <nav className="mt-4 flex flex-col gap-1 pb-10">
                  <SiteLink page="produtos" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-medium">
                    {t("kee.allFurniture")}
                  </SiteLink>
                  {flat.map((item) => (
                    <SiteLink
                      key={item.label}
                      page="produtos"
                      search={item.search}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-3 text-sm hover:bg-muted"
                    >
                      {item.label}
                    </SiteLink>
                  ))}
                  <p className="mt-3 px-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("kee.categories")}
                  </p>
                  {menuCats.map((c) => (
                    <SiteLink
                      key={c.id}
                      page="produtos"
                      search={catLink(c.slug)}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {tr(c.name)}
                    </SiteLink>
                  ))}
                  <p className="mt-3 px-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("kee.rooms")}
                  </p>
                  {ambientes.map((a) => (
                    <SiteLink
                      key={a.id}
                      page="produtos"
                      search={{ ambiente: a.slug }}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {tr(a.name)}
                    </SiteLink>
                  ))}
                  <SiteLink page="sobre" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm">
                    {t("nav.about")}
                  </SiteLink>
                  <SiteLink page="contato" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm">
                    {t("nav.contact")}
                  </SiteLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* busca mobile */}
        <form onSubmit={goSearch} className="site-container relative mt-3 md:hidden">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t("kee.searchPlaceholder")}
            className="h-12 w-full rounded-md bg-background px-4 pr-12 text-base text-foreground outline-hidden"
          />
          <button
            type="submit"
            aria-label={t("kee.search")}
            className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground sm:right-6"
          >
            <Search className="size-5" />
          </button>
        </form>

      </div>

      {/* menu de navegação */}
      <div className="hidden border-t border-primary-foreground/15 bg-wood text-primary-foreground lg:block">
        <div
          className="site-container flex items-center justify-between"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="relative" onMouseEnter={() => setOpenMenu("moveis")}>
            <SiteLink page="produtos" className="flex items-center gap-2 px-3 py-4 text-sm">
              <Menu className="size-4" />
              {t("kee.furniture")}
              <ChevronDown className="size-3" />
            </SiteLink>
            {openMenu === "moveis" ? (
              <div className="absolute left-0 top-full z-50 grid w-[min(720px,calc(100vw-3rem))] grid-cols-2 gap-1 rounded-b-md border border-border bg-background p-4 text-foreground shadow-xl xl:grid-cols-3">
                {menuCats.map((c) => (
                  <SiteLink
                    key={c.id}
                    page="produtos"
                    search={catLink(c.slug)}
                    className="rounded px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {tr(c.name)}
                  </SiteLink>
                ))}
              </div>
            ) : null}
          </div>

          {flat.slice(0, 3).map((item) => (
            <SiteLink key={item.label} page="produtos" search={item.search} className="px-3 py-4 text-sm">
              {item.label}
            </SiteLink>
          ))}

          <div className="relative" onMouseEnter={() => setOpenMenu("ambientes")}>
            <SiteLink page="produtos" className="flex items-center gap-2 px-3 py-4 text-sm">
              {t("kee.rooms")}
              <ChevronDown className="size-3" />
            </SiteLink>
            {openMenu === "ambientes" ? (
              <div className="absolute left-0 top-full z-50 grid w-[280px] gap-1 rounded-b-md border border-border bg-background p-4 text-foreground shadow-xl">
                {ambientes.map((a) => (
                  <SiteLink
                    key={a.id}
                    page="produtos"
                    search={{ ambiente: a.slug }}
                    className="rounded px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    {tr(a.name)}
                  </SiteLink>
                ))}
              </div>
            ) : null}
          </div>

          {flat.slice(3).map((item) => (
            <SiteLink key={item.label} page="produtos" search={item.search} className="px-3 py-4 text-sm">
              {item.label}
            </SiteLink>
          ))}

          <SiteSwitcher className="h-9 w-[170px] shrink-0 text-xs" />
        </div>
      </div>
    </header>
  );
}
