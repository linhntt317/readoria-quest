import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)");
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File ảnh không được vượt quá 5MB");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("manga-covers")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error("Lỗi khi tải ảnh lên: " + error.message);
        return null;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("manga-covers")
        .getPublicUrl(filePath);

      setUploadProgress(100);
      toast.success("Tải ảnh lên thành công!");
      
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress,
  };
};
