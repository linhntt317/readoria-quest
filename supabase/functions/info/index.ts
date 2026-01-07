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

// Allowed domain for story info fetching - whitelist to prevent SSRF
const ALLOWED_EXTERNAL_DOMAIN = 'truyenwikidich.net';

// Validation schema for the request
const infoRequestSchema = z.object({
  u: z.string().url().max(2000, 'URL too long')
});

// Helper function to check admin role
const checkAdminRole = async (req: Request, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Missing authorization header' };
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
};

// Helper function to validate and sanitize URL to prevent SSRF
function validateExternalUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(urlString);
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: 'Invalid protocol - only HTTP/HTTPS allowed' };
    }
    
    // Whitelist domain check
    if (url.hostname !== ALLOWED_EXTERNAL_DOMAIN) {
      return { valid: false, error: `Domain not allowed. Only ${ALLOWED_EXTERNAL_DOMAIN} is permitted` };
    }
    
    // Block private IP ranges and localhost
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local')
    ) {
      return { valid: false, error: 'Private IP addresses not allowed' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Check admin authentication
    const { user, error: authError } = await checkAdminRole(req, supabase);
    if (authError) {
      return new Response(
        JSON.stringify({ error: authError }), 
        { 
          status: authError.includes('Forbidden') ? 403 : 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const validation = infoRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: validation.error.errors 
        }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { u } = validation.data;

    // Validate URL to prevent SSRF
    const urlValidation = validateExternalUrl(u);
    if (!urlValidation.valid) {
      console.warn('SSRF attempt blocked:', u);
      return new Response(
        JSON.stringify({ error: urlValidation.error }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching story info for:', u);

    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const encodedUrl = encodeURIComponent(u);
      const response = await fetch(`https://${ALLOWED_EXTERNAL_DOMAIN}/info?u=${encodedUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `u=${encodedUrl}`,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('External API returned error:', response.status);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch story info from external source' }), 
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Error fetching from external API:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch story info' }), 
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in info function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' } }
    );
  }
});
