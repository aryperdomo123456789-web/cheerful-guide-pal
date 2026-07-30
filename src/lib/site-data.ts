import { supabase } from "@/integrations/supabase/client";

export type SiteTheme = "rustico" | "moderno";

export type Site = {
  id: string;
  slug: string;
  name: string;
  theme: string;
  is_primary: boolean;
  is_active: boolean;
  sort_order: number;
};

export type SiteSettings = {
  id: string;
  site_id: string;
  brand_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  about_text: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  opening_hours: string;
  instagram: string;
  facebook: string;
  years_experience: number;
  projects_done: number;
  show_prices: boolean;
  language: string;
  currency: string;
  favicon_url: string;

};

export type Category = {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Ambiente = {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  wood_type: string;
  dimensions: string;
  price: number | null;
  sale_price: number | null;
  images: string[];
  category_id: string | null;
  ambiente_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  site_id: string;
  author: string;
  city: string;
  content: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
};

export type Lead = {
  id: string;
  site_id: string | null;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  product_name: string;
  status: string;
  created_at: string;
};

/** Lista de sites publicados (o painel usa a mesma query). */
export const sitesQuery = {
  queryKey: ["sites"],
  queryFn: async (): Promise<Site[]> => {
    const { data, error } = await supabase.from("sites").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Site[];
  },
};

const empty = "00000000-0000-0000-0000-000000000000";

export const settingsQuery = (siteId?: string | null) => ({
  queryKey: ["site_settings", siteId ?? null],
  enabled: Boolean(siteId),
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("site_id", siteId ?? empty)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as SiteSettings | null;
  },
});

export const categoriesQuery = (siteId?: string | null) => ({
  queryKey: ["categories", siteId ?? null],
  enabled: Boolean(siteId),
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("site_id", siteId ?? empty)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
});

export const ambientesQuery = (siteId?: string | null) => ({
  queryKey: ["ambientes", siteId ?? null],
  enabled: Boolean(siteId),
  queryFn: async (): Promise<Ambiente[]> => {
    const { data, error } = await supabase
      .from("ambientes")
      .select("*")
      .eq("site_id", siteId ?? empty)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Ambiente[];
  },
});

export const productsQuery = (siteId?: string | null) => ({
  queryKey: ["products", siteId ?? null],
  enabled: Boolean(siteId),
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("site_id", siteId ?? empty)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const testimonialsQuery = (siteId?: string | null) => ({
  queryKey: ["testimonials", siteId ?? null],
  enabled: Boolean(siteId),
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("site_id", siteId ?? empty)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },
});

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
