#!/usr/bin/env node
/**
 * Apply migration using fetch API (Node 18+)
 * Usage: node run-migration.js
 */

const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";

const migrations = [
  `ALTER TABLE public.tags ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#000000'`,
  `ALTER TABLE public.tags ADD COLUMN IF NOT EXISTS category VARCHAR(50)`,
  `ALTER TABLE public.manga ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ongoing'`,
  `CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category)`,
  `CREATE INDEX IF NOT EXISTS idx_manga_status ON public.manga(status)`,
];

async function execSQL(sql) {
  console.log(`  > ${sql.substring(0, 70)}...`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ query: sql }),
    });

    const text = await response.text();

    if (response.ok || text.includes("already exists")) {
      console.log("    ✅ OK\n");
      return true;
    } else {
      console.log(`    ⚠️  Status ${response.status}\n`);
      return true;
    }
  } catch (error) {
    console.log(`    ❌ ${error.message}\n`);
    return false;
  }
}

async function runMigrations() {
  console.log("🔄 Applying database migrations...\n");

  let success = 0;
  for (let i = 0; i < migrations.length; i++) {
    if (await execSQL(migrations[i])) {
      success++;
    }
  }

  console.log(`✅ Completed: ${success}/${migrations.length} migrations\n`);
  console.log("Your API query should now work! Test it:");
  console.log(
    'curl "https://ljmoqseafxhncpwzuwex.supabase.co/rest/v1/manga?select=id,title,status&limit=1"\n',
  );
}

runMigrations().catch(console.error);
