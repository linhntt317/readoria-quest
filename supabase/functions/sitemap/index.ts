import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://truyennhameo.vercel.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug}-${id}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all manga
    const { data: mangaList, error: mangaError } = await supabase
      .from("manga")
      .select("id, title, updated_at, created_at")
      .order("updated_at", { ascending: false });

    if (mangaError) throw mangaError;

    // Fetch all chapters
    const { data: chapters, error: chapError } = await supabase
      .from("chapters")
      .select("id, manga_id, chapter_number, created_at")
      .order("created_at", { ascending: false });

    if (chapError) throw chapError;

    // Fetch all tags
    const { data: tags, error: tagError } = await supabase
      .from("tags")
      .select("name");

    if (tagError) throw tagError;

    // Build chapter map by manga_id
    const chaptersByManga = new Map<string, typeof chapters>();
    for (const ch of chapters || []) {
      const list = chaptersByManga.get(ch.manga_id) || [];
      list.push(ch);
      chaptersByManga.set(ch.manga_id, list);
    }

    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tim-kiem</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;

    // Tag/category pages
    for (const tag of tags || []) {
      xml += `
  <url>
    <loc>${SITE_URL}/the-loai/${encodeURIComponent(tag.name)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    // Manga pages
    for (const manga of mangaList || []) {
      const slug = toSlug(manga.title, manga.id);
      const lastmod = (manga.updated_at || manga.created_at || now).split("T")[0];
      xml += `
  <url>
    <loc>${SITE_URL}/truyen/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

      // Chapter pages for this manga
      const mangaChapters = chaptersByManga.get(manga.id) || [];
      for (const ch of mangaChapters) {
        const chLastmod = (ch.created_at || now).split("T")[0];
        xml += `
  <url>
    <loc>${SITE_URL}/truyen/${escapeXml(slug)}/chuong/${ch.id}</loc>
    <lastmod>${chLastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    xml += `
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>
</urlset>`,
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/xml; charset=utf-8",
        },
      }
    );
  }
});
