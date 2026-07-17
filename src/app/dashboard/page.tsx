import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import DashboardStats from "@/components/dashboard/DashboardStats";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { getUserPortfoliosAction } from "@/actions/portfolio.actions";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kelola seluruh portfolio item Anda.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const portfoliosRes = await getUserPortfoliosAction();
  const items = portfoliosRes.success && portfoliosRes.data ? portfoliosRes.data : [];

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Kelola seluruh karya dan portofolio Anda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href={ROUTES.DASHBOARD_SHARE}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Bagikan Portofolio
            </Link>
            <Link
              href={ROUTES.DASHBOARD_PORTFOLIO_NEW}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Karya
            </Link>
          </div>
        </div>

        <DashboardStats portfolios={items} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Daftar Karya</h2>
          <PortfolioGrid 
            items={items} 
            showStatus={true} 
            emptyMessage="Belum ada karya. Klik Tambah Karya untuk memulai."
          />
        </div>
      </div>
    </main>
  );
}
