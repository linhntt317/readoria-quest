"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Reply, Trash2, EyeOff, Eye, LogIn } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const BACKEND_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const BACKEND_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";

interface Comment {
  id: string;
  manga_id: string | null;
  chapter_id: string | null;
  nickname: string;
  content: string;
  parent_id: string | null;
  is_hidden: boolean;
  created_at: string;
}

interface CommentSectionProps {
  mangaId?: string;
  chapterId?: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, nickname: string) => void;
  onDelete: (commentId: string) => void;
  onToggleHidden: (commentId: string, isHidden: boolean) => void;
  isAdmin: boolean;
  replies: Comment[];
}

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  onToggleHidden,
  isAdmin,
  replies,
}: CommentItemProps) => {
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-lg">
              {comment.nickname.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.nickname}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>

            <p className="text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id, comment.nickname)}
                className="h-7 px-2 text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                Trả lời
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onToggleHidden(comment.id, !comment.is_hidden)
                    }
                    className="h-7 px-2 text-xs"
                  >
                    {comment.is_hidden ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Hiện
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Ẩn
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(comment.id)}
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {replies.length > 0 && (
        <div className="ml-8 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onToggleHidden={onToggleHidden}
              isAdmin={isAdmin}
              replies={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentSection = ({ mangaId, chapterId }: CommentSectionProps) => {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyToNickname, setReplyToNickname] = useState<string>("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [guestModeEnabled, setGuestModeEnabled] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = ["comments", mangaId || chapterId];

  const { data: comments = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mangaId) params.append("mangaId", mangaId);
      if (chapterId) params.append("chapterId", chapterId);

      const url = `${BACKEND_URL}/functions/v1/comments?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: {
      nickname: string;
      content: string;
      parentId?: string;
    }) => {
      const url = `${BACKEND_URL}/functions/v1/comments`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mangaId,
          chapterId,
          nickname: data.nickname,
          content: data.content,
          parentId: data.parentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNickname("");
      setContent("");
      setReplyToId(null);
      setReplyToNickname("");
      toast({
        title: "Thành công",
        description: "Bình luận của bạn đã được đăng",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng bình luận",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const url = `${BACKEND_URL}/functions/v1/comments/${commentId}`;

      const { data: session } = await supabase.auth.getSession();
      const authHeader = session.session?.access_token
        ? `Bearer ${session.session.access_token}`
        : "";

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          apikey: BACKEND_API_KEY,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Thành công",
        description: "Đã xóa bình luận",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa bình luận",
        variant: "destructive",
      });
    },
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: async ({
      commentId,
      isHidden,
    }: {
      commentId: string;
      isHidden: boolean;
    }) => {
      const url = `${BACKEND_URL}/functions/v1/comments/${commentId}`;

      const { data: session } = await supabase.auth.getSession();
      const authHeader = session.session?.access_token
        ? `Bearer ${session.session.access_token}`
        : "";

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          apikey: BACKEND_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHidden }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Thành công",
        description: "Đã cập nhật bình luận",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật bình luận",
        variant: "destructive",
      });
    },
  });

  // When user clicks on comment form area and is not logged in
  const handleCommentAreaFocus = () => {
    if (!user && !guestModeEnabled) {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    window.location.href = "/dang-nhap";
  };

  const handleGuestComment = () => {
    setShowLoginPrompt(false);
    setGuestModeEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For logged-in users, use their display name or email as nickname
    const finalNickname = user
      ? user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
      : nickname;

    if (!finalNickname.trim() || !content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }
    createCommentMutation.mutate({
      nickname: finalNickname,
      content,
      parentId: replyToId || undefined,
    });
  };

  const handleReply = (commentId: string, commentNickname: string) => {
    setReplyToId(commentId);
    setReplyToNickname(commentNickname);

    // If not logged in and guest mode not enabled, show login prompt
    if (!user && !guestModeEnabled) {
      setShowLoginPrompt(true);
      return;
    }

    document
      .getElementById("comment-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelReply = () => {
    setReplyToId(null);
    setReplyToNickname("");
  };

  const topLevelComments = comments.filter((c: Comment) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c: Comment) => c.parent_id === parentId);

  const isLoggedIn = !!user;
  const canComment = isLoggedIn || guestModeEnabled;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-xl font-bold">Bình luận ({comments.length})</h2>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Đăng nhập để bình luận
            </DialogTitle>
            <DialogDescription>
              Bạn có muốn đăng nhập để bình luận không? Đăng nhập giúp quản lý
              bình luận tốt hơn và hiển thị tên tài khoản của bạn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleGuestComment} className="w-full sm:w-auto">
              Bình luận vãng lai
            </Button>
            <Button onClick={handleLoginRedirect} className="w-full sm:w-auto">
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Form */}
      {canComment ? (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3" id="comment-form">
            {replyToId && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Đang trả lời{" "}
                    <span className="font-semibold text-primary">
                      {replyToNickname}
                    </span>
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelReply}
                  className="h-7"
                >
                  Hủy
                </Button>
              </div>
            )}

            {/* Show nickname input only for guest users */}
            {!isLoggedIn && (
              <Input
                placeholder="Tên của bạn"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
                required
              />
            )}

            {isLoggedIn && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <span>Bình luận với tên:</span>
                <span className="font-semibold text-foreground">
                  {user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                </span>
              </div>
            )}

            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              required
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {content.length}/1000 ký tự
              </span>
              <Button type="submit" disabled={createCommentMutation.isPending}>
                {createCommentMutation.isPending
                  ? "Đang gửi..."
                  : "Gửi bình luận"}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* Prompt to start commenting - shows login dialog on click */
        <Card
          className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={handleCommentAreaFocus}
        >
          <div className="text-center space-y-2">
            <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Nhấn vào đây để viết bình luận
            </p>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">
          Đang tải bình luận...
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>
      ) : (
        <div className="space-y-3">
          {topLevelComments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={(id) => deleteCommentMutation.mutate(id)}
              onToggleHidden={(id, hidden) =>
                toggleHiddenMutation.mutate({ commentId: id, isHidden: hidden })
              }
              isAdmin={isAdmin}
              replies={getReplies(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
