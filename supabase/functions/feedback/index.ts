// @ts-nocheck
import { createClient } from 'npm:@supabase/supabase-js@2.76.1';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Standard CORS headers for Supabase edge functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const feedbackSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000, 'Message must be less than 2000 characters'),
});

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const body = await req.json();
      
      console.log('Received feedback request:', body);
      
      const validationResult = feedbackSchema.safeParse(body);
      if (!validationResult.success) {
        console.error('Validation failed:', validationResult.error.errors);
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: validationResult.error.errors,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { name, email, message } = validationResult.data;

      const { data, error: dbError } = await supabase
        .from('feedback')
        .insert({
          name,
          email,
          message,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving feedback:', dbError);
        return new Response(
          JSON.stringify({ error: 'Failed to save feedback' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Feedback saved successfully:', data);
      return new Response(
        JSON.stringify({
          message: 'Feedback submitted successfully',
          data,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});