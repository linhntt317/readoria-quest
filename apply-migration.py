#!/usr/bin/env python3
"""
Apply migration using psql via direct connection
Requires psql to be installed
"""

import subprocess
import sys

SUPABASE_HOST = 'db.ljmoqseafxhncpwzuwex.supabase.co'
SUPABASE_DB = 'postgres'
SUPABASE_USER = 'postgres'
SUPABASE_PASSWORD = input("Enter Supabase Postgres password: ")

migration_sql = """
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
"""

try:
    print("🔄 Applying migration...")
    
    result = subprocess.run(
        [
            'psql',
            '-h', SUPABASE_HOST,
            '-U', SUPABASE_USER,
            '-d', SUPABASE_DB,
            '-c', migration_sql
        ],
        capture_output=True,
        text=True,
        input=SUPABASE_PASSWORD
    )
    
    if result.returncode == 0:
        print("✅ Migration applied successfully!")
        print(result.stdout)
    else:
        print("❌ Migration failed:")
        print(result.stderr)
        sys.exit(1)
        
except FileNotFoundError:
    print("❌ psql not found. Install PostgreSQL first.")
    sys.exit(1)
