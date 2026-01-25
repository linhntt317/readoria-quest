-- Revert RLS policy to allow all inserts (service role can bypass)
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);
