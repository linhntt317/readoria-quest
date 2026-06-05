DROP POLICY IF EXISTS "Public can view manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view manga covers" ON storage.objects;
CREATE POLICY "Admins can list manga covers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'manga-covers' AND has_role(auth.uid(), 'admin'::app_role));