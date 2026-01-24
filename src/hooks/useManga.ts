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
        `,
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
      const countMap = (chapterCounts || []).reduce(
        (acc, ch) => {
          acc[ch.manga_id] = (acc[ch.manga_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

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

      // ⚡ OPTIMIZED: Direct Supabase queries (no HTTP overhead)
      // Parallel queries for speed
      const [mangaRes, tagsRes, chaptersRes, countRes] = await Promise.all([
        // Query 1: Manga details
        supabase
          .from("manga")
          .select(
            "id, title, author, description, image_url, views, rating, created_at",
          )
          .eq("id", id)
          .single(),

        // Query 2: Tags
        supabase.from("manga_tags").select("tags(id, name)").eq("manga_id", id),

        // Query 3: ALL chapters (needed for prev/next navigation)
        supabase
          .from("chapters")
          .select("id, chapter_number, title, created_at")
          .eq("manga_id", id)
          .order("chapter_number", { ascending: false }),

        // Query 4: Total chapter count (if needed)
        supabase
          .from("chapters")
          .select("id", { count: "exact", head: true })
          .eq("manga_id", id),
      ]);

      const { data: manga, error: mangaError } = mangaRes;
      const { data: mangaTags, error: tagsError } = tagsRes;
      const { data: chapters, error: chaptersError } = chaptersRes;
      const { count: totalChapters, error: countError } = countRes;

      if (mangaError) throw mangaError;
      if (!manga) return null;
      if (tagsError) throw tagsError;
      if (chaptersError) throw chaptersError;
      if (countError) throw countError;

      return {
        id: manga.id,
        title: manga.title,
        author: manga.author,
        description: manga.description,
        image_url: manga.image_url,
        views: manga.views,
        rating: manga.rating,
        created_at: manga.created_at,
        tags: mangaTags?.map((mt: any) => mt.tags).filter(Boolean) || [],
        chapters: chapters || [],
        totalChapters: totalChapters || 0,
      } as Manga;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });
};

// 📚 Hook for paginated chapters (lazy load)
export const useMangaChapters = (id: string | undefined, page: number = 1) => {
  return useQuery({
    queryKey: ["truyen-chapters", id, page],
    queryFn: async () => {
      if (!id) throw new Error("Truyen ID is required");

      const response = await fetch(`/api/manga/${id}/chapters?page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch chapters");

      return await response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
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
