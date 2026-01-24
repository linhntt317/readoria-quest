import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const CHAPTERS_PER_PAGE = 20;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    if (!id) {
      return NextResponse.json(
        { error: "Manga ID is required" },
        { status: 400 },
      );
    }

    if (page < 1) {
      return NextResponse.json({ error: "Page must be >= 1" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Calculate pagination
    const offset = (page - 1) * CHAPTERS_PER_PAGE;

    // ⚡ OPTIMIZED: Fetch chapters and count in parallel
    const [chaptersRes, countRes] = await Promise.all([
      supabase
        .from("chapters")
        .select("id, chapter_number, title, created_at")
        .eq("manga_id", id)
        .order("chapter_number", { ascending: false })
        .range(offset, offset + CHAPTERS_PER_PAGE - 1),

      supabase
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("manga_id", id),
    ]);

    const { data: chapters, error: chaptersError } = chaptersRes;
    const { count, error: countError } = countRes;

    if (chaptersError) throw chaptersError;
    if (countError) throw countError;

    const response = NextResponse.json({
      chapters: chapters || [],
      page,
      limit: CHAPTERS_PER_PAGE,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / CHAPTERS_PER_PAGE),
      hasMore: offset + CHAPTERS_PER_PAGE < (count || 0),
    });

    // 10 minutes cache for pagination
    response.headers.set("Cache-Control", "public, max-age=600, s-maxage=600");
    return response;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Unable to fetch chapters" },
      { status: 500 },
    );
  }
}
