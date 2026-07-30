ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS popup_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS popup_title text NOT NULL DEFAULT 'Ganhe 5% OFF na sua primeira compra!',
  ADD COLUMN IF NOT EXISTS popup_subtitle text NOT NULL DEFAULT 'Cadastre-se e receba promoções e novidades',
  ADD COLUMN IF NOT EXISTS popup_cta text NOT NULL DEFAULT 'Gerar cupom',
  ADD COLUMN IF NOT EXISTS popup_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS popup_coupon text NOT NULL DEFAULT 'BEMVINDO5';