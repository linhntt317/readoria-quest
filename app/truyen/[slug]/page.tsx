import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import MangaDetail from "@/views/MangaDetail";

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
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
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
  let title = "Truyện Nhà Mèo";
  let description = "Đọc truyện online miễn phí tại Truyện Nhà Mèo";
  let image = "/og-image.jpg";

  const id = extractId(resolvedParams.slug);

  if (id) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      const { data } = await supabase
        .from("manga")
        .select("id,title,description,image_url,updated_at")
        .eq("id", id)
        .single();

      if (data) {
        title = `${data.title} | Truyện Nhà Mèo`;
        description = (data.description || "").slice(0, 160) || description;
        image = data.image_url || image;
      }
    } catch {}
  }

  const pageUrl = `${SITE_ORIGIN}/truyen/${resolvedParams.slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
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
