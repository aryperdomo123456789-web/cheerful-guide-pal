import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiteLink, useSite, type SitePage } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

const navItems: { page: SitePage; label: string }[] = [
  { page: "home", label: "Início" },
  { page: "produtos", label: "Produtos" },
  { page: "sobre", label: "A Marcenaria" },
  { page: "contato", label: "Contato" },
];

export function SiteHeader() {
  const { settings } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-20">
        <SiteLink page="home" className="mr-auto flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {settings?.brand_name ?? "Marcenaria"}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            {settings?.tagline ?? "madeira maciça"}
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

        <Button asChild className="hidden bg-ember text-ember-foreground hover:bg-ember/90 sm:inline-flex">
          <a
            href={whatsappLink(settings?.whatsapp ?? "", "Olá! Vim pelo site e quero um orçamento.")}
            target="_blank"
            rel="noreferrer"
          >
            <Phone className="mr-2 size-4" />
            Orçamento
          </a>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-10 flex flex-col gap-1">
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
                Área administrativa
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
