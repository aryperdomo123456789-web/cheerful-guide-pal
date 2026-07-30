import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site-context";
import { useAutoTranslate } from "@/lib/auto-translate";

export const POPUP_LEAD_TAG = "Popup - Cupom";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
});

export function PromoPopup() {
  const { siteId, settings } = useSite();
  const { t } = useI18n();
  const tr = useAutoTranslate();
  const enabled = settings?.popup_enabled ?? false;
  const storageKey = siteId ? `promo-popup-${siteId}` : "";

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState({ name: "", email: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!enabled || !storageKey) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(storageKey)) return;

    const show = () => setOpen(true);
    const timer = window.setTimeout(show, 1200);
    window.addEventListener("click", show, { once: true });
    window.addEventListener("scroll", show, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("click", show);
      window.removeEventListener("scroll", show);
    };
  }, [enabled, storageKey]);

  const close = () => {
    setOpen(false);
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "1");
    }
  };

  if (!open || !enabled) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t("popup.error"));
      return;
    }
    setSending(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: "",
      city: "",
      message: settings?.popup_title ?? "",
      product_name: POPUP_LEAD_TAG,
      site_id: siteId,
    });
    setSending(false);
    if (error) {
      toast.error(t("popup.error"));
      return;
    }
    setDone(true);
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "1");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={close}
      role="presentation"
    >
      <div
        className={`relative grid max-h-[90vh] w-full overflow-y-auto rounded-lg bg-card shadow-xl ${settings?.popup_image_url ? "max-w-3xl md:grid-cols-2" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("popup.close")}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-foreground transition-colors hover:bg-background"
        >
          <X className="size-4" />
        </button>

        {settings?.popup_image_url ? (
          <img
            src={settings.popup_image_url}
            alt=""
            className="hidden h-full max-h-[70vh] w-full object-cover md:block"
          />
        ) : null}

        <div className="flex flex-col justify-center gap-4 p-6 text-center sm:p-8">
          {done ? (
            <>
              <h2 className="font-display text-2xl leading-tight sm:text-3xl">
                {t("popup.doneTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("popup.doneText")}
              </p>
              <p className="rounded-md border border-dashed border-border py-3 font-display text-2xl tracking-widest text-ember">
                {settings?.popup_coupon || "BEMVINDO5"}
              </p>
              <Button
                onClick={close}
                className="bg-ember text-ember-foreground hover:bg-ember/90"
              >
                {t("popup.enter")}
              </Button>
            </>
          ) : (
            <form className="grid gap-4" onSubmit={submit}>
              <h2 className="font-display text-2xl leading-tight sm:text-3xl">
                {tr(settings?.popup_title)}
              </h2>
              <p className="text-sm text-muted-foreground">{tr(settings?.popup_subtitle)}</p>
              <Input
                placeholder={t("popup.namePlaceholder")}
                maxLength={100}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder={t("popup.emailPlaceholder")}
                maxLength={255}
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                required
              />
              <Button
                type="submit"
                disabled={sending}
                className="bg-ember text-ember-foreground hover:bg-ember/90"
              >
                {sending ? t("form.sending") : tr(settings?.popup_cta) || t("popup.cta")}
              </Button>
              <button
                type="button"
                onClick={close}
                className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
              >
                {t("popup.enter")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
