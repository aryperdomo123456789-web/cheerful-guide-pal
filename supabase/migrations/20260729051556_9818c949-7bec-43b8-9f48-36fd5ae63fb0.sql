UPDATE public.site_settings st SET hero_cta = 'Falar no WhatsApp', updated_at = now()
FROM public.sites s WHERE s.id = st.site_id AND s.slug = 'kee';