import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/views/Index';
import MangaDetail from '@/views/MangaDetail';
import ChapterReader from '@/views/ChapterReader';
import TagPage from '@/views/TagPage';
import NotFound from '@/views/NotFound';
import AdminLogin from '@/views/admin/AdminLogin';
import AdminDashboard from '@/views/admin/AdminDashboard';
import AddManga from '@/views/admin/AddManga';
import EditManga from '@/views/admin/EditManga';
import AddChapter from '@/views/admin/AddChapter';
import EditChapter from '@/views/admin/EditChapter';
import ViewChapter from '@/views/admin/ViewChapter';
import ManageTags from '@/views/admin/ManageTags';
import MangaDetailAdmin from '@/views/admin/MangaDetail';
import './index.css';

// Wrapper components for routes requiring URL params
const EditMangaWrapper = () => {
  const { mangaId } = useParams<{ mangaId: string }>();
  return <EditManga mangaId={mangaId!} />;
};

const MangaDetailAdminWrapper = () => {
  const { mangaId } = useParams<{ mangaId: string }>();
  return <MangaDetailAdmin mangaId={mangaId!} />;
};

const AddChapterWrapper = () => {
  const { mangaId } = useParams<{ mangaId: string }>();
  return <AddChapter mangaId={mangaId!} />;
};

const EditChapterWrapper = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  return <EditChapter chapterId={chapterId!} />;
};

const ViewChapterWrapper = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  return <ViewChapter chapterId={chapterId!} />;
};

const MangaDetailWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  return <MangaDetail mangaId={slug} />;
};

const ChapterReaderWrapper = () => {
  const { slug, chapterId } = useParams<{ slug: string; chapterId: string }>();
  return <ChapterReader mangaId={slug} chapterId={chapterId} />;
};

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
                <Route path="/truyen/:slug" element={<MangaDetailWrapper />} />
                <Route path="/truyen/:slug/chuong/:chapterId" element={<ChapterReaderWrapper />} />
                <Route path="/the-loai/:tagName" element={<TagPage />} />
                <Route path="/dang-nhap" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/post-truyen" element={<AddManga />} />
                <Route path="/admin/edit-manga/:mangaId" element={<EditMangaWrapper />} />
                <Route path="/admin/manga-detail/:mangaId" element={<MangaDetailAdminWrapper />} />
                <Route path="/admin/add-chapter/:mangaId" element={<AddChapterWrapper />} />
                <Route path="/admin/edit-chapter/:chapterId" element={<EditChapterWrapper />} />
                <Route path="/admin/view-chapter/:chapterId" element={<ViewChapterWrapper />} />
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
