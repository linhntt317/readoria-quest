## 🔧 FIX POST COMMENT API - ACTION REQUIRED

**Problem**: POST /api/comments returns 500 "Unable to create comment"

**Root Cause**: RLS policy blocks anonymous comment inserts

---

## ⚡ IMMEDIATE FIX (Takes 1 minute)

### Step 1: Go to Supabase Dashboard SQL Editor
🔗 https://app.supabase.com/project/ljmoqseafxhncpwzuwex/sql

### Step 2: Create new query and paste this SQL:

```sql
-- Fix RLS policy to allow anonymous comments
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

CREATE POLICY "Anyone can insert comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);
```

### Step 3: Execute
- Click "Run" button or press **Ctrl+Enter**
- Wait for success message

### Step 4: Test
```bash
# Test POST comment
curl -X POST https://ljmoqseafxhncpwzuwex.supabase.co/functions/v1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "38e538d6-e0a8-486d-934c-080d46a43528",
    "nickname": "Test User",
    "content": "This is a test comment"
  }'
```

Expected response: **201 Created** with comment data ✅

---

## 📋 What was changed?

Migration `20251221160213` incorrectly changed the policy to:
```sql
FOR INSERT TO authenticated  -- ❌ BLOCKS service role key
```

This needs to be reverted to:
```sql
FOR INSERT  -- ✅ ALLOWS service role key
```

---

## Why this works

1. Edge Function (comments/index.ts) uses service role key for anonymous inserts ✅
2. Service role key is designed to bypass RLS ✅
3. But `TO authenticated` policy still blocks it ❌
4. Removing `TO authenticated` clause fixes it ✅

---

## After Fix

- ✅ Anonymous users can comment
- ✅ Authenticated users can still comment
- ✅ Admins can still manage comments
- ✅ Rate limiting still works
- ✅ Data validation still works

**No code changes needed, only RLS policy fix!**
