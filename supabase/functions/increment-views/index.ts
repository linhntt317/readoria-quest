// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  };
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
const MAX_VIEWS_PER_MANGA_PER_WINDOW = 3; // 3 views per manga per hour per IP

// In-memory rate limit store (resets on function cold start)
// Key format: `${clientIp}:${mangaId}`
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(clientIp: string, mangaId: string): { allowed: boolean; retryAfterSeconds?: number } {
  const key = `${clientIp}:${mangaId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  // Clean up expired entries periodically (when store gets too large)
  if (rateLimitStore.size > 5000) {
    for (const [k, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }
  
  if (!record || now > record.resetTime) {
    // New window or expired - allow and start fresh
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (record.count >= MAX_VIEWS_PER_MANGA_PER_WINDOW) {
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

// Validation schema
const incrementViewsSchema = z.object({
  mangaId: z.string().uuid('Invalid manga ID format'),
});

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key to bypass RLS for incrementing views
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate request body
    const body = await req.json();
    const validationResult = incrementViewsSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { mangaId } = validationResult.data;
    const clientIp = getClientIp(req);

    // Check rate limit
    const rateCheck = checkRateLimit(clientIp, mangaId);
    
    if (!rateCheck.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIp}, manga: ${mangaId}`);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'View rate limit exceeded. Please wait before viewing again.',
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

    // Verify manga exists before incrementing
    const { data: manga, error: mangaError } = await supabase
      .from('manga')
      .select('id')
      .eq('id', mangaId)
      .maybeSingle();

    if (mangaError) {
      console.error('Error checking manga:', mangaError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify manga' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!manga) {
      return new Response(
        JSON.stringify({ error: 'Manga not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment the view count using direct update instead of RPC
    const { error: updateError } = await supabase
      .from('manga')
      .update({ views: supabase.rpc ? undefined : undefined }) // Placeholder to use RPC below
      .eq('id', mangaId);

    // Use RPC function with service role
    const { error: rpcError } = await supabase.rpc('increment_manga_views', {
      manga_uuid: mangaId,
    });

    if (rpcError) {
      console.error('Error incrementing views:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Failed to increment views' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`View incremented for manga: ${mangaId}, IP: ${clientIp}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' } }
    );
  }
});
