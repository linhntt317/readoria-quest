/**
 * Script to fix comments RLS policy
 * Run this in Supabase SQL Editor or psql
 */

-- Verify current policies
SELECT policyname, permissive, qual, with_check
FROM pg_policies
WHERE tablename = 'comments'
AND policyname ILIKE '%insert%';

-- New policy to allow anonymous comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Verify new policy
SELECT policyname, permissive, qual, with_check
FROM pg_policies
WHERE tablename = 'comments'
AND policyname ILIKE '%insert%';
