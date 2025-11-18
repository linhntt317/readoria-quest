# Next.js Migration Checklist

## Phase 1: Setup & Configuration ✅

- [x] Install Next.js dependencies
- [x] Create next.config.cjs
- [x] Update package.json scripts
- [x] Create app/ directory structure
- [x] Setup tsconfig.json for Next.js
- [x] Create .env.example
- [x] Document migration process

## Phase 2: Core Structure ✅

- [x] Create app/layout.tsx with metadata
- [x] Create app/providers.tsx for client-side providers
- [x] Create app/page.tsx (home page)
- [x] Create app/not-found.tsx
- [x] Setup middleware.ts for auth
- [x] Configure image optimization
- [x] Setup sitemap API route

## Phase 3: Route Structure ⏳

- [x] Create directory structure script
- [x] Create page generation script
- [ ] Run setup script to create all directories
- [ ] Verify all routes are created

### Public Routes
- [x] `/` - Home page template
- [x] `/truyen/[mangaId]` - Manga detail template
- [x] `/truyen/[mangaId]/chuong/[chapterId]` - Chapter reader template
- [x] `/the-loai/[tagName]` - Tag page template

### Admin Routes (Protected)
- [x] `/admin/login` - Login page template
- [x] `/admin/dashboard` - Dashboard template
- [x] `/admin/post-truyen` - Post manga template
- [x] `/admin/add-chapter/[mangaId]` - Add chapter template
- [x] `/admin/manga-detail/[mangaId]` - Manga detail template
- [x] `/admin/edit-manga/[mangaId]` - Edit manga template
- [x] `/admin/edit-chapter/[chapterId]` - Edit chapter template
- [x] `/admin/view-chapter/[chapterId]` - View chapter template
- [x] `/admin/tags` - Manage tags template

## Phase 4: Components Migration ⏳

### Core Components
- [ ] Update navigation components for Next.js Link
- [ ] Update image components for next/image
- [ ] Update metadata components
- [ ] Test all shadcn/ui components
- [ ] Verify theme switcher works
- [ ] Verify language switcher works

### Page Components
- [ ] Index/Home page
- [ ] MangaDetail page
- [ ] ChapterReader page
- [ ] TagPage
- [ ] NotFound page

### Admin Components
- [ ] AdminLogin
- [ ] AdminDashboard
- [ ] PostTruyen
- [ ] AddChapter
- [ ] EditManga
- [ ] EditChapter
- [ ] ViewChapter
- [ ] ManageTags
- [ ] ProtectedRoute wrapper

## Phase 5: Data Fetching ⏳

### Client-Side (React Query)
- [ ] Keep existing React Query setup
- [ ] Verify queries work with Next.js
- [ ] Test mutations
- [ ] Test cache invalidation

### Server-Side (Future)
- [ ] Identify pages that can use SSR
- [ ] Migrate to server components where beneficial
- [ ] Setup server-side data fetching
- [ ] Implement ISR for manga pages

## Phase 6: API Routes ⏳

- [x] `/api/sitemap` - Sitemap generation
- [ ] `/api/manga` - Manga CRUD operations
- [ ] `/api/chapters` - Chapter operations
- [ ] `/api/tags` - Tag management
- [ ] `/api/search` - Search functionality
- [ ] `/api/upload` - Image upload
- [ ] `/api/auth` - Auth helpers (if needed)

## Phase 7: SEO & Metadata ⏳

- [x] Root metadata in layout.tsx
- [ ] Dynamic metadata for manga pages
- [ ] Dynamic metadata for chapter pages
- [ ] Dynamic metadata for tag pages
- [ ] OpenGraph images
- [ ] Robots.txt
- [ ] Sitemap.xml integration
- [ ] Structured data (JSON-LD)

## Phase 8: Performance Optimization ⏳

### Images
- [ ] Convert <img> to next/image
- [ ] Setup remote image patterns
- [ ] Implement blur placeholders
- [ ] Optimize image sizes

### Code Splitting
- [ ] Lazy load heavy components
- [ ] Dynamic imports for admin pages
- [ ] Optimize bundle size

### Caching
- [ ] Setup Next.js caching strategies
- [ ] Configure revalidation periods
- [ ] Implement incremental static regeneration

## Phase 9: Testing ⏳

### Functionality
- [ ] Test all public routes
- [ ] Test all admin routes
- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Test API endpoints
- [ ] Test search functionality
- [ ] Test image upload
- [ ] Test responsive design

### Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test load times
- [ ] Check bundle size
- [ ] Verify SEO scores

### Cross-browser
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile browsers

## Phase 10: Deployment ⏳

- [ ] Configure Vercel project
- [ ] Set environment variables
- [ ] Setup domain (if needed)
- [ ] Configure redirects
- [ ] Setup analytics
- [ ] Setup error monitoring
- [ ] Test production build
- [ ] Deploy to production

## Phase 11: Cleanup ⏳

- [ ] Remove Vite config files
- [ ] Remove React Router dependencies
- [ ] Remove unused dependencies
- [ ] Update documentation
- [ ] Remove legacy code comments
- [ ] Archive src/ directory (optional)

## Phase 12: Post-Migration ⏳

- [ ] Monitor performance metrics
- [ ] Check error logs
- [ ] Gather user feedback
- [ ] Fix any issues
- [ ] Optimize based on real data
- [ ] Update team documentation

## Current Priority

**NEXT STEPS:**
1. Run `npm run setup:nextjs` to create all directories and pages
2. Test that all routes are accessible
3. Verify authentication flow works
4. Start migrating individual page logic
5. Test each page thoroughly before moving to next

## Notes

- Keep Vite app running during migration for comparison
- Test each phase thoroughly before moving to next
- Document any issues or blockers
- Update this checklist as you progress
- Don't forget to update .gitignore if needed

## Questions/Blockers

- [ ] Do we need SSR for all pages or just some?
- [ ] Which pages should use ISR?
- [ ] Timeline for complete migration?
- [ ] Backward compatibility requirements?

---

**Last Updated:** 2025-11-17

**Migration Status:** 🟡 In Progress (Phase 3)

**Estimated Completion:** TBD
