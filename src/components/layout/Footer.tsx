// =============================================================================
// Gradfolio — Footer Component
// =============================================================================

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">
              Grad<span className="text-primary">folio</span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              — Build Today. Showcase Tomorrow.
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Gradfolio. Dibuat untuk mahasiswa Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
