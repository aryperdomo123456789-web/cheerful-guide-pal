ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE public.ambientes DROP CONSTRAINT IF EXISTS ambientes_slug_key;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_slug_key;
ALTER TABLE public.categories ADD CONSTRAINT categories_site_slug_key UNIQUE (site_id, slug);
ALTER TABLE public.ambientes ADD CONSTRAINT ambientes_site_slug_key UNIQUE (site_id, slug);
ALTER TABLE public.products ADD CONSTRAINT products_site_slug_key UNIQUE (site_id, slug);

UPDATE public.sites SET slug='kee', name='K&E Móveis Rústicos', theme='kee' WHERE slug='segundo';

INSERT INTO public.site_settings (site_id, brand_name, tagline, hero_title, hero_subtitle, hero_cta, about_text, phone, whatsapp, email, address, opening_hours, instagram, years_experience, projects_done, show_prices)
SELECT s.id, 'K&E Móveis Rústicos', 'Madeira maciça de demolição', 'Móveis de madeira maciça de demolição',
 'Peças exclusivas feitas à mão em Tiradentes — entrega para todo o Brasil e parcelamento em até 12x sem juros.',
 'Ver catálogo',
 'Trabalhamos com madeira de demolição selecionada, unindo o charme do rústico ao acabamento fino. Cada peça é única, feita por marceneiros experientes.',
 '(32) 99999-0000', '5532999990000', 'contato@keemoveis.com.br', 'Tiradentes - MG', 'Seg a Sex 8h-18h | Sáb 8h-12h', 'keemoveisrusticos', 18, 5000, true
FROM public.sites s WHERE s.slug='kee'
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (site_id, name, slug, description, sort_order)
SELECT s.id, v.name, v.slug, v.descr, v.ord FROM public.sites s,
(VALUES ('Buffets e Aparadores','buffets-aparadores','Peças para sala de jantar e entrada',1),
        ('Cristaleiras','cristaleiras','Vitrines em madeira maciça',2),
        ('Mesas de Jantar','mesas-jantar','Mesas rústicas sob medida',3),
        ('Poltronas e Cadeiras','poltronas-cadeiras','Assentos em madeira e palha',4),
        ('Adegas e Barzinhos','adegas-barzinhos','Para receber bem',5)) AS v(name,slug,descr,ord)
WHERE s.slug='kee';

INSERT INTO public.ambientes (site_id, name, slug, sort_order)
SELECT s.id, v.name, v.slug, v.ord FROM public.sites s,
(VALUES ('Sala de Jantar','sala-de-jantar',1),('Sala de Estar','sala-de-estar',2),('Cozinha','cozinha',3),('Varanda','varanda',4)) AS v(name,slug,ord)
WHERE s.slug='kee';

INSERT INTO public.products (site_id, name, slug, short_description, description, wood_type, dimensions, price, sale_price, images, category_id, ambiente_id, is_featured, sort_order)
SELECT s.id, v.name, v.slug, v.short, v.descr, v.wood, v.dim, v.price, v.sale,
 ARRAY[v.img]::text[],
 (SELECT c.id FROM public.categories c WHERE c.site_id=s.id AND c.slug=v.cat),
 (SELECT a.id FROM public.ambientes a WHERE a.site_id=s.id AND a.slug=v.amb),
 v.feat, v.ord
