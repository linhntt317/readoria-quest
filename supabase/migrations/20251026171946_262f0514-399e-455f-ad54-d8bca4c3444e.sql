-- Create tags table with predefined manga tags
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create manga table
CREATE TABLE IF NOT EXISTS public.manga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for manga-tags relationship (many-to-many)
CREATE TABLE IF NOT EXISTS public.manga_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id UUID REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(manga_id, tag_id)
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id UUID REFERENCES public.manga(id) ON DELETE CASCADE NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(manga_id, chapter_number)
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manga_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read manga" ON public.manga FOR SELECT USING (true);
CREATE POLICY "Anyone can read manga_tags" ON public.manga_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read chapters" ON public.chapters FOR SELECT USING (true);

-- RLS Policies for authenticated write access (for admin functionality)
CREATE POLICY "Authenticated users can insert manga" ON public.manga FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update manga" ON public.manga FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete manga" ON public.manga FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert manga_tags" ON public.manga_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete manga_tags" ON public.manga_tags FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert chapters" ON public.chapters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update chapters" ON public.chapters FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete chapters" ON public.chapters FOR DELETE TO authenticated USING (true);

-- Insert predefined manga tags
INSERT INTO public.tags (name) VALUES
  ('Hành động'),
  ('Phiêu lưu'),
  ('Hài hước'),
  ('Lãng mạn'),
  ('Học đường'),
  ('Siêu nhiên'),
  ('Kinh dị'),
  ('Trinh thám'),
  ('Thể thao'),
  ('Isekai'),
  ('Mecha'),
  ('Shounen'),
  ('Shoujo'),
  ('Seinen'),
  ('Josei'),
  ('Drama'),
  ('Slice of Life'),
  ('Fantasy'),
  ('Sci-Fi'),
  ('Võ thuật')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for manga table
CREATE TRIGGER update_manga_updated_at
  BEFORE UPDATE ON public.manga
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();