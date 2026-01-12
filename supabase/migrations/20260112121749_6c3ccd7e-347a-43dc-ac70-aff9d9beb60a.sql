-- Add database-level validation constraints for comments table
-- This provides defense-in-depth alongside Edge Function validation

-- Add CHECK constraints for content length
ALTER TABLE public.comments
ADD CONSTRAINT comments_content_not_empty CHECK (char_length(trim(content)) >= 1),
ADD CONSTRAINT comments_content_max_length CHECK (char_length(content) <= 1000);

-- Add CHECK constraints for nickname length  
ALTER TABLE public.comments
ADD CONSTRAINT comments_nickname_not_empty CHECK (char_length(trim(nickname)) >= 1),
ADD CONSTRAINT comments_nickname_max_length CHECK (char_length(nickname) <= 50);

-- Ensure at least manga_id or chapter_id is provided
ALTER TABLE public.comments
ADD CONSTRAINT comments_require_manga_or_chapter CHECK (manga_id IS NOT NULL OR chapter_id IS NOT NULL);

-- Add comment to explain the constraints
COMMENT ON CONSTRAINT comments_content_not_empty ON public.comments IS 'Content must not be empty';
COMMENT ON CONSTRAINT comments_content_max_length ON public.comments IS 'Content must be 1000 characters or less';
COMMENT ON CONSTRAINT comments_nickname_not_empty ON public.comments IS 'Nickname must not be empty';
COMMENT ON CONSTRAINT comments_nickname_max_length ON public.comments IS 'Nickname must be 50 characters or less';
COMMENT ON CONSTRAINT comments_require_manga_or_chapter ON public.comments IS 'Either manga_id or chapter_id must be provided';