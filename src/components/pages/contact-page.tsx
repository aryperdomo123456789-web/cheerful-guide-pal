import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { QuoteForm } from "@/components/site/quote-form";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

export function ContactPageView() {
  const { settings } = useSite();
  const { t } = useI18n();

  return (
    <SiteLayout>
      <div className="border-b border-border bg-sand">
        <div className="site-container py-10 sm:py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("contact.eyebrow")}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{t("contact.title")}</h1>
        </div>
      </div>

      <div className="site-container grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div>
          <h2 className="font-display text-xl sm:text-2xl">{t("contact.formTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("contact.formText")}</p>
          <div className="mt-8">
            <QuoteForm />
          </div>
        </div>

        <aside className="space-y-6 rounded-lg border border-border bg-card p-5 sm:p-6">
          <div>
            <p className="font-display text-xl">{settings?.brand_name}</p>
            <p className="text-sm text-muted-foreground">{settings?.tagline}</p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex min-w-0 gap-3 break-words">
              <Phone className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.phone}
            </li>
            <li className="flex min-w-0 gap-3 break-words">
              <Mail className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.email}
            </li>
            <li className="flex min-w-0 gap-3 break-words">
              <MapPin className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.address}
            </li>
            <li className="flex min-w-0 gap-3 break-words">
              <Clock className="mt-0.5 size-4 shrink-0 text-wood" />
              {settings?.opening_hours}
            </li>
          </ul>
          <Button asChild className="w-full bg-ember text-ember-foreground hover:bg-ember/90">
            <a href={whatsappLink(settings?.whatsapp ?? "", t("wa.about"))} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 size-4" /> {t("contact.whatsapp")}
            </a>
          </Button>
        </aside>
      </div>
    </SiteLayout>
  );
}
