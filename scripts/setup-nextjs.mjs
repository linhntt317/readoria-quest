#!/usr/bin/env node

console.log("🚀 Setting up Next.js structure for Readoria Quest...\n");

import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Page templates
const pages = [
  {
    path: "app/truyen/[mangaId]/page.tsx",
    content: `"use client";
import React from 'react';
import MangaDetail from '@/pages/MangaDetail';

export default function MangaPage({ params }: { params: { mangaId: string } }) {
  return <MangaDetail />;
}
`,
  },
  {
    path: "app/truyen/[mangaId]/chuong/[chapterId]/page.tsx",
    content: `"use client";
import React from 'react';
import ChapterReader from '@/pages/ChapterReader';

export default function ChapterPage({ 
  params 
}: { 
  params: { mangaId: string; chapterId: string } 
}) {
  return <ChapterReader />;
}
`,
  },
  {
    path: "app/the-loai/[tagName]/page.tsx",
    content: `"use client";
import React from 'react';
import TagPage from '@/pages/TagPage';

export default function TagPageWrapper({ params }: { params: { tagName: string } }) {
  return <TagPage />;
}
`,
  },
  {
    path: "app/admin/login/page.tsx",
    content: `"use client";
import React from 'react';
import AdminLogin from '@/pages/admin/AdminLogin';

export default function AdminLoginPage() {
  return <AdminLogin />;
}
`,
  },
  {
    path: "app/admin/dashboard/page.tsx",
    content: `"use client";
import React from 'react';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/post-truyen/page.tsx",
    content: `"use client";
import React from 'react';
import PostTruyen from '@/pages/admin/PostTruyen';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function PostTruyenPage() {
  return (
    <ProtectedRoute>
      <PostTruyen />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/add-chapter/[mangaId]/page.tsx",
    content: `"use client";
import React from 'react';
import AddChapter from '@/pages/admin/AddChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AddChapterPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <AddChapter />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/manga-detail/[mangaId]/page.tsx",
    content: `"use client";
import React from 'react';
import AdminMangaDetail from '@/pages/admin/MangaDetail';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function AdminMangaDetailPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <AdminMangaDetail />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/edit-manga/[mangaId]/page.tsx",
    content: `"use client";
import React from 'react';
import EditManga from '@/pages/admin/EditManga';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function EditMangaPage({ params }: { params: { mangaId: string } }) {
  return (
    <ProtectedRoute>
      <EditManga />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/edit-chapter/[chapterId]/page.tsx",
    content: `"use client";
import React from 'react';
import EditChapter from '@/pages/admin/EditChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function EditChapterPage({ params }: { params: { chapterId: string } }) {
  return (
    <ProtectedRoute>
      <EditChapter />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/view-chapter/[chapterId]/page.tsx",
    content: `"use client";
import React from 'react';
import ViewChapter from '@/pages/admin/ViewChapter';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function ViewChapterPage({ params }: { params: { chapterId: string } }) {
  return (
    <ProtectedRoute>
      <ViewChapter />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/admin/tags/page.tsx",
    content: `"use client";
import React from 'react';
import ManageTags from '@/pages/admin/ManageTags';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export default function ManageTagsPage() {
  return (
    <ProtectedRoute>
      <ManageTags />
    </ProtectedRoute>
  );
}
`,
  },
  {
    path: "app/not-found.tsx",
    content: `"use client";
import React from 'react';
import NotFound from '@/pages/NotFound';

export default function NotFoundPage() {
  return <NotFound />;
}
`,
  },
];

async function createPages() {
  let created = 0;
  let skipped = 0;

  for (const page of pages) {
    const fullPath = join(__dirname, "..", page.path);
    const dirPath = dirname(fullPath);

    try {
      // Create directory if it doesn't exist
      await mkdir(dirPath, { recursive: true });

      // Write file
      await writeFile(fullPath, page.content, "utf8");
      console.log(`✅ Created: ${page.path}`);
      created++;
    } catch (error) {
      console.log(`⚠️  Skipped: ${page.path} (already exists or error)`);
      skipped++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Setup complete!`);
  console.log(`   Created: ${created} files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log("=".repeat(60));
  console.log("\n📝 Next steps:");
  console.log("   1. Run: npm run dev");
  console.log("   2. Visit: http://localhost:3000");
  console.log("   3. Check: MIGRATION_CHECKLIST.md for progress");
  console.log("\n📚 Documentation:");
  console.log("   - README.md - Project overview");
  console.log("   - SETUP.md - Quick setup guide");
  console.log("   - NEXTJS_MIGRATION.md - Migration details");
  console.log("   - VITE_VS_NEXTJS.md - Comparison guide");
  console.log("   - MIGRATION_CHECKLIST.md - Progress tracker");
  console.log("\n🎉 Happy coding!\n");
}

createPages().catch((error) => {
  console.error("\n❌ Error during setup:", error);
  process.exit(1);
});
