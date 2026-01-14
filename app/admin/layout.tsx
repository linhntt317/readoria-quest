import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Truyện Nhà Mèo",
  description:
    "Dashboard quản lý truyện tranh - Thêm, sửa, xóa truyện và chapters",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
