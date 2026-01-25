"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Users, Zap } from "lucide-react";

export function NovelContentSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Kho Truyện Khổng Lồ",
      description:
        "Hàng ngàn tác phẩm ngôn tình, tiểu thuyết, truyện edit và truyện dịch đa dạng",
    },
    {
      icon: Zap,
      title: "Cập Nhật Liên Tục",
      description:
        "Những chương mới được đăng hàng ngày từ các tác giả và dịch giả tài năng",
    },
    {
      icon: Users,
      title: "Cộng Đồng Sôi Động",
      description:
        "Tương tác với bạn đọc, bình luận và chia sẻ cảm nhận về truyện yêu thích",
    },
    {
      icon: Heart,
      title: "Hoàn Toàn Miễn Phí",
      description:
        "Đọc tất cả các truyện mà không cần trả phí hoặc đăng ký phức tạp",
    },
  ];

  const categories = [
    "Ngôn Tình",
    "Tiểu Thuyết",
    "Truyện Edit",
    "Truyện Dịch",
    "Đam Mỹ",
    "Lighten",
    "Xuyên Không",
    "Khoa Học Viễn Tưởng",
    "Huyền Ảo",
    "Hệ Thống",
    "Trinh Thám",
    "Cổ Đại",
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Chào Mừng Bạn Đến Với Thế Giới Văn Học Số
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Truyện Nhà Mèo là nền tảng đọc truyện online hàng đầu dành cho các
            tình yêu văn học, tiểu thuyết ngôn tình và truyện web. Với kho tàng
            truyện khổng lồ bao gồm các tác phẩm gốc, truyện edit sáng tạo và
            những bộ truyện dịch đỉnh cao, chúng tôi mang đến cho bạn những câu
            chuyện hấp dẫn, những tình huống rối ren và những giây phút rung
            động.
          </p>
          <p className="text-muted-foreground">
            Dù bạn yêu thích những câu chuyện tình yêu ngọt ngào, những cuộc
            phiêu lưu đầy kịch tính hay những bộ truyện xuyên không hoang dã,
            chúng tôi đều có những gì bạn tìm kiếm. Cập nhật hàng ngày với những
            chương mới từ các tác giả tài năng, Truyện Nhà Mèo là điểm đến lý
            tưởng cho mọi người yêu đọc truyện.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-primary/20">
                <CardHeader>
                  <Icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Khám Phá Theo Thể Loại</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="text-sm py-2 h-auto hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* SEO Content Block */}
        <div className="bg-card rounded-lg p-8 border border-border mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Tại Sao Chọn Truyện Nhà Mèo?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                📚 Thư Viện Truyện Đa Dạng
              </h4>
              <p className="text-sm mb-4">
                Từ những bộ truyện ngôn tình lãng mạn đến những tiểu thuyết khoa
                học viễn tưởng, từ truyện edit sáng tạo đến những tác phẩm dịch
                đỉnh cao - Truyện Nhà Mèo có tất cả. Kho tàng truyện được cập
                nhật thường xuyên với những tác phẩm mới từ các tác giả và dịch
                giả tài năng nhất.
              </p>

              <h4 className="font-semibold text-foreground mb-2">
                💬 Cộng Đồng Bạn Đọc Sôi Động
              </h4>
              <p className="text-sm">
                Tương tác trực tiếp với các tác giả, bình luận về chương yêu
                thích, chia sẻ cảm nhận và kết nối với những độc giả có cùng đam
                mê. Đây là không gian để các tình yêu văn học tìm thấy sự đồng
                cảm và khám phá những câu chuyện tuyệt vời cùng nhau.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                ⚡ Trải Nghiệm Đọc Trơn Tru
              </h4>
              <p className="text-sm mb-4">
                Giao diện sạch sẽ, dễ sử dụng và được tối ưu cho mọi thiết bị.
                Bạn có thể đọc trên điện thoại, máy tính bảng hay máy tính để
                bàn mà không gặp vấn đề gì. Chế độ ban đêm giúp bạn đọc thoải
                mái vào bất kỳ thời gian nào.
              </p>

              <h4 className="font-semibold text-foreground mb-2">
                🆓 Hoàn Toàn Miễn Phí & An Toàn
              </h4>
              <p className="text-sm">
                Tất cả các truyện đều có thể đọc miễn phí mà không cần đăng ký
                hoặc trả phí. Không có quảng cáo pop-up khó chịu, không có phí
                ẩn. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và cung cấp
                trải nghiệm đọc an toàn, sạch sẽ.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary/10 rounded-lg p-8 border border-primary/20">
          <h3 className="text-2xl font-bold mb-3">
            Bắt Đầu Hành Trình Đọc Truyện Ngay Hôm Nay
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Khám phá hàng ngàn bộ truyện ngôn tình, tiểu thuyết, truyện edit và
            truyện dịch. Tìm những tác phẩm yêu thích của bạn và bắt đầu hành
            trình đọc tuyệt vời.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Khám Phá Truyện
            </Button>
            <Button size="lg" variant="outline">
              Xem Top Truyện Hay
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
