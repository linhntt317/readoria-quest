# Next.js Migration Guide

## Tình trạng hiện tại

Project đang trong quá trình migration từ Vite + React Router sang Next.js App Router.

### Cấu trúc hiện tại:
- ✅ `app/layout.tsx` - Root layout với providers
- ✅ `app/providers.tsx` - Client providers wrapper
- ✅ `app/page.tsx` - Home page
- ✅ `next.config.cjs` - Next.js configuration
- ✅ Package.json đã cập nhật scripts

### Để tiếp tục migration:

1. **Chạy script tạo cấu trúc thư mục Next.js:**
   ```bash
   npm run setup:nextjs
   # hoặc
   node scripts/create-nextjs-dirs.mjs
   ```

2. **Cấu trúc thư mục sẽ được tạo:**
   ```
   app/
   ├── truyen/
   │   └── [mangaId]/
   │       ├── page.tsx
   │       └── chuong/
   │           └── [chapterId]/
   │               └── page.tsx
   ├── the-loai/
   │   └── [tagName]/
   │       └── page.tsx
   └── admin/
       ├── dashboard/page.tsx
       ├── login/page.tsx
       ├── post-truyen/page.tsx
       ├── add-chapter/[mangaId]/page.tsx
       ├── manga-detail/[mangaId]/page.tsx
       ├── edit-manga/[mangaId]/page.tsx
       ├── edit-chapter/[chapterId]/page.tsx
       ├── view-chapter/[chapterId]/page.tsx
       └── tags/page.tsx
   ```

3. **Migrate các pages:**
   - Copy nội dung từ `src/pages/*.tsx` sang các `app/**/page.tsx` tương ứng
   - Thêm `"use client"` directive ở đầu các pages cần client-side rendering
   - Sử dụng `params` và `searchParams` props thay vì `useParams` và `useSearchParams`

4. **Chạy development server:**
   ```bash
   npm run dev          # Next.js (mặc định)
   npm run vite:dev     # Vite (legacy)
   ```

5. **Build production:**
   ```bash
   npm run build        # Next.js build
   npm run build:vite   # Vite build (legacy)
   ```

## Lợi ích của Next.js

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ API routes
- ✅ Better SEO
- ✅ Image optimization
- ✅ Built-in routing
- ✅ Metadata API

## Các bước tiếp theo

1. Tạo các page components trong app router
2. Migrate API endpoints từ Supabase client sang app/api routes
3. Optimize images với next/image
4. Add metadata cho SEO
5. Remove Vite dependencies khi migration hoàn thành
