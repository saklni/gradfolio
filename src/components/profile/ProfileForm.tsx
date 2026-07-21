// =============================================================================
// Gradfolio — ProfileForm Component
// =============================================================================

"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

import { profileSchema, onboardingSchema } from "@/schemas/profile.schema";
import { updateProfileAction, completeOnboardingAction } from "@/actions/profile.actions";
import { ROUTES, CLOUDINARY_CONFIG } from "@/constants";
import { validateImageFile } from "@/utils";
import type { Profile } from "@/types/portfolio.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InstitutionSearchInput from "./InstitutionSearchInput";

interface ProfileFormProps {
  initialData?: Profile | null;
  mode: "onboarding" | "settings";
}

// Combine both schemas to get all possible keys for the form, but resolve based on mode
type FormValues = z.infer<typeof profileSchema> & {
  avatarFile?: File | null;
};

export default function ProfileForm({ initialData, mode }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar_url || null
  );
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSettings = mode === "settings";
  const currentSchema = isSettings ? profileSchema : onboardingSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      institution: initialData?.institution || "",
      program_studi: initialData?.program_studi || "",
      angkatan: initialData?.angkatan || undefined,
      bio: initialData?.bio || "",
      avatarFile: null,
    },
  });

  // Upload avatar directly if in settings mode, or keep it in form state for onboarding
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(
      file,
      CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES,
      CLOUDINARY_CONFIG.MAX_FILE_SIZE
    );
    if (!validation.valid) {
      toast.error(validation.error ?? "File tidak valid.");
      e.target.value = "";
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    form.setValue("avatarFile", file);
    setSelectedAvatar(file);

    // Immediate upload for settings mode (better UX)
    if (isSettings && initialData) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (initialData.avatar_public_id) {
          formData.append("oldPublicId", initialData.avatar_public_id);
        }

        const res = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Foto profil berhasil diperbarui");
          router.refresh();
        } else {
          toast.error(data.message || "Gagal mengunggah foto profil");
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        toast.error("Terjadi kesalahan saat mengunggah foto profil");
      } finally {
        setIsUploading(false);
      }
    }
  };

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      // If in onboarding and avatar is selected, upload it first
      if (!isSettings && selectedAvatar) {
        try {
          setIsUploading(true);
          const avatarFormData = new FormData();
          avatarFormData.append("file", selectedAvatar);

          const res = await fetch("/api/upload/avatar", {
            method: "POST",
            body: avatarFormData,
          });

          const uploadData = await res.json();

          if (!uploadData.success) {
            toast.error(uploadData.message || "Gagal mengunggah foto profil");
            setIsUploading(false);
            return;
          }
        } catch (error) {
          console.error("Avatar upload error:", error);
          toast.error("Terjadi kesalahan saat mengunggah foto profil");
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const formData = new FormData();
      formData.append("full_name", data.full_name);
      if (data.institution) formData.append("institution", data.institution);
      if (data.program_studi) formData.append("program_studi", data.program_studi);
      if (data.angkatan) formData.append("angkatan", String(data.angkatan));
      if (data.bio) formData.append("bio", data.bio);

      const action = isSettings ? updateProfileAction : completeOnboardingAction;
      const response = await action(formData);

      if (response.success) {
        toast.success(response.message);
        if (!isSettings) {
          window.location.href = ROUTES.DASHBOARD;
        } else {
          router.refresh();
        }
      } else {
        toast.error(response.message);
        if (response.errors) {
          Object.keys(response.errors).forEach((key) => {
            const fieldKey = key as keyof FormValues;
            form.setError(fieldKey, {
              type: "server",
              message: response.errors![fieldKey]?.[0],
            });
          });
        }
      }
    });
  }

  // Generate years for "Angkatan" dropdown (from current year down to 2010)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => currentYear - i);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/60">
          <div className="relative h-24 w-24 shrink-0 rounded-full bg-gradient-brand p-[3px] shadow-glow-primary">
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-background bg-muted">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-heading font-semibold text-primary bg-gradient-brand-soft">
                  {form.watch("full_name")?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Foto Profil</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Gunakan foto yang jelas dan profesional. Maksimal ukuran file{" "}
              {(CLOUDINARY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB
              dengan format JPG, PNG, atau WEBP.
            </p>
            <div className="flex gap-3 mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Pilih Foto
              </Button>
              {avatarPreview && !isUploading && isSettings && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    // Avatar removal functionality to be added in Phase 5
                    toast.info("Fitur hapus foto akan segera hadir.");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Nama Lengkap <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Institusi / Universitas {!isSettings && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <InstitutionSearchInput
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_studi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Program Studi {!isSettings && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Sistem Informasi" disabled={isPending} {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="angkatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tahun Angkatan {!isSettings && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun angkatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio / Deskripsi Singkat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ceritakan sedikit tentang minat, fokus studi, atau tujuan karir Anda..."
                  className="resize-none h-24"
                  disabled={isPending}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Ditampilkan di halaman profil publik Anda. Maksimal 160 karakter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending || isUploading}>
            {(isPending || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSettings ? "Simpan Perubahan" : "Selesai & Mulai"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
