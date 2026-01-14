import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truyện - Truyện Nhà Mèo",
  description: "Chi tiết truyện tranh với danh sách chapters đầy đủ",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TruyenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
