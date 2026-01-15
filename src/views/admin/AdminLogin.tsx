"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const { signIn, user, isAdmin, loading } = useAuth();
  const hasRedirected = useRef(false);

  // Redirect when user is admin (either on mount or after login)
  useEffect(() => {
    if (!loading && user && isAdmin && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/admin/dashboard");
    }
  }, [user, isAdmin, loading, router]);

  // After successful login, wait for auth state to update
  useEffect(() => {
    if (loginSuccess && !loading && user) {
      if (isAdmin) {
        hasRedirected.current = true;
        router.replace("/admin/dashboard");
      } else {
        // User logged in but not admin
        toast.error("Bạn không có quyền truy cập trang quản trị!");
        setLoginSuccess(false);
      }
    }
  }, [loginSuccess, loading, user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors = validation.error.format();
      if (errors.email?._errors[0]) {
        toast.error(errors.email._errors[0]);
      } else if (errors.password?._errors[0]) {
        toast.error(errors.password._errors[0]);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email hoặc mật khẩu không đúng!");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Vui lòng xác nhận email của bạn trước khi đăng nhập!");
        } else {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
        }
        setPassword("");
      } else {
        toast.success("Đăng nhập thành công!");
        // Mark login success - redirect will happen via useEffect when auth state updates
        setLoginSuccess(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Khu vực Quản trị</CardTitle>
          <CardDescription>
            Đăng nhập để truy cập bảng điều khiển admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
