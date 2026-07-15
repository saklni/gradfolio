// =============================================================================
// Gradfolio — Landing Page / Project Showcase
// =============================================================================

import type { Metadata } from "next";
import { getAllPublicPortfoliosAction } from "@/actions/portfolio.actions";
import ShowcaseFilters from "@/components/showcase/ShowcaseFilters";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <Navbar />

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <div className="relative w-full overflow-hidden">
          {/* Decorative animated gradient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-[70%] rounded-full bg-primary/20 blur-3xl animate-blob" />
            <div className="absolute -top-10 left-1/2 h-[380px] w-[380px] translate-x-[10%] rounded-full bg-accent/25 blur-3xl animate-blob [animation-delay:2s]" />
            <div className="absolute top-40 left-1/2 h-[320px] w-[320px] -translate-x-[110%] rounded-full bg-primary/10 blur-3xl animate-blob [animation-delay:4s]" />
          </div>

          <div className="max-w-screen-xl mx-auto px-4 py-16 md:py-28">
            <ShowcaseHero />
          </div>
        </div>

        {/* Filters and Grid */}
        <section className="w-full max-w-screen-xl mx-auto px-4 pb-24 space-y-8">
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

      <Footer />
    </div>
  );
}
