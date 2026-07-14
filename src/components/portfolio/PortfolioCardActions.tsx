"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Loader2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { deletePortfolioAction } from "@/actions/portfolio.actions";
import { ROUTES } from "@/constants";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PortfolioCardActions({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePortfolioAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setShowDeleteAlert(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 bg-background/80 backdrop-blur-sm z-10">
          <>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Menu Actions</span>
          </>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`${ROUTES.DASHBOARD}/portfolio/${id}/edit`} className="cursor-pointer flex items-center w-full h-full">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setShowDeleteAlert(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Portfolio?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus karya <strong>{title}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteAlert(false)} disabled={isPending}>
              Batal
            </Button>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              variant="destructive"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
