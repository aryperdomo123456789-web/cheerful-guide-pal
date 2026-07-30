CREATE TABLE public.content_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lang text NOT NULL,
  source_hash text NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX content_translations_lang_hash_idx ON public.content_translations (lang, source_hash);

GRANT SELECT ON public.content_translations TO anon;
GRANT SELECT ON public.content_translations TO authenticated;
GRANT ALL ON public.content_translations TO service_role;

ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are public to read"
ON public.content_translations FOR SELECT
USING (true);