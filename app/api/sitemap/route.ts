import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Ensure we run in Node.js runtime (avoids Edge bundling incompatibilities)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_SITE_ORIGIN = "https://truyennhameo.vercel.app";

export async function GET(req: Request) {
  try {
    const siteOrigin = new URL(req.url).origin || DEFAULT_SITE_ORIGIN;

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("manga")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Sitemap query failed:", error);
      return new NextResponse("Unable to generate sitemap", { status: 500 });
    }

    const today = new Date().toISOString().split("T")[0];

    const urls = (data || [])
      .map((row: any) => {
        const lastmod = row.updated_at
          ? new Date(row.updated_at).toISOString().split("T")[0]
          : today;
        return `  <url>\n    <loc>${siteOrigin}/truyen/${row.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteOrigin}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${urls}\n</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err: any) {
    console.error("Sitemap generation failed:", err);
    return new NextResponse("Unable to generate sitemap", { status: 500 });
  }
}

