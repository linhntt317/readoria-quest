# Quick Reference - Next.js Commands

## 🚀 Start Here

```bash
# 1. Setup Next.js structure
npm run setup:nextjs

# 2. Start development
npm run dev

# 3. Open browser
http://localhost:3000
```

## 📝 Common Commands

### Development
```bash
npm run dev              # Next.js dev (port 3000)
npm run vite:dev         # Vite dev (port 8080) - legacy
```

### Build
```bash
npm run build            # Next.js production build
npm run start            # Start Next.js production server
npm run build:vite       # Vite build - legacy
```

### Setup
```bash
npm run setup:nextjs     # Create all Next.js files
npm install              # Install dependencies
```

### Utilities
```bash
npm run lint             # Run ESLint
npm run generate:sitemap # Generate sitemap
```

## 🗂️ File Structure Quick Reference

```
app/
├── layout.tsx              → Root layout
├── page.tsx               → Home (/)
├── providers.tsx          → Client providers
├── not-found.tsx          → 404 page
│
├── truyen/
│   └── [mangaId]/
│       ├── page.tsx       → /truyen/:id
│       └── chuong/
│           └── [chapterId]/
│               └── page.tsx → /truyen/:id/chuong/:id
│
├── the-loai/
│   └── [tagName]/
│       └── page.tsx       → /the-loai/:name
│
├── admin/
│   ├── login/             → /admin/login
│   ├── dashboard/         → /admin/dashboard
│   ├── post-truyen/       → /admin/post-truyen
│   └── ...                → Other admin routes
│
└── api/
    └── sitemap/
        └── route.ts       → /api/sitemap
```

## 🔑 Environment Variables

```bash
# Required in .env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE=...
SITE_ORIGIN=...
```

## 🎯 Page Template

```typescript
"use client";
import React from 'react';
import ComponentName from '@/pages/ComponentName';

export default function PageName({ params }: { params: { id: string } }) {
  return <ComponentName />;
}
```

## 🔐 Protected Route Template

```typescript
"use client";
import React from 'react';
import Component from '@/pages/admin/Component';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}
```

## 📚 Documentation Quick Links

- `README.md` - Project overview
- `SETUP.md` - Setup guide
- `SUMMARY.md` - What's been done
- `MIGRATION_CHECKLIST.md` - Todo list
- `NEXTJS_MIGRATION.md` - Migration details
- `VITE_VS_NEXTJS.md` - Comparison guide

## 🐛 Troubleshooting

### Can't find module '@/pages/...'
```bash
npm run setup:nextjs
```

### Port already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Supabase error
Check `.env` file has correct values

### Build error
```bash
rm -rf .next
npm run build
```

## 🚀 Deploy to Vercel

```bash
# Option 1: CLI
npm i -g vercel
vercel

# Option 2: GitHub
# Push to GitHub → Import in Vercel dashboard
```

## 🔗 URLs

- Dev (Next.js): http://localhost:3000
- Dev (Vite): http://localhost:8080
- Production: https://your-domain.vercel.app

## 💡 Pro Tips

1. Always run `npm run setup:nextjs` first
2. Keep Vite app for reference during migration
3. Test each route after setup
4. Use TypeScript for type safety
5. Check console for errors
6. Read documentation files

---

Need help? Check `SETUP.md` troubleshooting section.
