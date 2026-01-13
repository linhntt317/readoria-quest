import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Server-side Supabase client for RSC
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  views: number;
  rating: number;
  created_at: string;
  tags: Tag[];
  chapterCount?: number;
}

// Server-side data fetching for manga list
export async function fetchMangaList(): Promise<Manga[]> {
  const supabase = createServerSupabaseClient();

  // Query manga with tags
  const { data: mangaData, error: mangaError } = await supabase
    .from("manga")
    .select(`
      *,
      tags:manga_tags(tag:tags(*))
    `)
    .order("created_at", { ascending: false });

  if (mangaError) {
    console.error("Error fetching manga:", mangaError);
    return [];
  }

  // Get chapter counts
  const mangaIds = mangaData?.map((m) => m.id) || [];
  const { data: chapterCounts } = await supabase
    .from("chapters")
    .select("manga_id")
    .in("manga_id", mangaIds);

  const countMap = (chapterCounts || []).reduce((acc, ch) => {
    acc[ch.manga_id] = (acc[ch.manga_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format manga data
  const formattedData =
    mangaData?.map((manga) => ({
      ...manga,
      views: manga.views ?? 0,
      rating: manga.rating ?? 0,
      tags: manga.tags?.map((t: any) => t.tag).filter(Boolean) || [],
      chapterCount: countMap[manga.id] || 0,
    })) || [];

  return formattedData as Manga[];
}
