"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Upload, Image, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  label?: string;
}

export const ImageUploader = ({
  value,
  onChange,
  error,
  label = "Ảnh bìa",
}: ImageUploaderProps) => {
  const [inputMode, setInputMode] = useState<"url" | "upload">(value ? "url" : "upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      onChange(url);
      setInputMode("url");
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={inputMode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("upload")}
          >
            <Upload className="h-3 w-3 mr-1" />
            Tải lên
          </Button>
          <Button
            type="button"
            variant={inputMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("url")}
          >
            <Image className="h-3 w-3 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {inputMode === "upload" ? (
        <div className="space-y-2">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              "hover:border-primary hover:bg-primary/5",
              isUploading && "pointer-events-none opacity-60"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Đang tải lên...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nhấn để chọn ảnh từ máy tính
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF, WEBP (tối đa 5MB)
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <Input
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={handleUrlChange}
        />
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Ảnh bìa preview"
            className="max-w-[200px] max-h-[280px] rounded-lg border object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
