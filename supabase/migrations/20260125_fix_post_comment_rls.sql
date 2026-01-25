-- Migration: Fix RLS policy for comments table to allow anonymous inserts
-- This reverts migration 20251221160213 which broke anonymous comment posting
-- Issue: Policy "Authenticated users can insert comments" with TO authenticated clause
--        blocks ALL inserts including service role key from Edge Function
-- Solution: Revert to original policy that allows anyone to insert

-- Drop the broken policy
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

-- Create policy that allows anonymous inserts (no role restriction)
CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Verify the fix
-- This should return a policy named "Anyone can insert comments" with no role restriction
-- SELECT policyname, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'comments' AND policyname ILIKE '%insert%';
