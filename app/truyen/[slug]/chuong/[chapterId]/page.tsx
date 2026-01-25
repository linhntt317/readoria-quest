import { Metadata } from "next";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import ChapterReader from "@/views/ChapterReader";
import { getChapterMetadata } from "@/lib/seo-metadata";

type Params = { slug: string; chapterId: string };

// Hardcoded Supabase config - anon key is publishable and safe to expose
const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";

function extractId(slug: string): string | null {
  // Check if the entire slug is a UUID
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(slug)) {
    return slug;
  }

  // Try to extract UUID from the end of the slug (e.g., "ten-truyen-uuid")
  const uuidMatch = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  if (uuidMatch) {
    return uuidMatch[0];
  }

  // Fallback: try to find numeric ID at the end
  const numericMatch = slug.match(/(\d+)$/);
  return numericMatch ? numericMatch[1] : null;
}

const SITE_ORIGIN = "https://truyennhameo.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const mangaId = extractId(resolvedParams.slug);
  const chapterId = resolvedParams.chapterId;
  const pageUrl = `https://truyennhameo.vercel.app/truyen/${resolvedParams.slug}/chuong/${chapterId}`;

  // Default values - using object to allow mutation
  let chapterData: { title: string; chapter_number: number } = {
    title: `Chương ${chapterId}`,
    chapter_number: parseInt(chapterId) || 0,
  };
  let mangaData: { title: string; slug: string } = {
    title: "Truyện",
    slug: resolvedParams.slug,
  };

  // Try to fetch chapter and manga details from database
  if (chapterId) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

      // Get chapter details
      const { data: chapter } = await supabase
        .from("chapters")
        .select("title, chapter_number, manga_id")
        .eq("id", chapterId)
        .single();

      if (chapter) {
        chapterData = {
          title: chapter.title || `Chương ${chapter.chapter_number}`,
          chapter_number: chapter.chapter_number,
        };

        // Get manga title
        if (chapter.manga_id || mangaId) {
          const { data: manga } = await supabase
            .from("manga")
            .select("title")
            .eq("id", chapter.manga_id || mangaId)
            .single();

          if (manga?.title) {
            mangaData = {
              title: manga.title,
              slug: resolvedParams.slug,
            };
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chapter metadata:", error);
    }
  }

  return getChapterMetadata(chapterData, mangaData, pageUrl, chapterId);
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const id = extractId(resolvedParams.slug);
  return (
    <ChapterReader
      mangaId={id || undefined}
      chapterId={resolvedParams.chapterId}
    />
  );
}
