-- Drop the overly permissive storage policies that allow ANY authenticated user to manage manga covers
DROP POLICY IF EXISTS "Authenticated users can upload manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete manga covers" ON storage.objects;

-- Recreate with admin-only access using has_role function
CREATE POLICY "Admins can upload manga covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manga-covers' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update manga covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'manga-covers' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete manga covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'manga-covers' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);