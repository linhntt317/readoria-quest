-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update MANGA table policies
DROP POLICY IF EXISTS "Allow anonymous insert manga" ON public.manga;
DROP POLICY IF EXISTS "Authenticated users can update manga" ON public.manga;
DROP POLICY IF EXISTS "Authenticated users can delete manga" ON public.manga;

CREATE POLICY "Admins can insert manga" ON public.manga
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update manga" ON public.manga
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete manga" ON public.manga
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Update CHAPTERS table policies
DROP POLICY IF EXISTS "Allow anonymous insert chapters" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated users can update chapters" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated users can delete chapters" ON public.chapters;

CREATE POLICY "Admins can insert chapters" ON public.chapters
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chapters" ON public.chapters
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chapters" ON public.chapters
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Update MANGA_TAGS table policies
DROP POLICY IF EXISTS "Allow anonymous insert manga_tags" ON public.manga_tags;
DROP POLICY IF EXISTS "Authenticated users can delete manga_tags" ON public.manga_tags;

CREATE POLICY "Admins can insert manga_tags" ON public.manga_tags
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete manga_tags" ON public.manga_tags
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Update TAGS table policies
DROP POLICY IF EXISTS "Authenticated users can insert tags" ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can update tags" ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can delete tags" ON public.tags;

CREATE POLICY "Admins can insert tags" ON public.tags
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tags" ON public.tags
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tags" ON public.tags
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));