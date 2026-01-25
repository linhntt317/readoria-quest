#!/usr/bin/env python3
"""
Fix comments RLS policy by connecting to Supabase PostgreSQL database
Requires: psycopg2 or psycopg3
"""

import os
import sys
from urllib.parse import urlparse

def fix_rls_policy():
    """Apply RLS policy fix to comments table"""
    
    # Get connection string from Supabase
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        print("Set them in .env.local")
        return False
    
    # Supabase connection string format:
    # postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
    
    project_id = urlparse(supabase_url).netloc.split('.')[0]
    print(f"Project ID: {project_id}")
    
    # You would need the database password to connect directly
    # For now, just show instructions
    print("""
❌ Cannot connect directly without database password.

Use one of these methods instead:

1️⃣  Supabase Dashboard (EASIEST):
   https://app.supabase.com/project/{}/sql
   
   Run this SQL:
   
   DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
   CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);

2️⃣  Supabase CLI:
   supabase db push
   
3️⃣  psql command:
   psql "postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres" \\
     -c "DROP POLICY IF EXISTS ... ON public.comments;"
""".format(project_id))
    
    return True

if __name__ == '__main__':
    fix_rls_policy()
