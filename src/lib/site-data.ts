import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
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
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Ambiente = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
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
  author: string;
  city: string;
  content: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  product_name: string;
  status: string;
  created_at: string;
};

export const settingsQuery = {
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as SiteSettings | null;
  },
};

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
};

export const ambientesQuery = {
  queryKey: ["ambientes"],
  queryFn: async (): Promise<Ambiente[]> => {
    const { data, error } = await supabase
      .from("ambientes")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Ambiente[];
  },
};

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Product[];
  },
};

export const testimonialsQuery = {
  queryKey: ["testimonials"],
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },
};

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
