-- 🔧 FIX: Allow anonymous users to insert comments
-- Revert the restrictive policy from migration 20251221160213
-- This allows the Edge Function to accept anonymous comments

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Verify policy was applied
-- Run this to confirm:
-- SELECT policyname, permissive, qual, with_check
-- FROM pg_policies WHERE tablename = 'comments' AND policyname LIKE '%insert%';
