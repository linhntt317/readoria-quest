-- Allow anonymous users to insert chapters (consistent with manga and manga_tags)
DROP POLICY IF EXISTS "Authenticated users can insert chapters" ON chapters;

CREATE POLICY "Allow anonymous insert chapters"
ON chapters
FOR INSERT
WITH CHECK (true);