# Vite vs Next.js Comparison

## Routing Comparison

### Vite (React Router)
```typescript
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/truyen/:mangaId" element={<MangaDetail />} />
    <Route path="/truyen/:mangaId/chuong/:chapterId" element={<ChapterReader />} />
  </Routes>
</BrowserRouter>
```

### Next.js (App Router)
```
app/
├── page.tsx                              → /
├── truyen/[mangaId]/page.tsx            → /truyen/:mangaId
└── truyen/[mangaId]/chuong/[chapterId]/page.tsx → /truyen/:mangaId/chuong/:chapterId
```

## Data Fetching

### Vite
```typescript
// Client-side only
import { useQuery } from '@tanstack/react-query';

function MangaDetail() {
  const { data } = useQuery({
    queryKey: ['manga', mangaId],
    queryFn: () => fetchManga(mangaId)
  });
}
```

### Next.js
```typescript
// Can be server-side
async function MangaDetail({ params }: { params: { mangaId: string } }) {
  const manga = await fetchManga(params.mangaId);
  return <div>{manga.title}</div>;
}

// Or client-side with "use client"
"use client";
function MangaDetail({ params }: { params: { mangaId: string } }) {
  const { data } = useQuery({
    queryKey: ['manga', params.mangaId],
    queryFn: () => fetchManga(params.mangaId)
  });
}
```

## Parameters

### Vite
```typescript
import { useParams, useSearchParams } from 'react-router-dom';

function Component() {
  const { mangaId } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
}
```

### Next.js
```typescript
// URL params as props
function Page({ params, searchParams }: {
  params: { mangaId: string };
  searchParams: { page?: string };
}) {
  // Use params.mangaId and searchParams.page directly
}

// Or use hooks in client components
"use client";
import { useParams, useSearchParams } from 'next/navigation';

function Component() {
  const params = useParams();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
}
```

## Navigation

### Vite
```typescript
import { useNavigate, Link } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  return (
    <>
      <Link to="/truyen/123">Go to manga</Link>
      <button onClick={() => navigate('/truyen/123')}>Navigate</button>
    </>
  );
}
```

### Next.js
```typescript
"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Component() {
  const router = useRouter();
  
  return (
    <>
      <Link href="/truyen/123">Go to manga</Link>
      <button onClick={() => router.push('/truyen/123')}>Navigate</button>
    </>
  );
}
```

## Environment Variables

### Vite
```typescript
// .env
VITE_API_URL=https://api.example.com

// Access in code
const url = import.meta.env.VITE_API_URL;
```

### Next.js
```typescript
// .env
NEXT_PUBLIC_API_URL=https://api.example.com  // Client-side
API_SECRET=secret-key                         // Server-side only

// Access in code
const url = process.env.NEXT_PUBLIC_API_URL;  // Client
const secret = process.env.API_SECRET;        // Server only
```

## Metadata/SEO

### Vite
```typescript
// Manual updates
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <>
      <Helmet>
        <title>Page Title</title>
        <meta name="description" content="Page description" />
      </Helmet>
      <div>Content</div>
    </>
  );
}
```

### Next.js
```typescript
// Built-in metadata API
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return <div>Content</div>;
}
```

## Image Optimization

### Vite
```typescript
// No built-in optimization
<img src="/images/manga.jpg" alt="Manga" />
```

### Next.js
```typescript
import Image from 'next/image';

<Image 
  src="/images/manga.jpg" 
  alt="Manga"
  width={500}
  height={300}
  priority
/>
```

## API Routes

### Vite
```
Not built-in - need separate backend or serverless functions
```

### Next.js
```typescript
// app/api/manga/route.ts
export async function GET(request: Request) {
  const data = await fetchManga();
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Handle POST
}
```

## Middleware

### Vite
```
Not built-in - implement in routes or use libraries
```

### Next.js
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## Performance

| Feature | Vite | Next.js |
|---------|------|---------|
| Initial Load | Fast (SPA) | Very Fast (SSR/SSG) |
| Navigation | Instant (client-side) | Instant (client-side) |
| SEO | Poor (CSR) | Excellent (SSR/SSG) |
| Build Time | Fast | Moderate |
| Bundle Size | Small | Larger (includes server code) |
| Hot Reload | Very Fast | Fast |

## When to Use

### Use Vite when:
- Building a SPA/dashboard
- Don't need SEO
- Want simplest setup
- Target authenticated users only
- Need fastest dev experience

### Use Next.js when:
- Need good SEO
- Want server-side rendering
- Building public-facing site
- Need API routes
- Want image optimization
- Need advanced routing features

## Migration Path

1. ✅ Keep existing Vite app working
2. ✅ Setup Next.js App Router alongside
3. ✅ Create page wrappers in `app/`
4. ✅ Migrate pages one by one
5. ⏳ Update components to use Next.js features
6. ⏳ Move API logic to Next.js API routes
7. ⏳ Test everything thoroughly
8. ⏳ Remove Vite dependencies
9. ⏳ Update deployment config

## Current Status

✅ Next.js structure created
✅ Providers setup
✅ Layout configured
✅ Middleware implemented
⏳ Pages being migrated
⏳ API routes to be added
⏳ Full SSR implementation pending
