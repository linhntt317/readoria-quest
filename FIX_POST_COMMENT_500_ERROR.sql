-- FIX POST COMMENT API 500 ERROR
-- Copy & paste this SQL into Supabase Dashboard SQL Editor
-- https://app.supabase.com/project/ljmoqseafxhncpwzuwex/sql

-- Step 1: Verify current policy (should show "Authenticated users can insert comments")
SELECT policyname, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'comments'
AND policyname ILIKE '%insert%';

-- Step 2: Drop the broken policy that blocks anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

-- Step 3: Create new policy that allows anonymous inserts
CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Step 4: Verify new policy is applied
SELECT policyname, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'comments'
AND policyname ILIKE '%insert%';

-- Expected result: Should see policy "Anyone can insert comments" without role restriction
-- Then test: POST comment in your app should work with 201 status
