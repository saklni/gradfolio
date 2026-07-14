// =============================================================================
// Gradfolio — Landing Page / Project Showcase
// =============================================================================

import type { Metadata } from "next";
import { getAllPublicPortfoliosAction } from "@/actions/portfolio.actions";
import ShowcaseFilters from "@/components/showcase/ShowcaseFilters";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Gradfolio — Build Today. Showcase Tomorrow.",
  description:
    "Jelajahi karya mahasiswa dari berbagai institusi. Portfolio akademik yang menginspirasi.",
};

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { search, category } = params;
  
  const response = await getAllPublicPortfoliosAction({ search, category });
  const portfolios = response.success && response.data ? response.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (Public view needs a simple header if not using the dashboard layout) */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold sm:inline-block">
                🎓 Gradfolio
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-2">
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm">Daftar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-screen-xl mx-auto px-4 py-12 md:py-24 space-y-12">
        {/* Hero Section */}
        <ShowcaseHero />

        {/* Filters and Grid */}
        <section className="w-full space-y-8 pt-8">
          <ShowcaseFilters />
          <PortfolioGrid
            items={portfolios}
            emptyMessage={
              search || category
                ? "Tidak ada portfolio yang sesuai dengan pencarian Anda."
                : "Belum ada portfolio yang dipublikasikan."
            }
          />
        </section>
      </main>

      <footer className="border-t border-border/40 py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-semibold">Gradfolio Team</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
