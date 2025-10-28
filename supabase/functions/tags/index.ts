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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // GET all tags
    if (req.method === 'GET') {
      console.log('Fetching all tags');
      
      const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(tags), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - Create new tag
    if (req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const body = await req.json();
      console.log('Creating tag:', body);

      const { data: tag, error } = await supabase
        .from('tags')
        .insert({
          name: body.name,
          category: body.category || 'Khác',
          color: body.color || '#6B7280'
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(tag), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT - Update tag
    if (req.method === 'PUT') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const body = await req.json();
      const url = new URL(req.url);
      const tagId = url.pathname.split('/').pop();
      
      console.log('Updating tag:', tagId, body);

      const { data: tag, error } = await supabase
        .from('tags')
        .update({
          name: body.name,
          category: body.category,
          color: body.color
        })
        .eq('id', tagId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(tag), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete tag
    if (req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const url = new URL(req.url);
      const tagId = url.pathname.split('/').pop();
      
      console.log('Deleting tag:', tagId);

      // Delete manga_tags relationships first
      const { error: deleteMangaTagsError } = await supabase
        .from('manga_tags')
        .delete()
        .eq('tag_id', tagId);

      if (deleteMangaTagsError) throw deleteMangaTagsError;

      // Delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

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
    console.error('Error in tags function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
