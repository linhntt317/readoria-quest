-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_id UUID REFERENCES public.manga(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (
    (manga_id IS NOT NULL AND chapter_id IS NULL) OR 
    (manga_id IS NULL AND chapter_id IS NOT NULL)
  )
);

-- Create index for better query performance
CREATE INDEX idx_comments_manga_id ON public.comments(manga_id) WHERE manga_id IS NOT NULL;
CREATE INDEX idx_comments_chapter_id ON public.comments(chapter_id) WHERE chapter_id IS NOT NULL;
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read non-hidden comments
CREATE POLICY "Anyone can read non-hidden comments"
ON public.comments
FOR SELECT
USING (is_hidden = false);

-- Anyone can insert comments (anonymous allowed)
CREATE POLICY "Anyone can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- Admins can update comments (to hide them)
CREATE POLICY "Admins can update comments"
ON public.comments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete comments
CREATE POLICY "Admins can delete comments"
ON public.comments
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));