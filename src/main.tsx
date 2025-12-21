import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import MangaDetail from '@/pages/MangaDetail';
import ChapterReader from '@/pages/ChapterReader';
import TagPage from '@/pages/TagPage';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AddManga from '@/pages/admin/AddManga';
import EditManga from '@/pages/admin/EditManga';
import AddChapter from '@/pages/admin/AddChapter';
import EditChapter from '@/pages/admin/EditChapter';
import ViewChapter from '@/pages/admin/ViewChapter';
import ManageTags from '@/pages/admin/ManageTags';
import MangaDetailAdmin from '@/pages/admin/MangaDetail';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/truyen/:slug" element={<MangaDetail />} />
                <Route path="/truyen/:slug/chuong/:chapterId" element={<ChapterReader />} />
                <Route path="/the-loai/:tagName" element={<TagPage />} />
                <Route path="/dang-nhap" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/post-truyen" element={<AddManga />} />
                <Route path="/admin/edit-manga/:mangaId" element={<EditManga />} />
                <Route path="/admin/manga-detail/:mangaId" element={<MangaDetailAdmin />} />
                <Route path="/admin/add-chapter/:mangaId" element={<AddChapter />} />
                <Route path="/admin/edit-chapter/:chapterId" element={<EditChapter />} />
                <Route path="/admin/view-chapter/:chapterId" element={<ViewChapter />} />
                <Route path="/admin/tags" element={<ManageTags />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
