-- Fix: Restrict comment insertion to prevent spam (require authentication)
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;

-- Allow authenticated users to insert comments
CREATE POLICY "Authenticated users can insert comments" 
ON public.comments 
FOR INSERT 
TO authenticated
WITH CHECK (true);