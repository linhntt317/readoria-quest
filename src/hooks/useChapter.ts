import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Chapter } from "./useManga";

export const useChapterById = (chapterId: string | undefined) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: async () => {
      if (!chapterId) throw new Error("Chapter ID is required");

      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", chapterId)
        .single();

      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });
};
