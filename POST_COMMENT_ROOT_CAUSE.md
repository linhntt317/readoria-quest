## 🔍 POST Comment API - Root Cause Analysis & Fix

### Current State
```
CommentSection.tsx (Frontend)
  ↓ Calls Edge Function with payload:
  ↓ {chapterId, nickname, content}
  ↓
/functions/v1/comments (Edge Function)
  ├─ No Authorization header
  └─ → Uses supabaseServiceClient (service role key)
  ↓
Supabase Database
  ├─ INSERT into comments
  ├─ RLS Policy Check: "Authenticated users can insert" 
  ├─ Policy enforces: TO authenticated
  └─ ❌ Service role key is NOT authenticated session
  ↓
500 Error: "Unable to create comment"
```

### Root Cause
**Migration 20251221160213** changed RLS policy from:
```sql
-- Original (✅ CORRECT)
FOR INSERT WITH CHECK (true)  -- allows all, including service role

-- Changed to (❌ WRONG)  
FOR INSERT TO authenticated WITH CHECK (true)  -- blocks service role
```

This blocks **ALL inserts** because:
- Service role key can't authenticate as user
- `TO authenticated` is role-based restriction (not RLS bypass)
- REST API doesn't support `rls.bypass_rls = true` setting

### Fix - Apply RLS Migration

**Step 1**: Go to Supabase Dashboard SQL Editor
https://app.supabase.com/project/ljmoqseafxhncpwzuwex/sql

**Step 2**: Run this SQL:
```sql
-- Revert to original policy that allows anonymous comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);
```

**Step 3**: Test
```bash
curl -X POST https://ljmoqseafxhncpwzuwex.supabase.co/functions/v1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "38e538d6-e0a8-486d-934c-080d46a43528",
    "nickname": "test",
    "content": "test comment"
  }'
```

Expected: **201 Created** with comment data

### Why This Works
1. RLS policy allows INSERT without role restriction
2. Edge Function sends request **without Authorization header** (anonymous)
3. Service role key in Edge Function bypasses RLS
4. Comment created successfully

### Files Involved
- **Frontend**: `src/components/CommentSection.tsx` (✅ Correct - calls Edge Function)
- **Backend**: `supabase/functions/comments/index.ts` (✅ Correct - uses service role for anon inserts)
- **Database**: RLS policy in migration `20251221160213` (❌ **NEEDS FIX** - blocks service role)

### Summary
**Architecture is CORRECT**, only RLS policy needs to be reverted to allow anonymous comments.