FROM public.sites s,
(VALUES
 ('Buffet de Madeira Branco','buffet-madeira-branco','Buffet 4 portas com pátina branca','Buffet em madeira maciça de demolição com pátina branca envelhecida, tampo natural e ferragens em ferro.','Madeira de demolição','180 x 45 x 85 cm',3990.00,NULL,'/produtos/kee-buffet-branco.jpg','buffets-aparadores','sala-de-jantar',true,1),
 ('Aparador Tiradentes 2 Gavetas','aparador-tiradentes-2-gavetas','Aparador clean em madeira maciça','Aparador com duas gavetas e acabamento natural acetinado, ideal para hall de entrada.','Peroba rosa','140 x 40 x 80 cm',2790.00,2490.00,'/produtos/kee-aparador.jpg','buffets-aparadores','sala-de-estar',true,2),
 ('Poltrona Helena Palha Natural','poltrona-helena-palha','Poltrona em madeira e palha','Releitura clássica com estrutura em madeira maciça, encosto em palha natural e assento em couro.','Madeira maciça','70 x 80 x 90 cm',2390.00,2080.00,'/produtos/kee-poltrona.jpg','poltronas-cadeiras','sala-de-estar',true,3),
 ('Adega Rústica 2 Portas','adega-rustica-2-portas','Adega com nichos e portas de vidro','Adega em madeira de demolição com nichos para garrafas, taças e portas de vidro.','Madeira de demolição','120 x 45 x 150 cm',5490.00,NULL,'/produtos/kee-adega.jpg','adegas-barzinhos','sala-de-estar',true,4),
 ('Mesa de Jantar Rústica 6 Lugares','mesa-jantar-rustica-6','Mesa maciça com pés torneados','Mesa de jantar em madeira maciça com pés torneados e tampo em peça única.','Madeira de demolição','200 x 100 x 78 cm',7490.00,6890.00,'/produtos/kee-mesa.jpg','mesas-jantar','sala-de-jantar',true,5),
 ('Cristaleira Provençal Branca','cristaleira-provencal-branca','Cristaleira 4 portas de vidro','Cristaleira com pátina branca, quatro portas de vidro, gavetas e prateleiras internas.','Madeira maciça','150 x 45 x 190 cm',6290.00,NULL,'/produtos/kee-cristaleira.jpg','cristaleiras','sala-de-jantar',false,6),
 ('Conjunto Mesa + 6 Cadeiras','conjunto-mesa-6-cadeiras','Conjunto completo para jantar','Conjunto com mesa de jantar em madeira maciça e seis cadeiras no mesmo acabamento.','Madeira de demolição','200 x 100 x 78 cm',10990.00,9790.00,'/produtos/kee-mesa.jpg','mesas-jantar','sala-de-jantar',true,7),
 ('Cadeira Rústica Assento Madeira','cadeira-rustica-assento-madeira','Cadeira maciça confortável','Cadeira em madeira maciça com encosto anatômico e acabamento acetinado.','Madeira maciça','45 x 50 x 95 cm',890.00,NULL,'/produtos/kee-poltrona.jpg','poltronas-cadeiras','sala-de-jantar',false,8),
 ('Barzinho de Canto Demolição','barzinho-canto-demolicao','Barzinho compacto com nichos','Barzinho de canto com nichos, porta-taças e tampo reforçado.','Madeira de demolição','80 x 45 x 150 cm',3690.00,3290.00,'/produtos/kee-adega.jpg','adegas-barzinhos','varanda',false,9),
 ('Buffet Natural 3 Portas','buffet-natural-3-portas','Buffet em tom mel natural','Buffet com três portas, tom mel natural e puxadores de ferro forjado.','Peroba rosa','160 x 45 x 85 cm',3490.00,NULL,'/produtos/kee-aparador.jpg','buffets-aparadores','cozinha',false,10)
) AS v(name,slug,short,descr,wood,dim,price,sale,img,cat,amb,feat,ord)
WHERE s.slug='kee';

INSERT INTO public.testimonials (site_id, author, city, content, rating, sort_order)
SELECT s.id, v.author, v.city, v.content, 5, v.ord FROM public.sites s,
(VALUES ('Ana Paula','Belo Horizonte - MG','A cristaleira chegou impecável e ficou linda na sala. Acabamento de primeira.',1),
        ('Ricardo Menezes','São Paulo - SP','Comprei o conjunto de mesa e cadeiras. Madeira maciça de verdade, vale cada centavo.',2),
        ('Juliana Costa','Rio de Janeiro - RJ','Atendimento atencioso e entrega no prazo. Já é minha terceira compra.',3)) AS v(author,city,content,ord)
WHERE s.slug='kee';