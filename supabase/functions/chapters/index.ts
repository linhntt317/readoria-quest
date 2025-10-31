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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // POST create chapter
    if (req.method === 'POST') {
      const { mangaId, chapterNumber, title, content } = await req.json();
      
      console.log('Creating chapter:', { mangaId, chapterNumber, title });

      const { data: chapter, error } = await supabase
        .from('chapters')
        .insert({
          manga_id: mangaId,
          chapter_number: chapterNumber,
          title,
          content
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET chapters by manga ID or single chapter by ID
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mangaId = url.searchParams.get('mangaId');
      const chapterId = url.searchParams.get('id');
      
      if (chapterId) {
        console.log('Fetching chapter:', chapterId);
        
        const { data: chapter, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', chapterId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(chapter), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (!mangaId) {
        throw new Error('mangaId or id is required');
      }

      console.log('Fetching chapters for manga:', mangaId);

      const { data: chapters, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', mangaId)
        .order('chapter_number', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(chapters), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT update chapter
    if (req.method === 'PUT') {
      const url = new URL(req.url);
      const chapterId = url.searchParams.get('id');
      
      if (!chapterId) {
        throw new Error('id is required');
      }

      const { chapterNumber, title, content } = await req.json();
      
      console.log('Updating chapter:', chapterId);

      const { data: chapter, error } = await supabase
        .from('chapters')
        .update({
          chapter_number: chapterNumber,
          title,
          content
        })
        .eq('id', chapterId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE chapter
    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const chapterId = url.searchParams.get('id');
      
      if (!chapterId) {
        throw new Error('id is required');
      }

      console.log('Deleting chapter:', chapterId);

      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chapters function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
