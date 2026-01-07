// @ts-nocheck
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://truyennhameo.vercel.app',
  'https://www.truyennhameo.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
];

// Function to get CORS headers based on origin
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Validation schemas
const createMangaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(10000),
  imageUrl: z.string().url().max(500),
  tagIds: z.array(z.string().uuid()).max(20)
});

const updateMangaSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(10000),
  imageUrl: z.string().url().max(500),
  tagIds: z.array(z.string().uuid()).max(20)
});

// Helper function to check admin role
async function checkAdminRole(req: Request, supabase: any): Promise<{ user: any; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Unauthorized - Authentication required' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return { user: null, error: 'Invalid authentication token' };
  }

  // Check if user has admin role
  const { data: hasAdminRole, error: roleError } = await supabase
    .rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });

  if (roleError || !hasAdminRole) {
    return { user: null, error: 'Forbidden - Admin access required' };
  }

  return { user };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const truyenId = pathParts[pathParts.length - 1];

    // GET single truyen by ID
    if (req.method === 'GET' && truyenId && truyenId !== 'truyen') {
      console.log('Fetching truyen with ID:', truyenId);
      
      // Get truyen details
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .eq('id', truyenId)
        .single();

      if (mangaError) throw mangaError;

      // Get truyen tags
      const { data: mangaTags, error: tagsError } = await supabase
        .from('manga_tags')
        .select(`
          tags (
            id,
            name
          )
        `)
        .eq('manga_id', truyenId);

      if (tagsError) throw tagsError;

      // Get chapters (only metadata, not content for performance)
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, chapter_number, title, created_at')
        .eq('manga_id', truyenId)
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

    // GET all truyen
    if (req.method === 'GET') {
      console.log('Fetching all truyen');
      
      const { data: mangaList, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false });

      if (mangaError) throw mangaError;

      // Get tags for each truyen
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

    // POST create truyen (requires admin role)
    if (req.method === 'POST') {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes('Forbidden') ? 403 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const rawBody = await req.json();
      
      // Validate input
      const validation = createMangaSchema.safeParse(rawBody);
      if (!validation.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid input', details: validation.error.format() }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { title, author, description, imageUrl, tagIds } = validation.data;
      
      console.log('Creating truyen:', { title, author, tagIds });

      // Verify all tags exist
      if (tagIds && tagIds.length > 0) {
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id')
          .in('id', tagIds);
        
        if (!existingTags || existingTags.length !== tagIds.length) {
          return new Response(
            JSON.stringify({ error: 'One or more tag IDs are invalid' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

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

    // PUT update truyen (requires admin role)
    if (req.method === 'PUT') {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes('Forbidden') ? 403 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const rawBody = await req.json();
      
      // Get manga ID from body or URL
      const mangaId = rawBody.id || truyenId;
      
      if (!mangaId || mangaId === 'truyen') {
        return new Response(
          JSON.stringify({ error: 'Manga ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate input
      const validation = updateMangaSchema.safeParse(rawBody);
      if (!validation.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid input', details: validation.error.format() }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { title, author, description, imageUrl, tagIds } = validation.data;
      
      console.log('Updating truyen:', mangaId, { title, author, tagIds });

      // Verify all tags exist
      if (tagIds && tagIds.length > 0) {
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id')
          .in('id', tagIds);
        
        if (!existingTags || existingTags.length !== tagIds.length) {
          return new Response(
            JSON.stringify({ error: 'One or more tag IDs are invalid' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Update manga
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .update({
          title,
          author,
          description,
          image_url: imageUrl
        })
        .eq('id', mangaId)
        .select()
        .single();

      if (mangaError) throw mangaError;

      // Delete existing tags
      await supabase
        .from('manga_tags')
        .delete()
        .eq('manga_id', mangaId);

      // Insert new tags
      if (tagIds && tagIds.length > 0) {
        const mangaTags = tagIds.map((tagId: string) => ({
          manga_id: mangaId,
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

    // DELETE truyen (requires admin role)
    if (req.method === 'DELETE' && truyenId && truyenId !== 'truyen') {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes('Forbidden') ? 403 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Deleting truyen:', truyenId);

      // Delete chapters first (cascade)
      await supabase
        .from('chapters')
        .delete()
        .eq('manga_id', truyenId);

      // Delete manga tags
      await supabase
        .from('manga_tags')
        .delete()
        .eq('manga_id', truyenId);

      // Delete manga
      const { error: mangaError } = await supabase
        .from('manga')
        .delete()
        .eq('id', truyenId);

      if (mangaError) throw mangaError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in truyen function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' },
    });
  }
});
