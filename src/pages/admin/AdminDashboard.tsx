import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Tags } from "lucide-react";
import AddManga from "./AddManga";
import ManageManga from "./ManageManga";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản trị Truyện</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/tags")}>
              <Tags className="h-4 w-4 mr-2" />
              Quản lý thể loại
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="manage">Quản lý Truyện</TabsTrigger>
            <TabsTrigger value="add">Thêm Truyện</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="mt-6">
            <ManageManga />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <AddManga />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
