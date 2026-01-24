-- Add color and category columns to tags table
ALTER TABLE public.tags
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Add status column to manga table
ALTER TABLE public.manga
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ongoing';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category);
CREATE INDEX IF NOT EXISTS idx_manga_status ON public.manga(status);
