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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  };
}

// Danh sách từ ngữ nhạy cảm cơ bản
const SENSITIVE_WORDS = [
  'spam', 'scam', 'hack', 'đụ', 'địt', 'lồn', 'cặc', 'vãi', 'đéo', 'đm', 'vcl', 'cc', 'dm'
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_COMMENTS_PER_WINDOW = 5; // 5 comments per minute per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(clientIp: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);
  
  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
  
  if (!record || now > record.resetTime) {
    // New window or expired - allow and start fresh
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (record.count >= MAX_COMMENTS_PER_WINDOW) {
    // Rate limit exceeded
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }
  
  // Increment count and allow
  record.count++;
  return { allowed: true };
}

// Get client IP from request headers
function getClientIp(req: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

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
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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
          JSON.stringify({ error: 'Unable to fetch comments' }),
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
      // Rate limiting check
      const clientIp = getClientIp(req);
      const rateCheck = checkRateLimit(clientIp);
      
      if (!rateCheck.allowed) {
        console.log(`Rate limit exceeded for IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ 
            error: 'Too many comments. Please wait before submitting again.',
            retryAfter: rateCheck.retryAfterSeconds
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': String(rateCheck.retryAfterSeconds)
            } 
          }
        );
      }

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
          JSON.stringify({ error: 'Unable to create comment' }),
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
          JSON.stringify({ error: 'Unable to update comment' }),
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
          JSON.stringify({ error: 'Unable to delete comment' }),
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
      { status: 500, headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' } }
    );
  }
});
