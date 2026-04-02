"use client";

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from '@/components/ui/sonner';
import { PageTransition } from '@/components/PageTransition';
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

const ProtectedRoute = React.lazy(() =>
  import('@/components/admin/ProtectedRoute').then(m => ({ default: m.ProtectedRoute }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
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

// Helper to extract UUID from a slug
function extractId(slug: string): string {
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  return uuidMatch ? uuidMatch[0] : slug;
}

// Route wrapper components using useParams
function MangaDetailRoute() {
  const { slug = '' } = useParams();
  return <MangaDetail mangaId={extractId(slug) || undefined} />;
}

function ChapterReaderRoute() {
  const { slug = '', chapterId = '' } = useParams();
  return <ChapterReader mangaId={extractId(slug) || undefined} chapterId={chapterId || undefined} />;
}

function TagPageRoute() {
  const { tagName = '' } = useParams();
  return <TagPage tagName={decodeURIComponent(tagName)} />;
}

function AdminAddChapterRoute() {
  const { mangaId = '' } = useParams();
  return <ProtectedRoute><AddChapter mangaId={mangaId} /></ProtectedRoute>;
}

function AdminEditMangaRoute() {
  const { mangaId = '' } = useParams();
  return <ProtectedRoute><EditManga mangaId={mangaId} /></ProtectedRoute>;
}

function AdminEditChapterRoute() {
  const { chapterId = '' } = useParams();
  return <ProtectedRoute><EditChapter chapterId={chapterId} /></ProtectedRoute>;
}

function AdminViewChapterRoute() {
  const { chapterId = '' } = useParams();
  return <ProtectedRoute><ViewChapter chapterId={chapterId} /></ProtectedRoute>;
}

function AdminMangaDetailRoute() {
  const { mangaId = '' } = useParams();
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
                  <PageTransition>
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
                  </PageTransition>
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
