-- Create storage bucket for manga covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('manga-covers', 'manga-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view manga covers (public bucket)
CREATE POLICY "Anyone can view manga covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'manga-covers');

-- Allow authenticated admins to upload manga covers
CREATE POLICY "Admins can upload manga covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'manga-covers' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update manga covers
CREATE POLICY "Admins can update manga covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'manga-covers' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete manga covers
CREATE POLICY "Admins can delete manga covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'manga-covers' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);