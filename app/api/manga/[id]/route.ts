import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function getMangaDetails(id: string) {
  if (!id) {
    return { error: "Manga ID is required", status: 400 };
  }

  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return {
        error: "Server configuration error",
        details: "Missing environment variables",
        status: 500,
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get manga details
    const { data: manga, error: mangaError } = await supabase
      .from("manga")
      .select("*")
      .eq("id", id)
      .single();

    if (mangaError) {
      console.error("Manga query error:", mangaError);
      throw mangaError;
    }

    if (!manga) {
      return { error: "Manga not found", status: 404 };
    }

    // Get manga tags
    const { data: mangaTags, error: tagsError } = await supabase
      .from("manga_tags")
      .select(
        `
        tags (
          id,
          name
        )
      `,
      )
      .eq("manga_id", id);

    if (tagsError) {
      console.error("Tags query error:", tagsError);
      throw tagsError;
    }

    // Get chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from("chapters")
      .select("id, chapter_number, title, created_at")
      .eq("manga_id", id)
      .order("chapter_number", { ascending: true });

    if (chaptersError) {
      console.error("Chapters query error:", chaptersError);
      throw chaptersError;
    }

    return {
      data: {
        ...manga,
        tags: mangaTags?.map((mt: any) => mt.tags) || [],
        chapters: chapters || [],
      },
    };
  } catch (error) {
    console.error("Error fetching manga:", error);
    return {
      error: "Unable to fetch manga details",
      details: error instanceof Error ? error.message : String(error),
      status: 500,
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getMangaDetails(id);

  if (result.error) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status || 500 },
    );
  }

  return NextResponse.json(result.data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getMangaDetails(id);

  if (result.error) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status || 500 },
    );
  }

  return NextResponse.json(result.data);
}
