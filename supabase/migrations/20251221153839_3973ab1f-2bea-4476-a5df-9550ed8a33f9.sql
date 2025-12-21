-- Fix Anonymous Access Policies for all tables

-- 1. CHAPTERS table - keep public read, restrict admin actions
DROP POLICY IF EXISTS "Admins can delete chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can update chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can insert chapters" ON public.chapters;

CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. COMMENTS table - restrict admin actions
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.comments;

CREATE POLICY "Admins can update comments" ON public.comments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete comments" ON public.comments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. FAVORITES table - restrict to authenticated users only
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. FEEDBACK table - restrict admin view
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

CREATE POLICY "Admins can view all feedback" ON public.feedback FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

-- 5. MANGA table - keep public read, restrict admin actions
DROP POLICY IF EXISTS "Admins can delete manga" ON public.manga;
DROP POLICY IF EXISTS "Admins can update manga" ON public.manga;
DROP POLICY IF EXISTS "Admins can insert manga" ON public.manga;

CREATE POLICY "Admins can insert manga" ON public.manga FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update manga" ON public.manga FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete manga" ON public.manga FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. MANGA_TAGS table - keep public read, restrict admin actions
DROP POLICY IF EXISTS "Admins can delete manga_tags" ON public.manga_tags;
DROP POLICY IF EXISTS "Admins can insert manga_tags" ON public.manga_tags;

CREATE POLICY "Admins can insert manga_tags" ON public.manga_tags FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete manga_tags" ON public.manga_tags FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. PROFILES table - keep public read, restrict user actions
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 8. READING_HISTORY table - restrict to authenticated users
DROP POLICY IF EXISTS "Users can manage their own reading history" ON public.reading_history;
DROP POLICY IF EXISTS "Users can view their own reading history" ON public.reading_history;

CREATE POLICY "Users can view their own reading history" ON public.reading_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own reading history" ON public.reading_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 9. TAGS table - keep public read, restrict admin actions
DROP POLICY IF EXISTS "Admins can delete tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can update tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can insert tags" ON public.tags;

CREATE POLICY "Admins can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tags" ON public.tags FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tags" ON public.tags FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));