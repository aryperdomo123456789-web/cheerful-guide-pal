import { MessageCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site-context";
import { whatsappLink } from "@/lib/site-data";

export function WhatsappFab() {
  const { settings } = useSite();
  const { t } = useI18n();
  if (!settings?.whatsapp) return null;

  return (
    <a
      href={whatsappLink(settings.whatsapp, t("wa.generic"))}
      target="_blank"
      rel="noreferrer"
      aria-label={t("home.ctaWhatsapp")}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-semibold text-ember-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
