# 🔧 Fix Comments API - Anonymous Users

## Problem
POST `/functions/v1/comments` returns **500 error** for anonymous users (not logged in)

## Root Cause
RLS Policy on `comments` table requires `TO authenticated`:
```sql
FOR INSERT TO authenticated  -- ❌ Only authenticated users allowed
```

But Supabase Edge Function uses anon key → fails RLS check

## Solution

### Step 1: Apply SQL Migration (REQUIRED)

**Go to Supabase Dashboard SQL Editor:**
https://app.supabase.com/project/ljmoqseafxhncpwzuwex/sql

**Execute this SQL:**
```sql
-- Allow anonymous users to insert comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);
```

### Step 2: Wait for Function Deployment

The updated Edge Function will auto-deploy in 2-5 minutes. Changes:
- Added `SUPABASE_SERVICE_ROLE_KEY` usage
- Anonymous comments use service role key (bypasses RLS)
- Authenticated comments still use anon key

### Step 3: Test

```bash
node test-comments.js
```

Expected output:
```
✓ GET Comments: PASSED
✓ POST Comment: PASSED
```

## Technical Details

**After Migration:**
- RLS policy changed: `FOR INSERT WITH CHECK (true)` ✓
- Anonymous users can insert via service role key ✓
- Authenticated users can still use their token ✓

## Files Changed
- `supabase/functions/comments/index.ts` - Added service role key
- `supabase/migrations/20260125030000_allow_anonymous_comments.sql` - New migration

