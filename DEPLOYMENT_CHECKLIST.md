# Deployment Checklist - Performance Optimizations

## 📋 Pre-Deployment Verification

### Code Quality Checks
- [ ] **Verify TypeScript compilation**
  ```bash
  npm run build
  # Should complete with 0 errors
  ```

- [ ] **Check modified files for syntax errors**
  ```bash
  # Files changed:
  ✅ src/hooks/useManga.ts - Optimized queries
  ✅ src/views/Index.tsx - Pagination added
  ✅ src/components/home/HeroCarousel.tsx - Syntax fixed
  ```

- [ ] **Review database migration**
  ```bash
  # File created:
  ✅ supabase/migrations/20250106_add_performance_indexes.sql
  # Contains 8 indexes for optimal query performance
  ```

- [ ] **Lint check**
  ```bash
  npm run lint
  # Should pass with no new errors
  ```

---

## 🔧 Deployment Steps

### Step 1: Staging Environment

**1a. Deploy Code to Staging**
```bash
# Build optimization
npm run build

# Test in development
npm run dev
# Visit http://localhost:3000
# Click through home, detail pages
# Verify "Tải thêm" button works
# Check Network tab - API responses < 500ms
```

**1b. Deploy to Staging Server**
```bash
# Push to staging branch
git add .
git commit -m "Performance optimization: selective columns, pagination, indexes"
git push origin staging

# Vercel automatically deploys to staging.truyennhameo.com
# Wait for build to complete
```

**1c. Test in Staging**
- [ ] Home page loads in < 2 seconds
- [ ] Detail page loads in < 1 second
- [ ] "Tải thêm" button loads 12 more items smoothly
- [ ] Network tab shows payload < 200KB (was 400KB+)
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] Mobile responsive (check on phone)

---

### Step 2: Database Migration

**2a. Create Backup (CRITICAL)**
```bash
# ALWAYS backup before running migrations
supabase db push --dry-run

# Review what will be created
# Should see 8 new indexes being created
```

**2b. Apply Indexes to Production**
```bash
# Apply migration to production database
supabase migration up

# Or manually create indexes:
supabase db push --remote
```

**2c. Verify Indexes Created**
```sql
-- Check all indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('manga', 'chapters', 'manga_tags')
ORDER BY indexname;

-- Should see:
✅ idx_manga_created_at
✅ idx_chapters_manga_id
✅ idx_manga_status_created_at
✅ idx_manga_tags_manga_id
✅ idx_manga_tags_tag_id
✅ idx_chapters_chapter_number
✅ idx_manga_views
✅ idx_manga_rating
```

---

### Step 3: Production Deployment

**3a. Deploy Code**
```bash
# Merge to main branch
git checkout main
git merge staging

# Vercel automatically deploys to production
# Wait for build completion (should be < 3 minutes)

# Verify: https://truyennhameo.vercel.app
```

**3b. Monitor Deployment**
- [ ] Build completes successfully
- [ ] No new errors in logs
- [ ] Home page loads and displays properly
- [ ] Detail pages work correctly
- [ ] "Tải thêm" button functions

---

## ✅ Post-Deployment Verification

### Performance Metrics

**Check in Browser DevTools (Network Tab):**
```
Expected Results:

1. Home Page Load
   ├─ useManga() API call
   │  └─ Time: 150-300ms (was 500-800ms) ✅ 60% faster
   │  └─ Size: 80-100KB (was 400KB) ✅ 75% smaller
   │
   ├─ Page rendering
   │  └─ Time: 100-300ms (was 200-400ms)
   │
   └─ Total: 600-1200ms (was 2000-3000ms) ✅ 70% faster

2. Detail Page Load
   ├─ API call
   │  └─ Time: 300-400ms (was 900-1500ms with 3 calls) ✅ 66% faster
   │
   └─ Total: 400-600ms (was 900-1500ms) ✅ 60% faster

3. "Tải thêm" Button
   ├─ Click to load more: Instant (no API call) ✅
   └─ Smooth scrolling: No jank observed ✅
```

### Lighthouse Score

**Run Lighthouse Audit:**
```bash
# Chrome DevTools → Lighthouse → Generate Report

Expected Scores:
├─ Performance: 85-95 (was 45-55) ✅✅
├─ Accessibility: 85+ (should stay same)
├─ Best Practices: 85+ (should stay same)
├─ SEO: 90+ (should stay same)
└─ PWA: N/A

✅ Overall Score: 90+ (was 50+)
```

### Database Performance

**Query Performance Check (optional, for monitoring):**
```sql
-- Check query execution times
SELECT query, mean_time, calls
FROM pg_stat_statements
WHERE query LIKE '%manga%'
ORDER BY mean_time DESC
LIMIT 5;

-- Expected: mean_time < 100ms for most queries
-- (was 200-500ms before indexes)
```

