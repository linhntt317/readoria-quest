import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageReupload = () => {
  const [isReuploading, setIsReuploading] = useState(false);

  /**
   * Downloads an image from an external URL and re-uploads it to Supabase storage
   * Returns the new Supabase storage URL
   */
  const reuploadFromUrl = async (externalUrl: string): Promise<string | null> => {
    if (!externalUrl || externalUrl.trim() === "") return null;

    // If already a Supabase URL, return as-is
    if (externalUrl.includes("supabase.co")) {
      return externalUrl;
    }

    setIsReuploading(true);

    try {
      // Fetch the image from external URL
      const response = await fetch(externalUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(blob.type)) {
        toast.error("Định dạng ảnh không được hỗ trợ");
        return null;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (blob.size > maxSize) {
        toast.error("Ảnh quá lớn (tối đa 5MB)");
        return null;
      }

      // Generate unique filename
      const extension = blob.type.split("/")[1] || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
      const filePath = `covers/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("manga-covers")
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: false,
          contentType: blob.type,
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

      toast.success("Đã tải ảnh bìa lên hệ thống!");
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error("Re-upload error:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh: " + error.message);
      return null;
    } finally {
      setIsReuploading(false);
    }
  };

  return {
    reuploadFromUrl,
    isReuploading,
  };
};
