import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import { ROUTES } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tambah Portfolio",
  description: "Tambahkan portfolio item baru ke dalam koleksi Anda.",
};

export default function NewPortfolioPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.DASHBOARD}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Tambah Karya Baru
            </h1>
            <p className="text-muted-foreground">
              Dokumentasikan karya dan proyek Anda.
            </p>
          </div>
        </div>
        
        <PortfolioForm />
      </div>
    </main>
  );
}
