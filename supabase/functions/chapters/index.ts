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

    // POST create/update/delete via invoke
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const { action } = body || {};

      // Update chapter (invoke always uses POST)
      if (action === 'update') {
        const { id, chapterNumber, title, content } = body || {};
        if (!id) throw new Error('id is required');

        console.log('Updating chapter (POST action):', { id, chapterNumber, title });
        
        const { data: chapters, error } = await supabase
          .from('chapters')
          .update({
            chapter_number: chapterNumber,
            title,
            content
          })
          .eq('id', id)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        if (!chapters || chapters.length === 0) {
          console.error('No chapter found with id:', id);
          return new Response(JSON.stringify({ error: 'Chapter not found or no permission to update' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Chapter updated successfully:', chapters[0]);
        return new Response(JSON.stringify(chapters[0]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Delete chapter (invoke always uses POST)
      if (action === 'delete') {
        const { id } = body || {};
        if (!id) throw new Error('id is required');

        console.log('Deleting chapter (POST action):', id);
        
        const { data: deleted, error } = await supabase
          .from('chapters')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error('Delete error:', error);
          throw error;
        }

        if (!deleted || deleted.length === 0) {
          console.error('No chapter found to delete with id:', id);
          return new Response(JSON.stringify({ error: 'Chapter not found or no permission to delete' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Chapter deleted successfully');
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default: create chapter
      const { mangaId, chapterNumber, title, content } = body;
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
          .maybeSingle();

        if (error) throw error;
        if (!chapter) {
          return new Response(JSON.stringify({ error: 'Chapter not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

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
      const { id, chapterNumber, title, content } = await req.json();
      
      if (!id) {
        throw new Error('id is required');
      }

      console.log('Updating chapter:', id);

      const { data: chapter, error } = await supabase
        .from('chapters')
        .update({
          chapter_number: chapterNumber,
          title,
          content
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!chapter) {
        return new Response(JSON.stringify({ error: 'Chapter not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE chapter
    if (req.method === 'DELETE') {
      const { id } = await req.json();
      
      if (!id) {
        throw new Error('id is required');
      }

      console.log('Deleting chapter:', id);

      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

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