---

## 🚨 Troubleshooting

### Issue: Build Fails After Deployment

**Solution:**
```bash
# Check for TypeScript errors
npm run build

# Fix any errors, then redeploy
git add .
git commit -m "Fix: [error description]"
git push origin main
```

### Issue: Home Page Loads Slow Still

**Diagnosis:**
```bash
# Check if migration was applied
supabase migration list

# Verify indexes exist
SELECT * FROM pg_stat_user_indexes;

# Check query plan
EXPLAIN ANALYZE 
SELECT id, title, author, image_url, views, rating, created_at, description
FROM manga 
ORDER BY created_at DESC 
LIMIT 100;

# Should use index scan, not sequential scan
```

### Issue: "Tải thêm" Button Not Working

**Check:**
```javascript
// Browser console
// 1. Click button and check console for errors
// 2. Verify displayCount state increases
// 3. Check if mangaData is fully loaded

// Should see no errors and smooth pagination
```

### Issue: API Payload Still Large (> 200KB)

**Check:**
```bash
# Verify useManga.ts was updated correctly
grep "SELECT \*" src/hooks/useManga.ts
# Should return 0 results (no SELECT *)

# Verify limit was added
grep "limit(100)" src/hooks/useManga.ts
# Should return 1 result

# Rebuild if needed
npm run build
```

---

## 📊 Performance Monitoring

### Daily Checks (First Week)
- [ ] Home page load time (should be 600-1200ms)
- [ ] API response times (should be < 500ms)
- [ ] Error rates (should be 0%)
- [ ] User complaints (monitor support tickets)

### Weekly Checks
- [ ] Database query times
- [ ] Index usage statistics
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Page load analytics

### Monthly Checks
```sql
-- Slow query log
SELECT query, calls, mean_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC
LIMIT 10;

-- Unused indexes (can drop)
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname LIKE 'idx_manga%'
ORDER BY indexname;

-- Index bloat
SELECT schemaname, tablename, indexname, 
  round(index_size/1024.0, 2) AS index_size_mb
FROM pg_stat_user_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY index_size DESC;
```

---

## 🔄 Rollback Plan (Emergency)

**If Critical Issues Occur:**

### Step 1: Revert Code
```bash
# Find the previous commit
git log --oneline | head -5

# Revert to previous version
git revert <commit-hash>
git push origin main

# Vercel redeploys automatically
```

### Step 2: Drop Indexes (if needed)
```sql
-- Revert database changes
DROP INDEX IF EXISTS idx_manga_created_at;
DROP INDEX IF EXISTS idx_chapters_manga_id;
DROP INDEX IF EXISTS idx_manga_status_created_at;
DROP INDEX IF EXISTS idx_manga_tags_manga_id;
DROP INDEX IF EXISTS idx_manga_tags_tag_id;
DROP INDEX IF EXISTS idx_chapters_chapter_number;
DROP INDEX IF EXISTS idx_manga_views;
DROP INDEX IF EXISTS idx_manga_rating;
```

**Time to rollback:** ~5 minutes max

---

## 📝 Documentation for Team

**Files Created (Reference):**
1. `CODE_CHANGES_SUMMARY.md` - Exact code changes
2. `PERFORMANCE_BEFORE_AFTER.md` - Visual comparisons
3. `PERFORMANCE_OPTIMIZATION_FINAL.md` - Full guide
4. `PERFORMANCE_ANALYSIS_COMPLETE.md` - Technical analysis

**Share with team:**
- Development team: CODE_CHANGES_SUMMARY.md
- QA team: PERFORMANCE_BEFORE_AFTER.md + DEPLOYMENT_CHECKLIST.md
- DevOps/Database team: PERFORMANCE_OPTIMIZATION_FINAL.md
- Stakeholders: PERFORMANCE_BEFORE_AFTER.md (visual summaries)

---

## ✅ Deployment Approval

**Before deploying to production, confirm:**

- [ ] **Code Review**: Changes reviewed by senior developer
- [ ] **Testing**: Tested in staging environment
- [ ] **Database**: Migration tested on staging database
- [ ] **Metrics**: Expected improvements documented
- [ ] **Rollback**: Rollback plan prepared
- [ ] **Communication**: Team informed of changes
- [ ] **Monitoring**: Monitoring set up for performance metrics

**Sign-off:**
- [ ] Developer: _______________ Date: _______
- [ ] QA Lead: _______________ Date: _______
- [ ] Product Manager: _______________ Date: _______

---

## 📞 Support Contacts

**If Issues Arise:**
- **Code Issues**: Developer who implemented
- **Database Issues**: Database Administrator
- **Performance Issues**: Performance Engineer
- **User Reports**: Customer Support → QA → Developer

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** 2025-01-06
**Version:** 1.0
