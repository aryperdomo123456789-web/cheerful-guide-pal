import { useEffect, type ReactNode } from "react";

import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site-context";
import { useAutoTranslate } from "@/lib/auto-translate";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { PromoPopup } from "./promo-popup";
import { WhatsappFab } from "./whatsapp-fab";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { theme, notFound, settings } = useSite();
  const { t, language } = useI18n();

  const faviconUrl = settings?.favicon_url ?? "";

  useEffect(() => {
    if (typeof document === "undefined" || !faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  useEffect(() => {
    if (typeof document === "undefined" || !language) return;
    document.documentElement.lang = language;
  }, [language]);


  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">{t("site.notFound")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("site.notFoundText")}
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
      <PromoPopup />
    </div>
  );
}
