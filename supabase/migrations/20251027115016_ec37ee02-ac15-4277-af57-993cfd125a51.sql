-- Sửa RLS policy cho bảng manga để cho phép insert từ edge function
DROP POLICY IF EXISTS "Authenticated users can insert manga" ON public.manga;

-- Tạo policy mới cho phép anonymous insert (tạm thời để unblock)
CREATE POLICY "Allow anonymous insert manga" 
ON public.manga 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Sửa policy cho manga_tags
DROP POLICY IF EXISTS "Authenticated users can insert manga_tags" ON public.manga_tags;

CREATE POLICY "Allow anonymous insert manga_tags" 
ON public.manga_tags 
FOR INSERT 
TO anon
WITH CHECK (true);