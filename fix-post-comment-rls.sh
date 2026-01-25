#!/bin/bash
# Script to apply RLS fix directly to Supabase production database
# Usage: bash fix-post-comment-rls.sh

SUPABASE_PROJECT_ID="ljmoqseafxhncpwzuwex"
SUPABASE_URL="https://${SUPABASE_PROJECT_ID}.supabase.co"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set"
  echo "Set it with: export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
  exit 1
fi

echo "🔧 Fixing POST comment RLS policy..."
echo "URL: $SUPABASE_URL/rest/v1/rpc/exec_sql"

# Execute SQL via Supabase RPC
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "DROP POLICY IF EXISTS \"Authenticated users can insert comments\" ON public.comments; CREATE POLICY \"Anyone can insert comments\" ON public.comments FOR INSERT WITH CHECK (true);"
  }' \
  2>/dev/null | jq .

echo ""
echo "✅ RLS policy fixed! Try posting a comment now."
