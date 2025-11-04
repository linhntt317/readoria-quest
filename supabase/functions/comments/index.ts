import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Danh sách từ ngữ nhạy cảm cơ bản
const SENSITIVE_WORDS = [
  'spam', 'scam', 'hack', 'đụ', 'địt', 'lồn', 'cặc', 'vãi', 'đéo', 'đm', 'vcl', 'cc', 'dm'
];

// Validation schemas
const createCommentSchema = z.object({
  mangaId: z.string().uuid().optional(),
  chapterId: z.string().uuid().optional(),
  nickname: z.string().trim().min(1, 'Nickname is required').max(50, 'Nickname must be less than 50 characters'),
  content: z.string().trim().min(1, 'Content is required').max(1000, 'Content must be less than 1000 characters'),
  parentId: z.string().uuid().optional(),
}).refine(data => data.mangaId || data.chapterId, {
  message: 'Either mangaId or chapterId must be provided',
});

const updateCommentSchema = z.object({
  isHidden: z.boolean(),
});

// Helper function to check for sensitive words
function containsSensitiveWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SENSITIVE_WORDS.some(word => lowerText.includes(word));
}

// Helper function to check admin role
async function checkAdminRole(req: Request, supabase: any): Promise<{ user: any; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { user: null, error: 'Unauthorized' };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { user: null, error: 'Unauthorized' };
  }

  const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
    _user_id: user.id,
    _role: 'admin'
  });

  if (roleError || !hasAdminRole) {
    return { user: null, error: 'Forbidden - Admin access required' };
  }

  return { user };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create authenticated client if Authorization header is present
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = authHeader
      ? createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        })
      : createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const commentId = pathParts[pathParts.length - 1];

    // GET all comments for a manga or chapter
    if (req.method === 'GET') {
      const mangaId = url.searchParams.get('mangaId');
      const chapterId = url.searchParams.get('chapterId');

      if (!mangaId && !chapterId) {
        return new Response(
          JSON.stringify({ error: 'Either mangaId or chapterId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let query = supabaseClient
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (mangaId) {
        query = query.eq('manga_id', mangaId);
      } else if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      const { data: comments, error } = await query;

      if (error) {
        console.error('Error fetching comments:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(comments),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Create new comment
    if (req.method === 'POST') {
      const body = await req.json();
      
      const validationResult = createCommentSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Validation failed', 
            details: validationResult.error.errors 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { mangaId, chapterId, nickname, content, parentId } = validationResult.data;

      // Check for sensitive words
      if (containsSensitiveWords(content) || containsSensitiveWords(nickname)) {
        return new Response(
          JSON.stringify({ 
            error: 'Your comment contains inappropriate language. Please remove it and try again.',
            sensitive: true
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If parentId is provided, verify it exists
      if (parentId) {
        const { data: parentComment, error: parentError } = await supabaseClient
          .from('comments')
          .select('id')
          .eq('id', parentId)
          .maybeSingle();

        if (parentError || !parentComment) {
          return new Response(
            JSON.stringify({ error: 'Parent comment not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      const { data: newComment, error: insertError } = await supabaseClient
        .from('comments')
        .insert({
          manga_id: mangaId || null,
          chapter_id: chapterId || null,
          nickname,
          content,
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating comment:', insertError);
        return new Response(
          JSON.stringify({ error: insertError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(newComment),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT - Update comment (admin only - to hide/unhide)
    if (req.method === 'PUT') {
      const { user, error: authError } = await checkAdminRole(req, supabaseClient);
      
      if (authError) {
        return new Response(
          JSON.stringify({ error: authError }),
          { status: authError === 'Unauthorized' ? 401 : 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const validationResult = updateCommentSchema.safeParse(body);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            error: 'Validation failed', 
            details: validationResult.error.errors 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { isHidden } = validationResult.data;

      const { data: updatedComment, error: updateError } = await supabaseClient
        .from('comments')
        .update({ is_hidden: isHidden })
        .eq('id', commentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating comment:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(updatedComment),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE - Delete comment (admin only)
    if (req.method === 'DELETE') {
      const { user, error: authError } = await checkAdminRole(req, supabaseClient);
      
      if (authError) {
        return new Response(
          JSON.stringify({ error: authError }),
          { status: authError === 'Unauthorized' ? 401 : 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: deleteError } = await supabaseClient
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) {
        console.error('Error deleting comment:', deleteError);
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Comment deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
