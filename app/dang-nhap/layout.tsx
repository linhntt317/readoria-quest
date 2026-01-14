import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập & Đăng Ký - Truyện Nhà Mèo",
  description:
    "Đăng nhập hoặc đăng ký tài khoản để cập nhật danh sách truyện yêu thích, theo dõi chapters mới và quản lý thư viện của bạn.",
  keywords: [
    "đăng nhập truyện",
    "đăng ký truyện",
    "tài khoản truyện",
    "đăng nhập truyện nhà mèo",
    "đăng ký truyện nhà mèo",
  ],
  openGraph: {
    title: "Đăng Nhập & Đăng Ký - Truyện Nhà Mèo",
    description:
      "Đăng nhập hoặc đăng ký tài khoản để cập nhật danh sách truyện yêu thích",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DangNhapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
