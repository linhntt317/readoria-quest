import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const mangaId = pathParts[pathParts.length - 1];

    // GET single manga by ID
    if (req.method === 'GET' && mangaId && mangaId !== 'manga') {
      console.log('Fetching manga with ID:', mangaId);
      
      // Get manga details
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .eq('id', mangaId)
        .single();

      if (mangaError) throw mangaError;

      // Get manga tags
      const { data: mangaTags, error: tagsError } = await supabase
        .from('manga_tags')
        .select(`
          tags (
            id,
            name
          )
        `)
        .eq('manga_id', mangaId);

      if (tagsError) throw tagsError;

      // Get chapters
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', mangaId)
        .order('chapter_number', { ascending: true });

      if (chaptersError) throw chaptersError;

      const result = {
        ...manga,
        tags: mangaTags?.map((mt: any) => mt.tags) || [],
        chapters: chapters || []
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET all manga
    if (req.method === 'GET') {
      console.log('Fetching all manga');
      
      const { data: mangaList, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false });

      if (mangaError) throw mangaError;

      // Get tags for each manga
      const mangaWithTags = await Promise.all(
        (mangaList || []).map(async (manga) => {
          const { data: mangaTags } = await supabase
            .from('manga_tags')
            .select(`
              tags (
                id,
                name
              )
            `)
            .eq('manga_id', manga.id);

          const { data: chapters } = await supabase
            .from('chapters')
            .select('id')
            .eq('manga_id', manga.id);

          return {
            ...manga,
            tags: mangaTags?.map((mt: any) => mt.tags) || [],
            chapterCount: chapters?.length || 0
          };
        })
      );

      return new Response(JSON.stringify(mangaWithTags), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST create manga
    if (req.method === 'POST') {
      const { title, author, description, imageUrl, tagIds } = await req.json();
      
      console.log('Creating manga:', { title, author, tagIds });

      // Insert manga
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .insert({
          title,
          author,
          description,
          image_url: imageUrl
        })
        .select()
        .single();

      if (mangaError) throw mangaError;

      // Insert manga tags
      if (tagIds && tagIds.length > 0) {
        const mangaTags = tagIds.map((tagId: string) => ({
          manga_id: manga.id,
          tag_id: tagId
        }));

        const { error: tagsError } = await supabase
          .from('manga_tags')
          .insert(mangaTags);

        if (tagsError) throw tagsError;
      }

      return new Response(JSON.stringify(manga), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in manga function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
