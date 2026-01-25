#!/bin/bash
# Apply RLS policy fix for comments via Supabase SQL

SUPABASE_URL="https://ljmoqseafxhncpwzuwex.supabase.co"
SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "Error: SUPABASE_SERVICE_ROLE_KEY not set"
    exit 1
fi

echo "Applying RLS policy fix..."

# SQL to execute
SQL=$(cat <<'EOF'
-- Allow anonymous users to insert comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);
EOF
)

# Call Supabase REST API to execute SQL
# Note: This won't work directly with REST API, need to use Dashboard or psql

echo "Please execute this SQL in Supabase Dashboard:"
echo ""
echo "$SQL"
echo ""
echo "Steps:"
echo "1. Go to: https://app.supabase.com/project/ljmoqseafxhncpwzuwex/sql"
echo "2. Click 'New Query'"
echo "3. Paste the SQL above"
echo "4. Click Run (Ctrl+Enter)"
echo ""
echo "After that, POST /api/comments will work!"
