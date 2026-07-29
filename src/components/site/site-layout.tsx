import type { ReactNode } from "react";

import { useSite } from "@/lib/site-context";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsappFab } from "./whatsapp-fab";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { theme, notFound } = useSite();

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Site não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este endereço não corresponde a nenhum site publicado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-site-theme={theme} className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsappFab />
    </div>
  );
}
