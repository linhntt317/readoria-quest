import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  manga_id: string;
  chapter_number: number;
  title: string;
  content?: string;
  created_at: string;
}

export const useManga = () => {
  return useQuery({
    queryKey: ['truyen'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('truyen', {
        method: 'GET'
      });
      
      if (error) throw error;
      return data as Manga[];
    }
  });
};

export const useMangaById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['truyen', id],
    queryFn: async () => {
      if (!id) throw new Error('Truyen ID is required');
      
      const { data, error } = await supabase.functions.invoke(`truyen/${id}`, {
        method: 'GET'
      });
      
      if (error) throw error;
      return data as Manga;
    },
    enabled: !!id
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('tags', {
        method: 'GET'
      });
      
      if (error) throw error;
      return data as Tag[];
    }
  });
};
