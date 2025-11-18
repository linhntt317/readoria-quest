import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Use a server-only SERVICE_ROLE key stored in environment (set in Vercel as SUPABASE_SERVICE_ROLE)
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_SERVICE_ROLE;
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://truyennhameo.vercel.app';

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return new NextResponse('Supabase env not configured', { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  try {
    const { data, error } = await supabase.from('manga').select('id, updated_at');
    if (error) throw error;

    const urls = (data || []).map((row: any) => {
      const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      return `  <url>\n    <loc>${SITE_ORIGIN}/truyen/${row.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_ORIGIN}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${urls}\n</urlset>`;

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (err: any) {
    return new NextResponse('Failed to generate sitemap: ' + (err.message || err), { status: 500 });
  }
}
