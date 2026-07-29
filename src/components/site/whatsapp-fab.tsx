import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { settingsQuery, whatsappLink } from "@/lib/site-data";

export function WhatsappFab() {
  const { data: settings } = useQuery(settingsQuery);
  if (!settings?.whatsapp) return null;

  return (
    <a
      href={whatsappLink(settings.whatsapp, "Olá! Vim pelo site e quero um orçamento.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-semibold text-ember-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
