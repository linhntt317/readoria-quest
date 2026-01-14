# Performance Optimization Plan

## Current Issues Identified
- APIs are slow, causing poor perceived performance
- Need to improve load times and responsiveness

## Quick Wins (Implement First)

### 1. **API Response Caching**
- **Location**: `src/hooks/useManga.ts`, `src/hooks/useChapter.ts`
- **Problem**: Fetching same data repeatedly on each page load
- **Solution**: Add stale-time caching in React Query
```typescript
const { data: mangaList } = useManga();
// Add cacheTime and staleTime
```
- **Impact**: 💚 High - Reduces repeated API calls significantly

### 2. **Image Optimization**
- **Location**: `src/components/MangaCard.tsx`, `src/views/MangaDetail.tsx`
- **Problem**: Large, unoptimized images loaded from URLs
- **Solution**: 
  - Use Next.js Image component with proper sizing
  - Add `priority={true}` for above-fold images
  - Set `width` and `height` attributes
- **Impact**: 💚 High - Significant size reduction

### 3. **Lazy Loading Images**
- **Problem**: All images load immediately, including below-fold content
- **Solution**: Use `loading="lazy"` on Image components
- **Impact**: 💚 High - Faster initial page load

### 4. **Database Query Optimization**
- **Location**: Supabase RPC functions
- **Problem**: Queries might be selecting all columns or missing indexes
- **Suggested Actions**:
  1. Check RPC function queries (in `supabase/functions/`)
  2. Add SELECT specific columns instead of `SELECT *`
  3. Verify indexes on frequently queried columns (id, created_at, status)
  4. Test query performance in Supabase console
- **Impact**: 💚 High - Reduces API response time

### 5. **Pagination**
- **Location**: Manga list, search results
- **Problem**: Might be loading all manga at once
- **Solution**: Implement infinite scroll or pagination
  - Load first 20, then load more on scroll
  - Use `limit` and `offset` in queries
- **Impact**: 💚 High - Better initial load, progressive content loading

## Medium Priority Optimizations

### 6. **Code Splitting**
- Next.js automatic code splitting is already enabled
- Monitor bundle size: `yarn run build`
- Remove unused dependencies if found

### 7. **API Rate Limiting Optimization**
- Current: Views increment via Edge Function (good approach)
- Ensure increment-views function has proper indexes
- Consider batch operations if available

### 8. **Connection Pooling**
- Supabase manages this automatically
- Ensure PostgreSQL connection settings are optimal in Supabase dashboard

## Testing & Monitoring

### Before & After Metrics to Track:
```
Metric               | Before | Target | Tool
---------------------|--------|--------|------------------
First Contentful Paint (FCP) | ?    | <1.5s  | Lighthouse
Largest Contentful Paint (LCP)| ?   | <2.5s  | Lighthouse
Cumulative Layout Shift (CLS)| ?    | <0.1   | Lighthouse
API Response Time    | slow   | <500ms | Network Tab
Time to Interactive | ?      | <3.5s  | Lighthouse
```

### Commands to Test Performance:
```bash
# Build analysis
yarn run build

# Lighthouse audit (in browser DevTools)
# - Open Chrome DevTools (F12)
# - Go to Lighthouse tab
# - Click "Generate report"

# Network monitoring
# - Open Network tab in DevTools
# - Check API response times
# - Check image sizes
```

## Implementation Priority

### Phase 1 (Quick Wins - Do First):
1. ✅ Add loading states (DONE)
2. 🔄 Add stale-time caching to React Query hooks
3. 🔄 Optimize images (Next.js Image + lazy loading)
4. 🔄 Review database queries in Supabase

### Phase 2 (Medium Term):
5. 🔄 Implement pagination
6. 🔄 Monitor bundle size
7. 🔄 Cache manga lists in localStorage

### Phase 3 (Long Term):
8. 🔄 Service Worker for offline support
9. 🔄 Static generation for popular manga
10. 🔄 CDN optimization

## Files to Modify

```
Priority | File | Change
---------|------|--------
HIGH | src/hooks/useManga.ts | Add staleTime: 5 * 60 * 1000 (5 min cache)
HIGH | src/hooks/useChapter.ts | Add staleTime caching
HIGH | src/components/MangaCard.tsx | Image optimization
HIGH | supabase/functions/*/index.ts | Review SQL queries
MEDIUM | src/views/Index.tsx | Add pagination
MEDIUM | src/views/TagPage.tsx | Add pagination
```

## Database Query Best Practices

### Current (Potentially Slow):
```sql
SELECT * FROM manga;
```

### Optimized:
```sql
SELECT id, title, author, image_url, description, created_at 
FROM manga 
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

### With Indexes:
```sql
CREATE INDEX idx_manga_status_created ON manga(status, created_at DESC);
CREATE INDEX idx_manga_title ON manga(title);
```

## Next Steps

1. **Review current Supabase RPC functions** and query efficiency
2. **Add caching** to React Query hooks (5-10 min stale time)
3. **Optimize images** in MangaCard and detail pages
4. **Test performance** using Lighthouse
5. **Monitor API response times** in Network tab
6. **Profile memory usage** if pages feel slow

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [React Query Caching](https://tanstack.com/query/latest/docs/react/caching)
- [Web Vitals](https://web.dev/vitals/)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance-tuning)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
