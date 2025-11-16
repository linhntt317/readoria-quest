import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env (for local use)
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const OUTPUT = "./public/sitemap.xml";
const SITE_ORIGIN =
  process.env.SITE_ORIGIN || "https://truyennhameo.vercel.app";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing Supabase env vars. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    const { data, error } = await supabase
      .from("manga")
      .select("id, updated_at");
    if (error) throw error;

    const urls = data
      .map((row) => {
        const loc = `${SITE_ORIGIN}/manga/${row.id}`;
        const lastmod = row.updated_at
          ? new Date(row.updated_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_ORIGIN}/</loc>\n    <lastmod>${
      new Date().toISOString().split("T")[0]
    }</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${urls}\n</urlset>`;

    fs.writeFileSync(OUTPUT, xml, "utf8");
    console.log("Sitemap written to", OUTPUT);
  } catch (err) {
    console.error("Failed to generate sitemap:", err.message || err);
    process.exit(1);
  }
}

run();
