import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chương - Đọc Truyện Online | Truyện Nhà Mèo",
  description: "Đọc chapter truyện tranh online miễn phí",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChuongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
