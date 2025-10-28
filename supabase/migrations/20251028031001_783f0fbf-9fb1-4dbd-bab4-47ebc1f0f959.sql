-- Add category and color columns to tags table
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Khác',
ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#6B7280';

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert tags" ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can update tags" ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can delete tags" ON public.tags;

-- Update RLS policies for tags table to allow admin operations
CREATE POLICY "Authenticated users can insert tags"
ON public.tags
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
ON public.tags
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete tags"
ON public.tags
FOR DELETE
TO authenticated
USING (true);