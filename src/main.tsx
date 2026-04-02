"use client";

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

// Lazy-loaded route components
const Index = React.lazy(() => import('@/views/Index'));
const MangaDetail = React.lazy(() => import('@/views/MangaDetail'));
const ChapterReader = React.lazy(() => import('@/views/ChapterReader'));
const TagPage = React.lazy(() => import('@/views/TagPage'));
const NotFound = React.lazy(() => import('@/views/NotFound'));
const AdminLogin = React.lazy(() => import('@/views/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('@/views/admin/AdminDashboard'));
const PostTruyen = React.lazy(() => import('@/views/admin/PostTruyen'));
const ManageTags = React.lazy(() => import('@/views/admin/ManageTags'));
const AddChapter = React.lazy(() => import('@/views/admin/AddChapter'));
const EditManga = React.lazy(() => import('@/views/admin/EditManga'));
const EditChapter = React.lazy(() => import('@/views/admin/EditChapter'));
const ViewChapter = React.lazy(() => import('@/views/admin/ViewChapter'));
const MangaDetailAdmin = React.lazy(() => import('@/views/admin/MangaDetail'));

// Lazy-loaded ProtectedRoute
const ProtectedRoute = React.lazy(() =>
  import('@/components/admin/ProtectedRoute').then(m => ({ default: m.ProtectedRoute }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}

// Wrapper components to extract route params
function MangaDetailRoute() {
  const params = React.useMemo(() => {
    const path = window.location.pathname;
    const slug = path.split('/truyen/')[1]?.split('/')[0] || '';
    // Extract UUID or numeric ID from slug
    const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    return uuidMatch ? uuidMatch[0] : slug;
  }, []);
  return <MangaDetail mangaId={params || undefined} />;
}

function ChapterReaderRoute() {
  const path = window.location.pathname;
  const parts = path.split('/');
  // /truyen/:slug/chuong/:chapterId
  const slugIdx = parts.indexOf('truyen') + 1;
  const chapterIdx = parts.indexOf('chuong') + 1;
  const slug = parts[slugIdx] || '';
  const chapterId = parts[chapterIdx] || '';
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  const mangaId = uuidMatch ? uuidMatch[0] : slug;
  return <ChapterReader mangaId={mangaId || undefined} chapterId={chapterId || undefined} />;
}

function TagPageRoute() {
  const path = window.location.pathname;
  const tagName = path.split('/the-loai/')[1]?.split('/')[0] || '';
  return <TagPage tagName={decodeURIComponent(tagName)} />;
}

function AdminAddChapterRoute() {
  const mangaId = window.location.pathname.split('/admin/add-chapter/')[1]?.split('/')[0] || '';
  return <ProtectedRoute><AddChapter mangaId={mangaId} /></ProtectedRoute>;
}

function AdminEditMangaRoute() {
  const mangaId = window.location.pathname.split('/admin/edit-manga/')[1]?.split('/')[0] || '';
  return <ProtectedRoute><EditManga mangaId={mangaId} /></ProtectedRoute>;
}

function AdminEditChapterRoute() {
  const chapterId = window.location.pathname.split('/admin/edit-chapter/')[1]?.split('/')[0] || '';
  return <ProtectedRoute><EditChapter chapterId={chapterId} /></ProtectedRoute>;
}

function AdminViewChapterRoute() {
  const chapterId = window.location.pathname.split('/admin/view-chapter/')[1]?.split('/')[0] || '';
  return <ProtectedRoute><ViewChapter chapterId={chapterId} /></ProtectedRoute>;
}

function AdminMangaDetailRoute() {
  const mangaId = window.location.pathname.split('/admin/manga-detail/')[1]?.split('/')[0] || '';
  return <ProtectedRoute><MangaDetailAdmin mangaId={mangaId} /></ProtectedRoute>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <LoadingProvider>
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/truyen/:slug" element={<MangaDetailRoute />} />
                    <Route path="/truyen/:slug/chuong/:chapterId" element={<ChapterReaderRoute />} />
                    <Route path="/the-loai/:tagName" element={<TagPageRoute />} />
                    
                    {/* Auth */}
                    <Route path="/dang-nhap" element={<AdminLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/post-truyen" element={<ProtectedRoute><PostTruyen /></ProtectedRoute>} />
                    <Route path="/admin/tags" element={<ProtectedRoute><ManageTags /></ProtectedRoute>} />
                    <Route path="/admin/add-chapter/:mangaId" element={<AdminAddChapterRoute />} />
                    <Route path="/admin/edit-manga/:mangaId" element={<AdminEditMangaRoute />} />
                    <Route path="/admin/edit-chapter/:chapterId" element={<AdminEditChapterRoute />} />
                    <Route path="/admin/view-chapter/:chapterId" element={<AdminViewChapterRoute />} />
                    <Route path="/admin/manga-detail/:mangaId" element={<AdminMangaDetailRoute />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
              <Toaster />
            </LoadingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
