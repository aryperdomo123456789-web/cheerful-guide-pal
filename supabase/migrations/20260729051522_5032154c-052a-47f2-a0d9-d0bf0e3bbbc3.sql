UPDATE public.site_settings st SET
  brand_name = 'K&E Móveis Rústicos',
  tagline = 'Madeira maciça de demolição',
  hero_title = 'Móveis de madeira maciça de demolição',
  hero_subtitle = 'Peças exclusivas feitas à mão em Tiradentes — entrega para todo o Brasil e parcelamento em até 12x sem juros.',
  hero_cta = 'Ver catálogo',
  about_text = 'Trabalhamos com madeira de demolição selecionada, unindo o charme do rústico ao acabamento fino. Cada peça é única, feita por marceneiros experientes.',
  phone = '(32) 99999-0000',
  whatsapp = '5532999990000',
  email = 'contato@keemoveis.com.br',
  address = 'Tiradentes - MG',
  opening_hours = 'Seg a Sex 8h-18h | Sáb 8h-12h',
  instagram = 'keemoveisrusticos',
  years_experience = 18,
  projects_done = 5000,
  show_prices = true,
  updated_at = now()
FROM public.sites s
WHERE s.id = st.site_id AND s.slug = 'kee';