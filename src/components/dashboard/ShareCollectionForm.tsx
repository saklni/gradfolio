"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Share2, Copy, Check, ExternalLink } from "lucide-react";

import { createCollectionAction } from "@/actions/collection.actions";
import { VALIDATION_LIMITS } from "@/constants";
import type { PortfolioItem } from "@/types/portfolio.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ShareCollectionFormProps {
  publishedItems: PortfolioItem[];
}

export default function ShareCollectionForm({
  publishedItems,
}: ShareCollectionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("Portfolio Saya");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal 1 karya untuk dibagikan.");
      return;
    }
    if (title.trim().length < VALIDATION_LIMITS.COLLECTION_TITLE_MIN) {
      toast.error(
        `Judul minimal ${VALIDATION_LIMITS.COLLECTION_TITLE_MIN} karakter.`
      );
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("portfolio_item_ids", JSON.stringify(selectedIds));

      const res = await createCollectionAction(formData);

      if (res.success && res.data) {
        const url = `${window.location.origin}/share/${res.data.id}`;
        setGeneratedUrl(url);
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast.success("Link disalin ke clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleReset = () => {
    setGeneratedUrl(null);
    setSelectedIds([]);
    setTitle("Portfolio Saya");
  };

  if (publishedItems.length === 0) {
    return (
      <Card className="border-dashed border-2 shadow-none">
        <CardContent className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-medium">Belum ada karya yang dipublikasikan</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Publikasikan minimal satu karya terlebih dahulu (ubah status dari
            Draft ke Published) sebelum bisa membuat link bagikan.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (generatedUrl) {
    return (
      <Card className="border-primary/20 bg-gradient-brand-soft shadow-soft-lg">
        <CardContent className="py-6 space-y-4">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
              <Check className="h-4 w-4 text-success" />
            </div>
            <p className="font-heading font-semibold">Link bagikan berhasil dibuat!</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Kirim link ini ke HRD, rekruter, atau dosen. Mereka akan melihat
            semua karya yang kamu pilih dalam satu halaman, tanpa perlu login.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input readOnly value={generatedUrl} className="rounded-xl font-mono text-xs sm:text-sm bg-background" />
            <div className="flex gap-2 shrink-0">
              <Button type="button" variant="outline" className="rounded-xl" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2 text-success" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Disalin" : "Salin"}
              </Button>
              <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" className="rounded-xl">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Buka link</span>
                </Button>
              </a>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Buat link bagikan baru
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="collection-title">Judul Bundle</Label>
          <Input
            id="collection-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Portfolio untuk Lamaran Magang PT XYZ"
            maxLength={VALIDATION_LIMITS.COLLECTION_TITLE_MAX}
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Judul ini hanya untuk membantumu mengenali bundle ini di daftar
            di bawah — tidak wajib sama dengan nama perusahaan tujuan.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Pilih Karya yang Ingin Dibagikan</Label>
            <span className="text-xs text-muted-foreground">
              {selectedIds.length} / {publishedItems.length} dipilih
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {publishedItems.map((item) => (
              <label
                key={item.id}
                htmlFor={`item-${item.id}`}
                className="flex items-start gap-3 rounded-xl border border-border/60 p-3.5 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/[0.03] has-data-checked:border-primary/40 has-data-checked:bg-primary/[0.05] has-data-checked:shadow-soft"
              >
                <Checkbox
                  id={`item-${item.id}`}
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  disabled={isPending}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.category} &middot; {item.jenis_portfolio} &middot;{" "}
                    {item.tahun_pengerjaan}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCreate}
          disabled={isPending || selectedIds.length === 0}
          className="w-full rounded-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4 mr-2" />
          )}
          Buat Link Bagikan
        </Button>
      </CardContent>
    </Card>
  );
}
