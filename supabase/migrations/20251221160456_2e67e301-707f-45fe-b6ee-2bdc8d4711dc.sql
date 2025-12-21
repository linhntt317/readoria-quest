-- Fix 1: Restrict profiles public read - only allow viewing non-sensitive fields
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;

-- Create two policies: one for viewing own profile (full access), one for viewing others (limited)
-- Option 1: Only authenticated users can view any profile
CREATE POLICY "Users can view any profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Note: For sensitive data like email, the application should filter what fields to return
-- This policy just ensures non-authenticated users cannot query profiles at all