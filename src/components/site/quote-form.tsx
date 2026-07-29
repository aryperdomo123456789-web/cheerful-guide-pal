import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/lib/site-context";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  email: z.string().trim().max(255).email("E-mail inválido").or(z.literal("")),
  city: z.string().trim().max(100),
  message: z.string().trim().max(1000),
});

export function QuoteForm({ productName = "" }: { productName?: string }) {
  const { siteId } = useSite();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: productName ? `Tenho interesse em: ${productName}` : "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      }
      const { error } = await supabase.from("leads").insert({
        ...parsed.data,
        product_name: productName,
        site_id: siteId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pedido enviado! Entramos em contato em breve.");
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
          <Label htmlFor="q-name">Nome *</Label>
          <Input
            id="q-name"
            maxLength={100}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-phone">WhatsApp / Telefone *</Label>
          <Input
            id="q-phone"
            maxLength={30}
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-email">E-mail</Label>
          <Input
            id="q-email"
            type="email"
            maxLength={255}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-city">Cidade</Label>
          <Input
            id="q-city"
            maxLength={100}
            value={values.city}
            onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="q-message">O que você precisa?</Label>
        <Textarea
          id="q-message"
          rows={4}
          maxLength={1000}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          placeholder="Conte a peça, as medidas do espaço e o prazo desejado."
        />
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="bg-ember text-ember-foreground hover:bg-ember/90"
      >
        {mutation.isPending ? "Enviando..." : "Solicitar orçamento"}
      </Button>
    </form>
  );
}
