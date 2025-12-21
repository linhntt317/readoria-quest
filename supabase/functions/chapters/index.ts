// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

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
const createChapterSchema = z.object({
  mangaId: z.string().uuid("Invalid manga ID format"),
  chapterNumber: z
    .number()
    .int()
    .positive("Chapter number must be positive")
    .max(9999),
  title: z.string().max(200).optional().or(z.literal("")).or(z.null()),
  content: z
    .string()
    .min(1, "Content required")
    .max(100000, "Content too long"),
});

const updateChapterSchema = z.object({
  id: z.string().uuid("Invalid chapter ID"),
  chapterNumber: z.number().int().positive().max(9999).optional(),
  title: z.string().max(200).optional().or(z.literal("")).or(z.null()),
  content: z.string().min(1).max(100000).optional(),
});

// Helper function to check admin role
async function checkAdminRole(
  req: Request,
  supabase: any
): Promise<{ user: any; error?: string }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { user: null, error: "Unauthorized - Authentication required" };
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { user: null, error: "Invalid authentication token" };
  }

  // Check if user has admin role
  const { data: hasAdminRole, error: roleError } = await supabase.rpc(
    "has_role",
    {
      _user_id: user.id,
      _role: "admin",
    }
  );

  if (roleError || !hasAdminRole) {
    return { user: null, error: "Forbidden - Admin access required" };
  }

  return { user };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // POST create/update/delete via invoke (requires admin role)
    if (req.method === "POST") {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes("Forbidden") ? 403 : 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json().catch(() => ({}));
      const { action } = body || {};

      // Update chapter (invoke always uses POST)
      if (action === "update") {
        const validation = updateChapterSchema.safeParse(body);
        if (!validation.success) {
          return new Response(
            JSON.stringify({
              error: "Invalid input",
              details: validation.error.format(),
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const { id, chapterNumber, title, content } = validation.data;

        console.log("Updating chapter (POST action):", {
          id,
          chapterNumber,
        });

        const { data: chapters, error } = await supabase
          .from("chapters")
          .update({
            chapter_number: chapterNumber,
            title,
            content,
          })
          .eq("id", id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        if (!chapters || chapters.length === 0) {
          console.error("No chapter found with id:", id);
          return new Response(
            JSON.stringify({
              error: "Chapter not found or no permission to update",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        console.log("Chapter updated successfully:", chapters[0]);
        return new Response(JSON.stringify(chapters[0]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Delete chapter (invoke always uses POST)
      if (action === "delete") {
        const { id } = body || {};
        if (!id) throw new Error("id is required");

        console.log("Deleting chapter (POST action):", id);

        const { data: deleted, error } = await supabase
          .from("chapters")
          .delete()
          .eq("id", id)
          .select();

        if (error) {
          console.error("Delete error:", error);
          throw error;
        }

        if (!deleted || deleted.length === 0) {
          console.error("No chapter found to delete with id:", id);
          return new Response(
            JSON.stringify({
              error: "Chapter not found or no permission to delete",
            }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        console.log("Chapter deleted successfully");
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Default: create chapter
      const validation = createChapterSchema.safeParse(body);
      if (!validation.success) {
        return new Response(
          JSON.stringify({
            error: "Invalid input",
            details: validation.error.format(),
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { mangaId, chapterNumber, title, content } = validation.data;

      console.log("Creating chapter:", { mangaId, chapterNumber });

      // Verify manga exists
      const { data: manga, error: mangaError } = await supabase
        .from("manga")
        .select("id")
        .eq("id", mangaId)
        .maybeSingle();

      if (!manga) {
        return new Response(JSON.stringify({ error: "Manga not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check for duplicate chapter numbers
      const { data: existingChapter } = await supabase
        .from("chapters")
        .select("id")
        .eq("manga_id", mangaId)
        .eq("chapter_number", chapterNumber)
        .maybeSingle();

      if (existingChapter) {
        return new Response(
          JSON.stringify({
            error: "Chapter number already exists for this manga",
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: chapter, error } = await supabase
        .from("chapters")
        .insert({
          manga_id: mangaId,
          chapter_number: chapterNumber,
          title,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET chapters by manga ID or single chapter by ID (public)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mangaId = url.searchParams.get("mangaId");
      const chapterId = url.searchParams.get("id");

      if (chapterId) {
        console.log("Fetching chapter:", chapterId);

        const { data: chapter, error } = await supabase
          .from("chapters")
          .select("*")
          .eq("id", chapterId)
          .maybeSingle();

        if (error) throw error;
        if (!chapter) {
          return new Response(JSON.stringify({ error: "Chapter not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(chapter), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!mangaId) {
        throw new Error("mangaId or id is required");
      }

      console.log("Fetching chapters for manga:", mangaId);

      const { data: chapters, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("manga_id", mangaId)
        .order("chapter_number", { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(chapters), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT update chapter (requires admin role)
    if (req.method === "PUT") {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes("Forbidden") ? 403 : 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const rawBody = await req.json();
      const validation = updateChapterSchema.safeParse({
        ...rawBody,
        id: rawBody.id,
      });

      if (!validation.success) {
        return new Response(
          JSON.stringify({
            error: "Invalid input",
            details: validation.error.format(),
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { id, chapterNumber, title, content } = validation.data;

      console.log("Updating chapter:", id);

      const { data: chapter, error } = await supabase
        .from("chapters")
        .update({
          chapter_number: chapterNumber,
          title,
          content,
        })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!chapter) {
        return new Response(JSON.stringify({ error: "Chapter not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(chapter), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE chapter (requires admin role)
    if (req.method === "DELETE") {
      const { user, error: authError } = await checkAdminRole(req, supabase);
      if (authError) {
        return new Response(JSON.stringify({ error: authError }), {
          status: authError.includes("Forbidden") ? 403 : 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { id } = await req.json();

      if (!id) {
        throw new Error("id is required");
      }

      console.log("Deleting chapter:", id);

      const { error } = await supabase.from("chapters").delete().eq("id", id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chapters function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...getCorsHeaders(null), "Content-Type": "application/json" },
    });
  }
});
