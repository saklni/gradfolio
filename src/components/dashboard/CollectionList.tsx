"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Check, ExternalLink, Trash2, Loader2, Link2 } from "lucide-react";

import { deleteCollectionAction } from "@/actions/collection.actions";
import type { PortfolioCollectionSummary } from "@/types/portfolio.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CollectionList({
  collections,
}: {
  collections: PortfolioCollectionSummary[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioCollectionSummary | null>(null);

  const getShareUrl = (id: string) =>
    typeof window !== "undefined" ? `${window.location.origin}/share/${id}` : `/share/${id}`;

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(getShareUrl(id));
      setCopiedId(id);
      toast.success("Link disalin ke clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteCollectionAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
      setDeleteTarget(null);
    });
  };

  if (collections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Belum ada link bagikan yang dibuat.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="font-medium truncate">{collection.title}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="font-normal">
                    {collection.item_count} karya
                  </Badge>
                  <span>
                    Dibuat{" "}
                    {new Date(collection.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(collection.id)}
                >
                  {copiedId === collection.id ? (
                    <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {copiedId === collection.id ? "Disalin" : "Salin Link"}
                </Button>
                <a
                  href={`/share/${collection.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka link"
                >
                  <Button type="button" variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteTarget(collection)}
                  aria-label="Hapus link"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Link Bagikan?</DialogTitle>
            <DialogDescription>
              Link <strong>{deleteTarget?.title}</strong> akan langsung tidak
              bisa diakses lagi oleh siapa pun yang menyimpannya. Karya di
              dalamnya tidak akan terhapus. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isPending}>
              Batal
            </Button>
            <Button onClick={handleDelete} disabled={isPending} variant="destructive">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
