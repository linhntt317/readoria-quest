-- Create function to increment manga views atomically
CREATE OR REPLACE FUNCTION public.increment_manga_views(manga_uuid UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.manga
  SET views = views + 1
  WHERE id = manga_uuid;
$$;