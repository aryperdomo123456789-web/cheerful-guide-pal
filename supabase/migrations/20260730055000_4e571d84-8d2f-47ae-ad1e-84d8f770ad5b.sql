UPDATE public.sites SET name = 'Site 1' WHERE is_primary = true;
UPDATE public.sites SET name = 'Site 2' WHERE is_primary = false AND slug = 'kee';