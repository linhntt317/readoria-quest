import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import MangaDetail from "@/views/MangaDetail";
import { getMangaMetadata, getMangaStructuredData } from "@/lib/seo-metadata";

type Params = { slug: string };

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

// Hardcoded Supabase config - anon key is publishable and safe to expose
const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";
const SITE_ORIGIN = "https://truyennhameo.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = extractId(resolvedParams.slug);
  const pageUrl = `https://truyennhameo.vercel.app/truyen/${resolvedParams.slug}`;

  // Default metadata
  let mangaData = {
    title: "Truyện",
    description: "Đọc truyện online miễn phí tại Truyện Nhà Mèo",
    slug: resolvedParams.slug,
    image_url: undefined,
    tags: [] as string[],
  };

  if (id) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      const { data } = await supabase
        .from("manga")
        .select("id,title,description,image_url,tags")
        .eq("id", id)
        .single();

      if (data) {
        mangaData = {
          title: data.title || "Truyện",
          description:
            data.description || "Đọc truyện online miễn phí tại Truyện Nhà Mèo",
          slug: resolvedParams.slug,
          image_url: data.image_url,
          tags: data.tags || [],
        };
      }
    } catch (error) {
      console.error("Error fetching manga metadata:", error);
    }
  }

  return getMangaMetadata(mangaData, pageUrl);
}

export default async function MangaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const id = extractId(resolvedParams.slug);
  return <MangaDetail mangaId={id || undefined} />;
}
