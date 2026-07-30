import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Panel, ToggleField } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { useImageUpload } from "@/hooks/use-image-upload";
import { CURRENCIES, LANGUAGES } from "@/lib/i18n";
import { settingsQuery } from "@/lib/site-data";
import type { SiteSettings } from "@/lib/site-types";

type SettingsValue = string | number | boolean;

export function SettingsPanel() {
  const siteId = useAdminSiteId();
  const { data: settings } = useQuery(settingsQuery(siteId));
  const table = useAdminTable("site_settings");
  const { uploadOne } = useImageUpload();
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <Panel title="Configurações do site">Carregando...</Panel>;

  const set = (key: keyof SiteSettings, value: SettingsValue) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));

  const save = async () => {
    const { id, ...patch } = form;
    await table.update(id, patch, "Configurações salvas");
  };

  const pickImage = async (file: File | undefined, key: "favicon_url" | "popup_image_url") => {
    const url = await uploadOne(file);
    if (url) set(key, url);
  };

  return (
    <Panel
      title="Configurações do site"
      action={
        <Button
          onClick={() => void save()}
          disabled={table.isSaving}
          className="bg-ember text-ember-foreground hover:bg-ember/90"
        >
          {table.isSaving ? "Salvando..." : "Salvar"}
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
        <Field
          label="Idioma do site"
          hint="Troca global: todos os textos fixos do site mudam na hora."
        >
          <Select value={form.language || "pt-BR"} onValueChange={(v) => set("language", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.flag} {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Moeda" hint="Usada para exibir todos os preços do catálogo.">
          <Select value={form.currency || "BRL"} onValueChange={(v) => set("currency", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Ícone do site (favicon)"
          hint="Imagem quadrada (PNG/ICO/SVG) que aparece na aba do navegador."
        >
          <div className="flex flex-wrap items-center gap-3">
            {form.favicon_url ? (
              <img
                src={form.favicon_url}
                alt="Favicon atual"
                className="size-8 rounded border border-border bg-background object-contain"
              />
            ) : null}
            <Input
              type="file"
              accept="image/png,image/x-icon,image/svg+xml,image/jpeg,image/webp"
              onChange={(e) => void pickImage(e.target.files?.[0], "favicon_url")}
            />
            {form.favicon_url ? (
              <Button variant="ghost" size="sm" onClick={() => set("favicon_url", "")}>
                Remover
              </Button>
            ) : null}
          </div>
        </Field>
        <Field label="Ícone por URL (opcional)" hint="Ex.: /favicon.png ou link completo.">
          <Input
            value={form.favicon_url}
            onChange={(e) => set("favicon_url", e.target.value)}
            placeholder="/meu-icone.png"
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-md border border-border p-4">
        <p className="font-display text-lg">Pop-up de captação (cupom)</p>
        <ToggleField
          label="Exibir pop-up no primeiro acesso"
          checked={form.popup_enabled}
          onChange={(v) => set("popup_enabled", v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título do pop-up">
            <Input value={form.popup_title} onChange={(e) => set("popup_title", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Input
              value={form.popup_subtitle}
              onChange={(e) => set("popup_subtitle", e.target.value)}
            />
          </Field>
          <Field label="Texto do botão">
            <Input value={form.popup_cta} onChange={(e) => set("popup_cta", e.target.value)} />
          </Field>
          <Field label="Código do cupom">
            <Input
              value={form.popup_coupon}
              onChange={(e) => set("popup_coupon", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Imagem do pop-up" hint="Aparece ao lado do formulário no desktop.">
          <div className="flex flex-wrap items-center gap-3">
            {form.popup_image_url ? (
              <img
                src={form.popup_image_url}
                alt="Imagem do pop-up"
                className="h-16 w-24 rounded border border-border object-cover"
              />
            ) : null}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => void pickImage(e.target.files?.[0], "popup_image_url")}
            />
            {form.popup_image_url ? (
              <Button variant="ghost" size="sm" onClick={() => set("popup_image_url", "")}>
                Remover
              </Button>
            ) : null}
          </div>
        </Field>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Nome da marca">
          <Input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} />
        </Field>
        <Field label="Slogan">
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Telefone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp (com DDI/DDD)" hint="ex.: 5511999999999">
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="E-mail">
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Endereço">
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Horário de atendimento">
          <Input value={form.opening_hours} onChange={(e) => set("opening_hours", e.target.value)} />
        </Field>
        <Field label="Instagram (URL)">
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
        <Field label="Facebook (URL)">
          <Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
        </Field>
        <Field label="Anos de oficina">
          <Input
            type="number"
            value={form.years_experience}
            onChange={(e) => set("years_experience", Number(e.target.value))}
          />
        </Field>
        <Field label="Peças entregues">
          <Input
            type="number"
            value={form.projects_done}
            onChange={(e) => set("projects_done", Number(e.target.value))}
          />
        </Field>
        <Field label="Botão principal do banner">
          <Input value={form.hero_cta} onChange={(e) => set("hero_cta", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Título do banner">
          <Input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
        </Field>
        <Field label="Subtítulo do banner">
          <Textarea
            rows={2}
            value={form.hero_subtitle}
            onChange={(e) => set("hero_subtitle", e.target.value)}
          />
        </Field>
        <Field label="Texto 'A Marcenaria'">
          <Textarea
            rows={5}
            value={form.about_text}
            onChange={(e) => set("about_text", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <ToggleField
          label="Mostrar preços no site"
          checked={form.show_prices}
          onChange={(v) => set("show_prices", v)}
        />
      </div>
    </Panel>
  );
}
