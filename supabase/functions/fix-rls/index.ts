import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("🔧 Starting RLS Policy Fix...");

    // Execute SQL directly via Postgres
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: `
        DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
        CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
        SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'comments';
      `,
    });

    if (error) {
      console.error("❌ RPC Error:", error);
      throw error;
    }

    console.log("✅ RLS Policy Fixed!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "RLS policy fixed successfully",
        data: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
