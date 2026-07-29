-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL DEFAULT 'Marcenaria',
  tagline text NOT NULL DEFAULT '',
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  hero_cta text NOT NULL DEFAULT 'Pedir orçamento',
  about_text text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  opening_hours text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  years_experience integer NOT NULL DEFAULT 20,
  projects_done integer NOT NULL DEFAULT 1000,
  show_prices boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "categories admin read" ON public.categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AMBIENTES
CREATE TABLE public.ambientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ambientes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ambientes TO authenticated;
GRANT ALL ON public.ambientes TO service_role;
ALTER TABLE public.ambientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ambientes public read" ON public.ambientes FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ambientes admin read" ON public.ambientes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "ambientes admin write" ON public.ambientes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  wood_type text NOT NULL DEFAULT 'Madeira maciça',
  dimensions text NOT NULL DEFAULT '',
  price numeric(10,2),
  sale_price numeric(10,2),
  images text[] NOT NULL DEFAULT '{}',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ambiente_id uuid REFERENCES public.ambientes(id) ON DELETE SET NULL,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "products admin read" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  city text NOT NULL DEFAULT '',
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "testimonials admin read" ON public.testimonials FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- LEADS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request a quote" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage leads" ON public.leads FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SEED
INSERT INTO public.site_settings (brand_name, tagline, hero_title, hero_subtitle, hero_cta, about_text, phone, whatsapp, email, address, opening_hours, instagram, facebook, years_experience, projects_done)
VALUES (
 'Marcenaria Raiz',
 'Móveis rústicos em madeira maciça',
 'Móveis de madeira maciça feitos pra durar gerações',
 'Peças únicas, produção própria e acabamento artesanal. Do desenho à entrega, tudo feito na nossa oficina.',
 'Pedir orçamento no WhatsApp',
 'Somos uma marcenaria familiar especializada em móveis rústicos de madeira maciça e madeira de demolição. Cada peça é cortada, montada e acabada à mão na nossa oficina, com encaixes reforçados e acabamento que respeita a veia natural da madeira.',
 '(11) 90000-0000', '5511900000000', 'contato@marcenariaraiz.com.br',
 'Rod. dos Marceneiros, km 12 - Interior de SP',
 'Segunda a sexta 8h-18h · Sábado 8h-13h',
 'https://instagram.com/', 'https://facebook.com/', 25, 4200);

INSERT INTO public.ambientes (name, slug, sort_order) VALUES
 ('Sala de Jantar', 'sala-de-jantar', 1),
 ('Cozinha', 'cozinha', 2),
 ('Sala de Estar', 'sala-de-estar', 3),
 ('Quarto', 'quarto', 4),
 ('Área Gourmet', 'area-gourmet', 5),
 ('Escritório', 'escritorio', 6);

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
 ('Mesas', 'mesas', 'Mesas de jantar e centro em madeira maciça', 1),
 ('Cristaleiras', 'cristaleiras', 'Cristaleiras e vitrines rústicas', 2),
 ('Buffets e Aparadores', 'buffets-e-aparadores', 'Buffets, aparadores e balcões', 3),
 ('Armários', 'armarios', 'Armários e paneleiros de cozinha', 4),
 ('Racks e Painéis', 'racks-e-paineis', 'Racks e painéis para TV', 5),
 ('Camas e Quartos', 'camas-e-quartos', 'Camas, criados-mudos e cômodas', 6),
 ('Bancos e Cadeiras', 'bancos-e-cadeiras', 'Bancos, cadeiras e banquetas', 7),
 ('Sob Medida', 'sob-medida', 'Projetos exclusivos sob medida', 8);

INSERT INTO public.testimonials (author, city, content, rating, sort_order) VALUES
 ('Ana Paula M.', 'Campinas - SP', 'A mesa chegou melhor do que nas fotos. Madeira pesada de verdade, acabamento impecável. Já encomendei o buffet.', 5, 1),
 ('Rogério T.', 'Belo Horizonte - MG', 'Fizeram a cristaleira sob medida pro vão da minha sala. Atendimento direto com o marceneiro, sem enrolação.', 5, 2),
 ('Carla e Bruno', 'Curitiba - PR', 'Mobiliamos a área gourmet inteira. Prazo cumprido e entrega montada. Recomendo demais.', 5, 3);