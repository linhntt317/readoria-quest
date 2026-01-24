#!/usr/bin/env node

const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";
const mangaId = "68dd8615-46bb-4e3c-b561-e7debfe1f0d2";

const query = `id,title,author,description,image_url,views,rating,created_at,updated_at,tags:manga_tags(tag:tags(id,name)),chapters:chapters(id,chapter_number,title,created_at,content)`;

const url = `${SUPABASE_URL}/rest/v1/manga?select=${encodeURIComponent(query)}&id=eq.${mangaId}`;

console.log("Testing API Query...\n");
console.log("URL:", url.substring(0, 100) + "...\n");

fetch(url, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  },
})
  .then((res) => {
    console.log(`Status: ${res.status} ${res.statusText}\n`);
    return res.json();
  })
  .then((data) => {
    console.log("✅ Success! Response:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
  });
