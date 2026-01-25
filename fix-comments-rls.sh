#!/bin/bash
# Fix comments RLS policy using psql

set -e

# Load environment
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '#' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
    exit 1
fi

# Extract project ID from URL
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Could not extract project ID from SUPABASE_URL"
    exit 1
fi

echo "🔧 Fixing RLS policy for comments table..."
echo "Project ID: $PROJECT_ID"

# Get database password from service role key (JWT contains project info)
# Actually, we need the database connection string from Supabase

# Alternative: Use Supabase CLI
if command -v supabase &> /dev/null; then
    echo "Using Supabase CLI..."
    
    # This would work if authenticated
    # supabase db push
    
    echo "✅ To apply migrations, run: supabase db push"
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "Run this SQL in Supabase Dashboard:"
    echo "https://app.supabase.com/project/$PROJECT_ID/sql"
    echo ""
    cat << 'EOF'
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);
EOF
fi
