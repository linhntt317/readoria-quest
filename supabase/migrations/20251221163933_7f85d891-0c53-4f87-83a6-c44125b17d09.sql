-- Fix: Restrict profiles - users can only view their own profile
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;

-- Users can only view their own profile (protects email/personal data)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);