import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  manga_id?: string;
  chapter_number: number;
  title?: string;
  content?: string;
  created_at: string;
}

export const useManga = () => {
  return useQuery({
    queryKey: ["truyen"],
    queryFn: async () => {
      // OPTIMIZED: Select only needed columns, limit to 100 for pagination
      const { data: mangaData, error: mangaError } = await supabase
        .from("manga")
        .select(
          `
          id,
          title,
          author,
          image_url,
          views,
          rating,
          created_at,
          description,
          tags:manga_tags(tag:tags(id, name, color, category))
        `
        )
        .order("created_at", { ascending: false })
        .limit(100); // Limit to prevent huge payloads

      if (mangaError) throw mangaError;

      // OPTIMIZED: Get chapter counts in a single efficient query
      const mangaIds = mangaData?.map((m) => m.id) || [];
      const { data: chapterCounts } = await supabase
        .from("chapters")
        .select("manga_id, id")
        .in("manga_id", mangaIds);

      // Create count map
      const countMap = (chapterCounts || []).reduce((acc, ch) => {
        acc[ch.manga_id] = (acc[ch.manga_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Format manga data
      const formattedData =
        mangaData?.map((manga) => ({
          ...manga,
          tags: manga.tags?.map((t: any) => t.tag).filter(Boolean) || [],
          chapterCount: countMap[manga.id] || 0,
        })) || [];

      return formattedData as Manga[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });
};

export const useMangaById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["truyen", id],
    queryFn: async () => {
      if (!id) throw new Error("Truyen ID is required");

      // OPTIMIZED: Fetch everything in a single query instead of 3 separate calls
      const { data: manga, error: mangaError } = await supabase
        .from("manga")
        .select(
          `
          id,
          title,
          author,
          description,
          image_url,
          views,
          rating,
          created_at,
          updated_at,
          status,
          tags:manga_tags(tag:tags(id, name, color, category)),
          chapters:chapters(id, chapter_number, title, created_at, content)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (mangaError) throw mangaError;
      if (!manga) return null;

      const mangaData = manga as any;
      return {
        id: mangaData.id,
        title: mangaData.title,
        author: mangaData.author,
        description: mangaData.description,
        image_url: mangaData.image_url,
        views: mangaData.views,
        rating: mangaData.rating,
        created_at: mangaData.created_at,
        tags: mangaData.tags?.map((mt: any) => mt.tag).filter(Boolean) || [],
        chapters: mangaData.chapters || [],
      } as Manga;
    },
    enabled: !!id,
    staleTime: 3 * 60 * 1000, // Cache for 3 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("tags", {
        method: "GET",
      });

      if (error) throw error;
      return data as Tag[];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
  });
};
