-- Performance Optimization: Add indexes for frequently queried columns
-- This migration improves query performance by adding database indexes

-- Index on manga.created_at for sorting latest manga
CREATE INDEX IF NOT EXISTS idx_manga_created_at 
ON manga(created_at DESC);

-- Index on chapters.manga_id for fast chapter count queries
CREATE INDEX IF NOT EXISTS idx_chapters_manga_id 
ON chapters(manga_id);

-- Composite index on manga status and created_at for filtering active manga
CREATE INDEX IF NOT EXISTS idx_manga_status_created_at 
ON manga(status, created_at DESC);

-- Index on manga_tags.manga_id for tag lookups
CREATE INDEX IF NOT EXISTS idx_manga_tags_manga_id 
ON manga_tags(manga_id);

-- Index on manga_tags.tag_id for reverse tag lookups
CREATE INDEX IF NOT EXISTS idx_manga_tags_tag_id 
ON manga_tags(tag_id);

-- Index on chapters.chapter_number for ordering chapters
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number 
ON chapters(manga_id, chapter_number);

-- Index on manga.views for trending/popular queries
CREATE INDEX IF NOT EXISTS idx_manga_views 
ON manga(views DESC);

-- Index on manga.rating for rating-based sorting
CREATE INDEX IF NOT EXISTS idx_manga_rating 
ON manga(rating DESC);

-- Add query statistics comment
COMMENT ON INDEX idx_manga_created_at IS 'Speeds up "latest manga" queries on home page';
COMMENT ON INDEX idx_chapters_manga_id IS 'Speeds up chapter count aggregation for manga list';
COMMENT ON INDEX idx_manga_status_created_at IS 'Speeds up filtering by status (published/draft)';
COMMENT ON INDEX idx_manga_tags_manga_id IS 'Speeds up tag joining for manga details';
