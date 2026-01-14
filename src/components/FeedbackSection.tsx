"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingOverlay } from "@/components/LoadingOverlay";

interface FeedbackData {
  name: string;
  email: string;
  message: string;
}

export const FeedbackSection = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackData) => {
      const { data: result, error } = await supabase.functions.invoke(
        "feedback",
        {
          body: data,
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to submit feedback");
      }

      return result;
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", message: "" });
      toast({
        title: "Cảm ơn!",
        description:
          "Góp ý của bạn đã được gửi thành công. Admin sẽ xem xét sớm.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi góp ý. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.message.trim()
    ) {
      feedbackMutation.mutate(formData);
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <LoadingOverlay
        isVisible={feedbackMutation.isPending}
        message="Đang gửi góp ý..."
      />

      <Card className="bg-card/50 border-border/50 hover:border-border/80 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-base">Góp Ý</CardTitle>
              <CardDescription className="text-xs mt-1">
                Giúp phát triển web
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="feedback-name"
                className="text-xs font-medium text-foreground/70"
              >
                Tên:
              </label>
              <Input
                id="feedback-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className="h-8 text-sm"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="feedback-email"
                className="text-xs font-medium text-foreground/70"
              >
                Email:
              </label>
              <Input
                id="feedback-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="h-8 text-sm"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="feedback-message"
                className="text-xs font-medium text-foreground/70"
              >
                Góp ý:
              </label>
              <Textarea
                id="feedback-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Chia sẻ ý kiến của bạn..."
                className="h-20 text-sm resize-none"
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length}/2000 ký tự
              </p>
            </div>

            <Button
              type="submit"
              disabled={feedbackMutation.isPending}
              className="w-full h-8 text-sm gap-2"
              size="sm"
            >
              {feedbackMutation.isPending ? (
                <>Đang gửi...</>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Gửi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
