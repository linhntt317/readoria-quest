# Truyện Nhà Mèo - Readoria Quest

A modern manga reading platform built with Next.js and React.

## Project Status

🚧 **Currently migrating from Vite + React Router to Next.js App Router**

See [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md) for migration progress and details.

## Technologies

This project uses:

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend and database
- **React Query** - Data fetching and caching
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd readoria-quest

# Install dependencies
npm install
# or
yarn install

# Copy environment variables
cp .env.example .env

# Configure your .env file with Supabase credentials
```

### Development

```bash
# Run Next.js development server (recommended)
npm run dev

# Or run legacy Vite server
npm run vite:dev

# Open http://localhost:3000 (Next.js) or http://localhost:8080 (Vite)
```

### Setup Next.js Structure

```bash
# Create Next.js App Router structure
npm run setup:nextjs
```

This will create all necessary directories and page files for the Next.js App Router.

### Build

```bash
# Build for production (Next.js)
npm run build

# Start production server
npm run start

# Or build with Vite (legacy)
npm run build:vite
```

## Project Structure

```
readoria-quest/
├── app/                    # Next.js App Router (new)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Client-side providers
│   ├── api/               # API routes
│   ├── truyen/            # Manga pages
│   ├── admin/             # Admin pages
│   └── the-loai/          # Tag/category pages
├── src/                   # Legacy Vite app
│   ├── pages/            # React Router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilities
├── public/               # Static assets
├── scripts/              # Build and utility scripts
└── supabase/             # Supabase configuration
```

## Features

- 📖 Read manga online
- 🔍 Search and filter manga
- 🏷️ Browse by categories/tags
- 👤 User authentication
- 🔐 Admin dashboard
- 📱 Responsive design
- 🌙 Dark/Light mode
- 🌐 Multi-language support (Vietnamese/English)
- ⚡ Server-side rendering (SSR)
- 🔍 SEO optimized
- 📊 Analytics integration

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key
- `SUPABASE_SERVICE_ROLE` - Supabase service role key (server-side only)
- `SITE_ORIGIN` - Your site URL for sitemap generation

## Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production (Next.js)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup:nextjs` - Create Next.js structure
- `npm run generate:sitemap` - Generate sitemap
- `npm run vite:dev` - Start Vite dev server (legacy)
- `npm run build:vite` - Build with Vite (legacy)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

Or use the Vercel CLI:

```bash
vercel
```

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

This is a private project. For authorized contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved

## Project Links

- **Lovable Project**: https://lovable.dev/projects/c59127a0-b0ea-4aef-85f5-e73a1a486be6
- **Documentation**: See [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md) for migration guide
