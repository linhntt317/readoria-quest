import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validation schema
const createCommentSchema = z
  .object({
    mangaId: z.string().uuid().optional(),
    chapterId: z.string().uuid().optional(),
    nickname: z.string().trim().min(1).max(50),
    content: z.string().trim().min(1).max(1000),
    parentId: z.string().uuid().optional(),
  })
  .refine((data) => data.mangaId || data.chapterId, {
    message: "Either mangaId or chapterId must be provided",
  })
  .refine(
    (data) =>
      (data.mangaId && !data.chapterId) || (!data.mangaId && data.chapterId),
    {
      message: "Cannot provide both mangaId and chapterId",
    },
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createCommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { mangaId, chapterId, nickname, content, parentId } =
      validationResult.data;

    // Use Supabase REST API with service role key to bypass RLS
    const response = await fetch(
      `${supabaseUrl}/rest/v1/comments?select=*&apikey=${supabaseServiceKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          manga_id: mangaId || null,
          chapter_id: chapterId || null,
          nickname,
          content,
          parent_id: parentId || null,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Supabase REST API error:", error);
      return NextResponse.json(
        {
          error: "Failed to create comment",
          details: error,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get("mangaId");
    const chapterId = searchParams.get("chapterId");

    if (!mangaId && !chapterId) {
      return NextResponse.json(
        { error: "Either mangaId or chapterId is required" },
        { status: 400 },
      );
    }

    // Build query string for REST API
    let query = `select=*&apikey=${supabaseServiceKey}`;
    if (mangaId) {
      query += `&manga_id=eq.${mangaId}`;
    } else if (chapterId) {
      query += `&chapter_id=eq.${chapterId}`;
    }
    query += "&order=created_at.desc";

    const response = await fetch(`${supabaseUrl}/rest/v1/comments?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Supabase REST API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments", details: error },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
