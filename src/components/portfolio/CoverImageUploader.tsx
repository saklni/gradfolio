"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile } from "@/utils";
import { CLOUDINARY_CONFIG } from "@/constants";
import { Button } from "@/components/ui/button";

interface CoverImageUploaderProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  /** Called when the selected file fails validation (wrong type / too large). */
  onError?: (message: string) => void;
}

export default function CoverImageUploader({
  value,
  onChange,
  disabled,
  onError,
}: CoverImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : value ? URL.createObjectURL(value) : null
  );
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(
      file,
      CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES,
      CLOUDINARY_CONFIG.MAX_FILE_SIZE
    );
    if (!validation.valid) {
      onError?.(validation.error ?? "File tidak valid.");
      e.target.value = "";
      return;
    }

    // Generate preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
      />
      
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[240px] rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200",
          !preview && "border-border hover:border-primary/50 hover:bg-primary/[0.03] cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        onClick={() => !preview && !disabled && inputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Cover preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <Button 
                type="button" 
                variant="secondary" 
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={disabled}
              >
                Ganti Gambar
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                className="rounded-full"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-brand-soft flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Klik untuk mengunggah gambar</p>
            <p className="text-xs text-muted-foreground">
              Format didukung: JPG, PNG, WEBP (Max{" "}
              {(CLOUDINARY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB)
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
              Gambar ini akan menjadi cover portfolio Anda di Project Showcase. Disarankan rasio 16:9.
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-4 pointer-events-none rounded-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Pilih File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
