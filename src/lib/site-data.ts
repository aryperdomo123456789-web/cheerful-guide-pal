import { supabase } from "@/integrations/supabase/client";

export type {
  Ambiente,
  Category,
  Lead,
  LeadStatus,
  Product,
  Site,
  SiteSettings,
  SiteTheme,
  Testimonial,
} from "@/lib/site-types";

import type {
  Ambiente,
  Category,
  Product,
  Site,
  SiteSettings,
  Testimonial,
} from "@/lib/site-types";

/** UUID neutro: mantém a query válida enquanto o site ainda não resolveu. */
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

/** Tabelas que pertencem a um site (multi-tenant). */
type SiteScopedTable = "site_settings" | "categories" | "ambientes" | "products" | "testimonials";

/**
 * Fábrica única para todas as listas com escopo de site.
 * Antes cada entidade repetia o mesmo bloco de select/eq/order/throw.
 */
function siteScopedList<T>(table: SiteScopedTable, siteId: string | null | undefined) {
  return {
    queryKey: [table, siteId ?? null] as const,
    enabled: Boolean(siteId),
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("site_id", siteId ?? NIL_UUID)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as T[];
    },
  };
}

/** Lista de sites publicados (site público e painel usam a mesma query). */
export const sitesQuery = {
  queryKey: ["sites"] as const,
  queryFn: async (): Promise<Site[]> => {
    const { data, error } = await supabase.from("sites").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Site[];
  },
};

export const settingsQuery = (siteId?: string | null) => ({
  queryKey: ["site_settings", siteId ?? null] as const,
  enabled: Boolean(siteId),
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("site_id", siteId ?? NIL_UUID)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as SiteSettings | null;
  },
});

export const categoriesQuery = (siteId?: string | null) =>
  siteScopedList<Category>("categories", siteId);

export const ambientesQuery = (siteId?: string | null) =>
  siteScopedList<Ambiente>("ambientes", siteId);

export const productsQuery = (siteId?: string | null) => siteScopedList<Product>("products", siteId);

export const testimonialsQuery = (siteId?: string | null) =>
  siteScopedList<Testimonial>("testimonials", siteId);

/* ---------------- formatação ---------------- */

export function formatPrice(value: number | null | undefined) {
  if (value == null) return "Sob consulta";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function whatsappLink(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
