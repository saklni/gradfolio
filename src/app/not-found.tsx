import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-grid-fade px-4 py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-blob" />
        </div>
        <div className="animate-fade-in-up text-center space-y-6 max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand-soft">
            <Compass className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-gradient-brand text-5xl font-extrabold tracking-tight">404</h1>
            <p className="text-lg font-medium">Halaman tidak ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Karya atau halaman yang Anda cari mungkin sudah dihapus, belum
              dipublikasikan, atau tautannya salah ketik.
            </p>
          </div>
          <Link href={ROUTES.HOME}>
            <Button className="rounded-full px-6">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Showcase
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
