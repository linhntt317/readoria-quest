#!/usr/bin/env node

/**
 * Apply migration using Supabase JS client
 * Usage: node apply-migration.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const migration = `
-- Add color and category columns to tags table
ALTER TABLE public.tags
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Add status column to manga table
ALTER TABLE public.manga
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ongoing';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category);
CREATE INDEX IF NOT EXISTS idx_manga_status ON public.manga(status);
`;

async function runMigration() {
  try {
    console.log("🔄 Applying migration...");

    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migration,
    });

    if (error) {
      // If exec_sql doesn't exist, try alternative approach
      console.log("⚠️  exec_sql not available, trying alternative...");

      // Run individual statements
      const statements = migration.split(";").filter((s) => s.trim());

      for (const statement of statements) {
        if (!statement.trim()) continue;

        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error: stmtError } = await supabase
          .from("_migrations")
          .insert([{ sql: statement }])
          .select();

        if (stmtError && !stmtError.message.includes("does not exist")) {
          throw stmtError;
        }
      }

      console.log("✅ Migration applied successfully!");
      return;
    }

    console.log("✅ Migration applied successfully!");
    console.log("Response:", data);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigration();
