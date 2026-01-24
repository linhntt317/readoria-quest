import { Metadata } from "next";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import ChapterReader from "@/views/ChapterReader";

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
  const pageUrl = `${SITE_ORIGIN}/truyen/${resolvedParams.slug}/chuong/${chapterId}`;

  let chapterTitle = `Chương ${chapterId}`;
  let mangaTitle = "Truyện";

  // Try to fetch chapter title from database
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

    // Get chapter details
    const { data: chapter } = await supabase
      .from("chapters")
      .select("title, manga_id")
      .eq("id", chapterId)
      .single();

    if (chapter?.title) {
      chapterTitle = chapter.title;
    }

    // Get manga title
    if (chapter?.manga_id || mangaId) {
      const { data: manga } = await supabase
        .from("manga")
        .select("title")
        .eq("id", chapter?.manga_id || mangaId)
        .single();

      if (manga?.title) {
        mangaTitle = manga.title;
      }
    }
  } catch (error) {
    console.error("Error fetching chapter metadata:", error);
  }

  return {
    title: `${chapterTitle} - ${mangaTitle} | Truyện Nhà Mèo`,
    description: `Đọc ${chapterTitle} của ${mangaTitle} online miễn phí tại Truyện Nhà Mèo. Cập nhật liên tục, chất lượng cao.`,
    keywords: [
      chapterTitle,
      mangaTitle,
      "truyện tranh online",
      "manga online",
      "đọc truyện miễn phí",
      "chapter truyện",
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: `${chapterTitle} - ${mangaTitle}`,
      description: `Đọc ${chapterTitle} online miễn phí`,
      siteName: "Truyện Nhà Mèo",
    },
    twitter: {
      card: "summary",
      title: `${chapterTitle} - ${mangaTitle}`,
      description: `Đọc ${chapterTitle} online`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
