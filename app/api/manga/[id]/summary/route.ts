import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Manga ID is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ⚡ OPTIMIZED: Combine all queries into ONE
    // Get manga + tags + recent chapters + count in parallel
    const [mangaRes, tagsRes, chaptersRes, countRes] = await Promise.all([
      // Query 1: Manga basic info
      supabase
        .from("manga")
        .select(
          "id, title, author, description, image_url, views, rating, created_at",
        )
        .eq("id", id)
        .single(),

      // Query 2: Tags
      supabase.from("manga_tags").select("tags(id, name)").eq("manga_id", id),

      // Query 3: Recent 10 chapters only
      supabase
        .from("chapters")
        .select("id, chapter_number, title, created_at")
        .eq("manga_id", id)
        .order("chapter_number", { ascending: false })
        .limit(10),

      // Query 4: Total count (fast with head: true)
      supabase
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("manga_id", id),
    ]);

    const { data: manga, error: mangaError } = mangaRes;
    const { data: mangaTags, error: tagsError } = tagsRes;
    const { data: recentChapters, error: chaptersError } = chaptersRes;
    const { count: totalChapters, error: countError } = countRes;

    if (mangaError) throw mangaError;
    if (!manga) {
      return NextResponse.json({ error: "Manga not found" }, { status: 404 });
    }

    if (tagsError) throw tagsError;
    if (chaptersError) throw chaptersError;
    if (countError) throw countError;

    // ✅ Cache-Control header for optimal performance
    const response = NextResponse.json({
      ...manga,
      tags: mangaTags?.map((mt: any) => mt.tags) || [],
      chapters: recentChapters || [],
      totalChapters: totalChapters || 0,
      isPartialData: true,
    });

    // 5 minutes cache (content rarely changes)
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
    return response;
  } catch (error) {
    console.error("Error fetching manga summary:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch manga summary",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
