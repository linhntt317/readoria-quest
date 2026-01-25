# 🐛 Comments API POST - ROOT CAUSE ANALYSIS

## Current Issue
- POST https://ljmoqseafxhncpwzuwex.supabase.co/functions/v1/comments
- Returns: `{ error: "Unable to create comment" }`
- Status: 500

## Why It's Broken

### Timeline of RLS Policy Changes
1. **20251104080423** (original):
   ```sql
   CREATE POLICY "Anyone can insert comments"
   ON public.comments FOR INSERT WITH CHECK (true);
   ```
   ✅ Allows anonymous users

2. **20251221160213** (breaking):
   ```sql
   DROP POLICY "Anyone can insert comments" ON public.comments;
   CREATE POLICY "Authenticated users can insert comments" 
   ON public.comments FOR INSERT TO authenticated WITH CHECK (true);
   ```
   ❌ Only authenticated users allowed - **THIS IS IN PRODUCTION!**

3. **20260125030000** (attempted fix):
   ```sql
   DROP POLICY "Authenticated users can insert comments" ON public.comments;
   CREATE POLICY "Anyone can insert comments" 
   ON public.comments FOR INSERT WITH CHECK (true);
   ```
   ⏳ Created locally but **NOT YET applied to production database**

## Why Migration 20260125030000 Wasn't Applied

Supabase Cloud doesn't auto-apply migrations from git. Need one of:
1. ✅ Manual SQL execution in Supabase Dashboard
2. ✅ Vercel/deployment hook (not configured)
3. ✅ CLI command: `supabase db push`

**Status**: None of above done → migration stuck in git

## Function Code Issues

Current comments function code:
```typescript
const insertClient = authHeader ? supabaseClient : supabaseServiceClient;
await insertClient.from("comments").insert({...});
```

**Problems**:
1. ❌ Service role key exposed in Edge Function code (visible in browser if leaked)
2. ❌ Even with service role key, RLS policy `TO authenticated` **blocks service role** for insert
3. ❌ Service role bypass RLS only for certain policies (not this one)

## Solution Options

### Option 1: Apply SQL Migration (Quickest)
**Pros**: Revert policy to "Anyone can insert"
**Cons**: Need manual dashboard access
**Time**: 2 minutes
**Risk**: Low

### Option 2: Create Next.js API Route (Most Secure)
**Pros**: 
- Hide service role key from client
- Full control over logic
- Can add ratelimit, validation
**Cons**: Extra layer, needs deployment
**Time**: 30 minutes
**Risk**: Low

### Option 3: Disable RLS on Comments Table
**Pros**: Instant fix, no migrations
**Cons**: Security risk, allows direct DB access
**Time**: 5 minutes
**Risk**: HIGH

### Option 4: Change Comments Insert Policy
**Pros**: Specific fix
**Cons**: Need new migration + manual apply
**Time**: 5 minutes
**Risk**: Low

## Recommended Solution

**Option 1 (Quick Fix) + Option 2 (Long Term)**

1. **Immediate**: Apply SQL in Supabase Dashboard
   ```sql
   DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
   CREATE POLICY "Anyone can insert comments" 
   ON public.comments FOR INSERT WITH CHECK (true);
   ```

2. **Then**: Create Next.js API route to use service role server-side (done later)

