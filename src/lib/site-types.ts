/**
 * Tipos de domínio do site (multi-tenant).
 *
 * Mantidos separados das queries para que componentes possam importar
 * apenas os tipos, sem arrastar o client do banco para o bundle.
 */

export type SiteTheme = "rustico" | "moderno" | "kee";

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
  popup_enabled: boolean;
  popup_title: string;
  popup_subtitle: string;
  popup_cta: string;
  popup_image_url: string;
  popup_coupon: string;
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
  /** Etiquetas extras: permitem que a peça apareça em abas como Promoções ou Pronta Entrega. */
  tags?: string[] | null;
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

export type LeadStatus = "novo" | "em-contato" | "orcado" | "fechado" | "perdido";

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
