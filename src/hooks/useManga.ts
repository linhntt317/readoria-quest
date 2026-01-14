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
      // Query manga with tags
      const { data: mangaData, error: mangaError } = await supabase
        .from("manga")
        .select(
          `
          *,
          tags:manga_tags(tag:tags(*))
        `
        )
        .order("created_at", { ascending: false });

      if (mangaError) throw mangaError;

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

      // Fetch manga details directly from database
      const { data: manga, error: mangaError } = await supabase
        .from("manga")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (mangaError) throw mangaError;
      if (!manga) return null;

      // Fetch tags
      const { data: mangaTags, error: tagsError } = await supabase
        .from("manga_tags")
        .select(
          `
          tag:tags(*)
        `
        )
        .eq("manga_id", id);

      if (tagsError) throw tagsError;

      // Fetch chapters
      const { data: chapters, error: chaptersError } = await supabase
        .from("chapters")
        .select("id, chapter_number, title, created_at")
        .eq("manga_id", id)
        .order("chapter_number", { ascending: true });

      if (chaptersError) throw chaptersError;

      return {
        ...manga,
        tags: mangaTags?.map((mt: any) => mt.tag).filter(Boolean) || [],
        chapters: chapters || [],
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
