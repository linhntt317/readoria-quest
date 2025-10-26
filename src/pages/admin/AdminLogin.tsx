import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "lamondungtuyentruyen") {
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Đăng nhập thành công!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Mật khẩu không đúng!");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Khu vực Quản trị</CardTitle>
          <CardDescription>Nhập mật khẩu để truy cập</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full">
              Xác nhận
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
