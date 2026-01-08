-- Create RLS policies for manga-covers bucket
CREATE POLICY "Anyone can view manga covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'manga-covers');

CREATE POLICY "Authenticated users can upload manga covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'manga-covers');

CREATE POLICY "Authenticated users can update manga covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'manga-covers');

CREATE POLICY "Authenticated users can delete manga covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'manga-covers');