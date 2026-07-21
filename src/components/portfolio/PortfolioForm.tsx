"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";

import { z } from "zod";
import { portfolioSchema, type ResourceFormData } from "@/schemas/portfolio.schema";
import { createPortfolioAction, updatePortfolioAction } from "@/actions/portfolio.actions";
import { ROUTES, CATEGORIES, JENIS_PORTFOLIO, type Category, type JenisPortfolio } from "@/constants";
import type { PortfolioItemWithResources } from "@/types/portfolio.types";

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
import { Card, CardContent } from "@/components/ui/card";

import CoverImageUploader from "./CoverImageUploader";
import TechStackSelector from "./TechStackSelector";
import ResourceLinkFields from "./ResourceLinkFields";

interface PortfolioFormProps {
  initialData?: PortfolioItemWithResources;
}

export default function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<z.input<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: (initialData?.category as Category) || CATEGORIES[0],
      jenis_portfolio: (initialData?.jenis_portfolio as JenisPortfolio) || JENIS_PORTFOLIO[0],
      semester: initialData?.semester || undefined,
      tahun_pengerjaan: initialData?.tahun_pengerjaan || new Date().getFullYear(),
      deskripsi_singkat: initialData?.deskripsi_singkat || "",
      deskripsi_lengkap: initialData?.deskripsi_lengkap || "",
      peran: initialData?.peran || "",
      status: initialData?.status || "draft",
      tech_stack: initialData?.tech_stack || [],
      resources: (initialData?.resources as ResourceFormData[]) || [],
    },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const onSubmit = async (data: z.input<typeof portfolioSchema>, submitStatus: "draft" | "published") => {
    // Need a cover file if it's not editing, or if we want to enforce it.
    // Spec says cover is required. But if editing and we don't change it, that's fine.
    if (!isEditing && !coverFile && submitStatus === "published") {
      toast.error("Cover gambar wajib diunggah untuk publish portfolio.");
      return;
    }

    startTransition(async () => {
      setIsUploading(true);
      let newCoverUrl = initialData?.cover_image_url;
      let newCoverPublicId = initialData?.cover_image_public_id;

      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        if (initialData?.cover_image_public_id) {
          formData.append("oldPublicId", initialData.cover_image_public_id);
        }

        try {
          const uploadRes = await fetch("/api/upload/cover", {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            newCoverUrl = uploadData.url;
            newCoverPublicId = uploadData.publicId;
          } else {
            toast.error(uploadData.message || "Gagal mengunggah cover");
            setIsUploading(false);
            return;
          }
        } catch (err) {
          console.error("Cover upload error:", err);
          toast.error("Terjadi kesalahan saat mengunggah cover");
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(false);

      const payloadFormData = new FormData();
      payloadFormData.append("title", data.title);
      payloadFormData.append("category", data.category);
      payloadFormData.append("jenis_portfolio", data.jenis_portfolio);
      if (data.semester) payloadFormData.append("semester", String(data.semester));
      payloadFormData.append("tahun_pengerjaan", String(data.tahun_pengerjaan));
      payloadFormData.append("deskripsi_singkat", data.deskripsi_singkat);
      payloadFormData.append("deskripsi_lengkap", data.deskripsi_lengkap);
      if (data.peran) payloadFormData.append("peran", data.peran);
      payloadFormData.append("status", submitStatus);
      
      // JSON encode arrays
      payloadFormData.append("tech_stack", JSON.stringify(data.tech_stack));
      payloadFormData.append("resources", JSON.stringify(data.resources));

      if (newCoverUrl) payloadFormData.append("cover_image_url", newCoverUrl);
      if (newCoverPublicId) payloadFormData.append("cover_image_public_id", newCoverPublicId);

      let response;
      if (isEditing && initialData) {
        payloadFormData.append("id", initialData.id);
        response = await updatePortfolioAction(initialData.id, payloadFormData);
      } else {
        response = await createPortfolioAction(payloadFormData);
      }

      if (response.success) {
        toast.success(response.message);
        router.push(ROUTES.DASHBOARD);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <Form {...form}>
      <form className="space-y-8">
        
        {/* SECTION 1: Cover Image */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">Cover Portfolio</h2>
            <p className="text-sm text-muted-foreground">
              Gambar menarik yang merepresentasikan karya Anda.
            </p>
          </div>
          <CoverImageUploader
            value={coverFile || initialData?.cover_image_url || null}
            onChange={setCoverFile}
            onError={(message) => toast.error(message)}
            disabled={isPending || isUploading}
          />
        </div>

        {/* SECTION 2: Basic Info */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">Informasi Dasar</h2>
            <p className="text-sm text-muted-foreground">
              Detail utama tentang karya Anda.
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Karya <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Sistem Manajemen Inventaris" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori <span className="text-destructive">*</span></FormLabel>
                      <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jenis_portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Portfolio <span className="text-destructive">*</span></FormLabel>
                      <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JENIS_PORTFOLIO.map((jenis) => (
                            <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tahun_pengerjaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Pengerjaan <span className="text-destructive">*</span></FormLabel>
                      <Select disabled={isPending} onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tahun" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester (opsional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={14}
                          placeholder="Semester berapa (mis. 5)" 
                          disabled={isPending} 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="peran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran / Role (opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Developer, Project Manager, dll" disabled={isPending} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* SECTION 3: Descriptions */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">Deskripsi</h2>
            <p className="text-sm text-muted-foreground">
              Ceritakan lebih dalam tentang karya Anda.
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="deskripsi_singkat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Singkat <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ringkasan singkat dalam 1-2 kalimat. Akan tampil di Project Showcase." 
                        className="resize-none"
                        disabled={isPending} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Maksimal 200 karakter.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deskripsi_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Lengkap <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ceritakan latar belakang masalah, solusi yang ditawarkan, tantangan, dan hasil akhir dari proyek ini." 
                        className="min-h-[200px]"
                        disabled={isPending} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* SECTION 4: Tech Stack & Resources */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">Teknologi & Tautan</h2>
            <p className="text-sm text-muted-foreground">
              Tech stack yang digunakan dan referensi tautan karya.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-8">
              <FormField
                control={form.control}
                name="tech_stack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack / Tools</FormLabel>
                    <FormControl>
                      <TechStackSelector 
                        value={field.value || []} 
                        onChange={field.onChange} 
                        disabled={isPending} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ResourceLinkFields disabled={isPending} />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12 border-t border-border/40">
          <Button 
            type="button" 
            variant="outline"
            disabled={isPending || isUploading}
            onClick={() => form.handleSubmit((data) => onSubmit(data, "draft"))()}
            className="w-full sm:w-auto"
          >
            {(isPending || isUploading) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan sebagai Draft
          </Button>
          <Button 
            type="button"
            disabled={isPending || isUploading}
            onClick={() => form.handleSubmit((data) => onSubmit(data, "published"))()}
            className="w-full sm:w-auto"
          >
            {(isPending || isUploading) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish Karya
          </Button>
        </div>
      </form>
    </Form>
  );
}
