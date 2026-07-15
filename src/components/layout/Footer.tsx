// =============================================================================
// Gradfolio — Footer Component
// =============================================================================

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo & Tagline */}
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">
                Grad<span className="text-primary">folio</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Build Today. Showcase Tomorrow. Dokumentasikan setiap karya
              sejak awal perkuliahan, bagikan dalam satu tautan profesional.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href={ROUTES.HOME} className="text-muted-foreground hover:text-foreground transition-colors">
              Project Showcase
            </Link>
            <Link href={ROUTES.REGISTER} className="text-muted-foreground hover:text-foreground transition-colors">
              Buat Portfolio
            </Link>
            <Link href={ROUTES.LOGIN} className="text-muted-foreground hover:text-foreground transition-colors">
              Masuk
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Gradfolio. Dibuat untuk mahasiswa Indonesia.
          </p>
          <p className="text-xs text-muted-foreground">
            Setiap karya memiliki nilai. Dokumentasikan sejak selesai dibuat.
          </p>
        </div>
      </div>
    </footer>
  );
}
