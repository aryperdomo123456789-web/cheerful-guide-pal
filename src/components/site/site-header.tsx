import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiteSwitcher } from "@/components/site/site-switcher";
import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite, type SitePage } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

export function SiteHeader() {
  const { settings } = useSite();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const navItems: { page: SitePage; label: string }[] = [
    { page: "home", label: t("nav.home") },
    { page: "produtos", label: t("nav.products") },
    { page: "sobre", label: t("nav.about") },
    { page: "contato", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="site-container flex h-16 items-center gap-3 sm:h-20 sm:gap-4">
        <SiteLink page="home" className="mr-auto flex min-w-0 flex-col leading-none">
          <span className="truncate font-display text-lg font-semibold tracking-tight sm:text-2xl">
            {settings?.brand_name ?? "Marcenaria"}
          </span>
          <span className="truncate text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.22em]">
            {settings?.tagline ?? ""}
          </span>
        </SiteLink>


        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <SiteLink
              key={item.page}
              page={item.page}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </SiteLink>
          ))}
        </nav>

        <SiteSwitcher className="hidden h-9 w-[190px] text-xs lg:flex" />

        <Button asChild className="hidden bg-ember text-ember-foreground hover:bg-ember/90 sm:inline-flex">
          <a
            href={whatsappLink(settings?.whatsapp ?? "", t("wa.generic"))}
            target="_blank"
            rel="noreferrer"
          >
            <Phone className="mr-2 size-4" />
            {t("nav.quote")}
          </a>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label={t("nav.menu")}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-10">
              <p className="mb-2 px-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {t("nav.brandTheme")}
              </p>
              <SiteSwitcher className="w-full" />
            </div>
            <nav className="mt-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <SiteLink
                  key={item.page}
                  page={item.page}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                </SiteLink>
              ))}
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-muted"
              >
                {t("nav.admin")}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
