import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site-context";

export function QuoteForm({ productName = "" }: { productName?: string }) {
  const { siteId } = useSite();
  const { t } = useI18n();

  const schema = z.object({
    name: z.string().trim().min(2, t("form.errName")).max(100),
    phone: z.string().trim().min(8, t("form.errPhone")).max(30),
    email: z.string().trim().max(255).email(t("form.errEmail")).or(z.literal("")),
    city: z.string().trim().max(100),
    message: z.string().trim().max(1000),
  });

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: productName ? t("form.interest", { product: productName }) : "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? t("form.errGeneric"));
      }
      const { error } = await supabase.from("leads").insert({
        ...parsed.data,
        product_name: productName,
        site_id: siteId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("form.success"));
      setValues({ name: "", phone: "", email: "", city: "", message: "" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="q-name">{t("form.name")}</Label>
          <Input
            id="q-name"
            maxLength={100}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-phone">{t("form.phone")}</Label>
          <Input
            id="q-phone"
            maxLength={30}
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-email">{t("form.email")}</Label>
          <Input
            id="q-email"
            type="email"
            maxLength={255}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-city">{t("form.city")}</Label>
          <Input
            id="q-city"
            maxLength={100}
            value={values.city}
            onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="q-message">{t("form.message")}</Label>
        <Textarea
          id="q-message"
          rows={4}
          maxLength={1000}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          placeholder={t("form.messagePlaceholder")}
        />
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-ember text-ember-foreground hover:bg-ember/90 sm:w-auto sm:justify-self-start"
      >
        {mutation.isPending ? t("form.sending") : t("form.submit")}
      </Button>
    </form>
  );
}
