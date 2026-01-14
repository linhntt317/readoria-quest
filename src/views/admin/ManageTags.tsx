"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useTags } from "@/hooks/useManga";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BACKEND_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";

const CATEGORIES = [
  { name: "Tình cảm", color: "#EC4899" },
  { name: "Huyền ảo", color: "#8B5CF6" },
  { name: "Hiện đại", color: "#3B82F6" },
  { name: "Hài hước", color: "#F59E0B" },
  { name: "Kinh dị", color: "#EF4444" },
  { name: "Khác", color: "#6B7280" },
];

const ManageTags = () => {
  const router = useRouter();
  const { push } = useNavigationWithLoading();
  const { data: tags, refetch } = useTags();
  const { execute } = useAsyncWithLoading();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Khác",
    color: "#6B7280",
  });

  const handleAdd = async () => {
    try {
      await execute(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(`${BACKEND_URL}/functions/v1/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create tag");

        toast.success("Thêm thể loại thành công!");
        setIsAddDialogOpen(false);
        setFormData({ name: "", category: "Khác", color: "#6B7280" });
        refetch();
      });
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Có lỗi xảy ra khi thêm thể loại");
    }
  };

  const handleEdit = async () => {
    if (!editingTag) return;

    try {
      await execute(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(
          `${BACKEND_URL}/functions/v1/tags/${editingTag.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) throw new Error("Failed to update tag");

        toast.success("Cập nhật thể loại thành công!");
        setIsEditDialogOpen(false);
        setEditingTag(null);
        refetch();
      });
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thể loại");
    }
  };

  const handleDelete = async () => {
    if (!deleteTagId) return;

    try {
      await execute(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const response = await fetch(
          `${BACKEND_URL}/functions/v1/tags/${deleteTagId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete tag");

        toast.success("Xóa thể loại thành công!");
        setDeleteTagId(null);
        refetch();
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Có lỗi xảy ra khi xóa thể loại");
    }
  };

  const openEditDialog = (tag: any) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      category: tag.category,
      color: tag.color,
    });
    setIsEditDialogOpen(true);
  };

  const groupedTags = tags?.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => push("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm thể loại
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thể loại mới</DialogTitle>
                <DialogDescription>
                  Tạo thể loại mới cho truyện
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên thể loại *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Ngôn tình"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Nhóm *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      const cat = CATEGORIES.find((c) => c.name === value);
                      setFormData({
                        ...formData,
                        category: value,
                        color: cat?.color || "#6B7280",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý thể loại</CardTitle>
            <CardDescription>
              Thêm, sửa, xóa các thể loại truyện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedTags || {}).map(
                ([category, categoryTags]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryTags[0]?.color }}
                      />
                      <h3 className="font-semibold text-lg">{category}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({categoryTags.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {categoryTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent"
                        >
                          <span className="text-sm">{tag.name}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEditDialog(tag)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => setDeleteTagId(tag.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa thể loại</DialogTitle>
              <DialogDescription>Cập nhật thông tin thể loại</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên thể loại *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Nhóm *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    const cat = CATEGORIES.find((c) => c.name === value);
                    setFormData({
                      ...formData,
                      category: value,
                      color: cat?.color || "#6B7280",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEdit} className="w-full">
                Cập nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deleteTagId}
          onOpenChange={() => setDeleteTagId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa thể loại này? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ManageTags;
