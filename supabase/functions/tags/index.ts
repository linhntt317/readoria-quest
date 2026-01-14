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
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const createTagSchema = z.object({
  name: z.string().trim().min(1).max(50),
  category: z.string().trim().min(1).max(50).default('Khác'),
  color: z.string().regex(hexColorRegex, 'Invalid hex color').default('#6B7280')
});

const updateTagSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  color: z.string().regex(hexColorRegex, 'Invalid hex color').optional()
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

    // GET all tags (public)
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

    // POST - Create new tag (requires admin role)
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
      const validation = createTagSchema.safeParse(rawBody);
      if (!validation.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid input', details: validation.error.format() }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { name, category, color } = validation.data;
      
      console.log('Creating tag:', { name, category, color });

      // Check for duplicate tag name
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', name)
        .maybeSingle();
      
      if (existingTag) {
        return new Response(
          JSON.stringify({ error: 'Tag with this name already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: tag, error } = await supabase
        .from('tags')
        .insert({
          name,
          category,
          color
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(tag), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT - Update tag (requires admin role)
    if (req.method === 'PUT') {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes('Forbidden') ? 403 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const rawBody = await req.json();
      
      // Validate input
      const validation = updateTagSchema.safeParse(rawBody);
      if (!validation.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid input', details: validation.error.format() }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const url = new URL(req.url);
      const tagId = url.pathname.split('/').pop();
      
      console.log('Updating tag:', tagId, validation.data);

      // Check for duplicate tag name (if name is being updated)
      if (validation.data.name) {
        const { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', validation.data.name)
          .neq('id', tagId)
          .maybeSingle();
        
        if (existingTag) {
          return new Response(
            JSON.stringify({ error: 'Tag with this name already exists' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      const { data: tag, error } = await supabase
        .from('tags')
        .update(validation.data)
        .eq('id', tagId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(tag), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete tag (requires admin role)
    if (req.method === 'DELETE') {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes('Forbidden') ? 403 : 401,
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
    return new Response(JSON.stringify({ error: 'Unable to process request' }), {
      status: 500,
      headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' },
    });
  }
});
