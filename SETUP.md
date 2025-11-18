# Quick Setup Guide

## 🚀 Để chạy Next.js project, làm theo các bước sau:

### Bước 1: Tạo cấu trúc Next.js

```bash
npm run setup:nextjs
```

Script này sẽ tự động tạo:
- Tất cả các thư mục cần thiết trong `app/`
- Tất cả các page files với routing đúng
- Các protected routes cho admin

### Bước 2: Cấu hình environment

```bash
# Copy file .env.example
cp .env.example .env

# Sau đó chỉnh sửa .env với thông tin Supabase của bạn
```

### Bước 3: Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:3000

## 📁 Cấu trúc sau khi setup

```
app/
├── layout.tsx                          # Root layout với providers
├── page.tsx                           # Trang chủ
├── providers.tsx                      # Client-side providers
├── not-found.tsx                      # 404 page
│
├── truyen/
│   └── [mangaId]/
│       ├── page.tsx                   # Chi tiết truyện
│       └── chuong/
│           └── [chapterId]/
│               └── page.tsx           # Đọc chapter
│
├── the-loai/
│   └── [tagName]/
│       └── page.tsx                   # Trang thể loại
│
├── admin/
│   ├── login/page.tsx                 # Admin login
│   ├── dashboard/page.tsx             # Admin dashboard
│   ├── post-truyen/page.tsx           # Đăng truyện mới
│   ├── tags/page.tsx                  # Quản lý tags
│   ├── add-chapter/[mangaId]/page.tsx
│   ├── manga-detail/[mangaId]/page.tsx
│   ├── edit-manga/[mangaId]/page.tsx
│   ├── edit-chapter/[chapterId]/page.tsx
│   └── view-chapter/[chapterId]/page.tsx
│
└── api/
    ├── sitemap/route.ts               # Sitemap API
    └── (thêm các API routes khác ở đây)
```

## 🔧 Scripts có sẵn

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy Next.js dev server (port 3000) |
| `npm run vite:dev` | Chạy Vite dev server (legacy, port 8080) |
| `npm run build` | Build Next.js production |
| `npm run start` | Start Next.js production server |
| `npm run setup:nextjs` | Tạo cấu trúc Next.js |
| `npm run lint` | Chạy ESLint |

## ⚙️ Cấu hình đã có

✅ Next.js App Router
✅ TypeScript
✅ Tailwind CSS
✅ Supabase integration
✅ React Query
✅ Authentication middleware
✅ SEO metadata
✅ Vercel Analytics & Speed Insights
✅ Dark/Light theme
✅ Multi-language (vi/en)

## 🔐 Authentication Flow

1. User vào `/admin/login`
2. Login với Supabase auth
3. Token được lưu trong cookies
4. Middleware check token cho các admin routes
5. ProtectedRoute component bảo vệ admin pages

## 📝 Notes

- Tất cả các pages đều là client components (`"use client"`)
- Routes được protect bằng middleware và ProtectedRoute component
- Sitemap tự động generate từ database qua `/api/sitemap`
- Images được optimize bằng next/image
- Metadata được set cho SEO

## 🐛 Troubleshooting

### Lỗi: "Cannot find module '@/pages/...'"

Chạy lại setup script:
```bash
npm run setup:nextjs
```

### Lỗi: "ENOENT: no such file or directory"

Đảm bảo bạn đang ở thư mục root của project:
```bash
cd d:\WEB\readoria-quest
npm run setup:nextjs
```

### Lỗi Supabase connection

Kiểm tra file .env có đúng credentials không:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-key-here
```

## 📚 Next Steps

Sau khi setup xong:

1. ✅ Test tất cả các routes
2. ✅ Kiểm tra authentication flow
3. ✅ Test responsive design
4. ✅ Deploy lên Vercel
5. ⚠️ Xóa Vite config khi migration hoàn tất

## 🚀 Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc push lên GitHub và import vào Vercel dashboard
```

Đừng quên set environment variables trong Vercel dashboard!
