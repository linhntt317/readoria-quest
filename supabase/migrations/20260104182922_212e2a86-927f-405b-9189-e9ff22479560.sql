-- Update storage policies to require authenticated admins instead of anonymous access

-- First, drop the existing policies
DROP POLICY IF EXISTS "Anyone can view manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update manga covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete manga covers" ON storage.objects;

-- Recreate policies with authenticated user requirement

-- Public read access for manga covers (authenticated or anonymous can view)
CREATE POLICY "Public can view manga covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'manga-covers');

-- Admin upload policy - requires authenticated admin
CREATE POLICY "Authenticated admins can upload manga covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manga-covers' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- Admin update policy - requires authenticated admin
CREATE POLICY "Authenticated admins can update manga covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'manga-covers' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- Admin delete policy - requires authenticated admin
CREATE POLICY "Authenticated admins can delete manga covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'manga-covers' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);