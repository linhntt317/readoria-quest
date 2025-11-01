import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MangaDetail from "./pages/MangaDetail";
import ChapterReader from "./pages/ChapterReader";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddChapter from "./pages/admin/AddChapter";
import AdminMangaDetail from "./pages/admin/MangaDetail";
import EditManga from "./pages/admin/EditManga";
import EditChapter from "./pages/admin/EditChapter";
import ViewChapter from "./pages/admin/ViewChapter";
import ManageTags from "./pages/admin/ManageTags";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/truyen/:mangaId" element={<MangaDetail />} />
              <Route path="/truyen/:mangaId/chuong/:chapterId" element={<ChapterReader />} />
              <Route path="/admin/post-truyen" />
              {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-chapter/:mangaId" element={
                <ProtectedRoute>
                  <AddChapter />
                </ProtectedRoute>
              } />
              <Route path="/admin/manga-detail/:mangaId" element={
                <ProtectedRoute>
                  <AdminMangaDetail />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-manga/:mangaId" element={
                <ProtectedRoute>
                  <EditManga />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-chapter/:chapterId" element={
                <ProtectedRoute>
                  <EditChapter />
                </ProtectedRoute>
              } />
              <Route path="/admin/view-chapter/:chapterId" element={
                <ProtectedRoute>
                  <ViewChapter />
                </ProtectedRoute>
              } />
              <Route path="/admin/tags" element={
                <ProtectedRoute>
                  <ManageTags />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
