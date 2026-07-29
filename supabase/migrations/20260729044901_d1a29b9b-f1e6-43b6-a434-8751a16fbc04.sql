
-- 1. SITES
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  theme text NOT NULL DEFAULT 'rustico',
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sites public read" ON public.sites
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "sites admin read" ON public.sites
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "sites admin write" ON public.sites
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER sites_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.sites (slug, name, theme, is_primary, sort_order)
VALUES ('principal', 'Site principal', 'rustico', true, 0),
       ('segundo', 'Segundo site', 'moderno', false, 1);

-- 2. SITE_ID em todas as tabelas de conteudo
ALTER TABLE public.site_settings ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE;
ALTER TABLE public.categories   ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE;
ALTER TABLE public.ambientes    ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE;
ALTER TABLE public.products     ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE;
ALTER TABLE public.testimonials ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE;
ALTER TABLE public.leads        ADD COLUMN site_id uuid REFERENCES public.sites(id) ON DELETE SET NULL;

UPDATE public.site_settings SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;
UPDATE public.categories   SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;
UPDATE public.ambientes    SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;
UPDATE public.products     SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;
UPDATE public.testimonials SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;
UPDATE public.leads        SET site_id = (SELECT id FROM public.sites WHERE is_primary) WHERE site_id IS NULL;

ALTER TABLE public.site_settings ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE public.categories   ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE public.ambientes    ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE public.products     ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE public.testimonials ALTER COLUMN site_id SET NOT NULL;

CREATE UNIQUE INDEX site_settings_site_id_key ON public.site_settings(site_id);
CREATE INDEX categories_site_id_idx   ON public.categories(site_id);
CREATE INDEX ambientes_site_id_idx    ON public.ambientes(site_id);
CREATE INDEX products_site_id_idx     ON public.products(site_id);
CREATE INDEX testimonials_site_id_idx ON public.testimonials(site_id);
CREATE INDEX leads_site_id_idx        ON public.leads(site_id);

-- 3. Configuracoes iniciais do segundo site
INSERT INTO public.site_settings (site_id, brand_name, tagline, hero_title, hero_subtitle, hero_cta, about_text, phone, whatsapp, email, address, opening_hours, instagram, facebook, years_experience, projects_done, show_prices)
SELECT s.id,
       'Segunda Marca',
       'móveis sob medida',
       'Móveis que atravessam gerações',
       'Peças em madeira maciça feitas à mão, do projeto à entrega.',
       'Pedir orçamento',
       'Segunda marca do grupo, com atendimento próprio e catálogo independente.',
       ss.phone, ss.whatsapp, ss.email, ss.address, ss.opening_hours, '', '', 20, 1000, true
FROM public.sites s
CROSS JOIN LATERAL (SELECT * FROM public.site_settings LIMIT 1) ss
WHERE s.is_primary = false;
