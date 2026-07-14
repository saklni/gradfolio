"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CoverImageUploaderProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function CoverImageUploader({
  value,
  onChange,
  disabled,
}: CoverImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : value ? URL.createObjectURL(value) : null
  );
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
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
          "relative flex flex-col items-center justify-center w-full min-h-[240px] rounded-lg border-2 border-dashed overflow-hidden transition-all",
          !preview && "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer",
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
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button 
                type="button" 
                variant="secondary" 
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
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Klik untuk mengunggah gambar</p>
            <p className="text-xs text-muted-foreground">
              Format didukung: JPG, PNG, WEBP (Max 5MB)
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
              Gambar ini akan menjadi cover portfolio Anda di Project Showcase. Disarankan rasio 16:9.
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-4 pointer-events-none"
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
