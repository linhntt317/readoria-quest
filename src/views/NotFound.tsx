"use client";
import { AppLink as Link, useAppPathname } from "@/lib/navigation";
import { useEffect } from "react";
import Seo from "@/components/Seo";

const NotFound = () => {
  const pathname = useAppPathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Seo
        title="404 - Không tìm thấy trang | Truyện Nhà Mèo"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Quay về trang chủ Truyện Nhà Mèo để khám phá thêm nhiều truyện hay."
        url="https://tieuthuyet.lovable.app/404"
      />
      <div className="text-center px-4">
        <h1 className="mb-4 text-5xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Không tìm thấy trang bạn yêu cầu
        </p>
        <Link
          href="/"
          className="text-primary underline hover:text-primary/80 font-medium"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
