import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import { ROUTES } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioWithResourcesAction } from "@/actions/portfolio.actions";

export const metadata: Metadata = {
  title: "Edit Portfolio",
  description: "Perbarui informasi portfolio item Anda.",
};

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // getPortfolioWithResourcesAction already scopes the query to the
  // logged-in user (`.eq("user_id", user.id)`), so a missing result here
  // covers both "doesn't exist" and "not yours" without leaking which —
  // in both cases the safest, correct move is back to the dashboard.
  const portfolioRes = await getPortfolioWithResourcesAction(id);

  if (!portfolioRes.success || !portfolioRes.data) {
    redirect(ROUTES.DASHBOARD);
  }

  const portfolio = portfolioRes.data;

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.DASHBOARD}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:bg-muted")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Edit Karya
            </h1>
            <p className="text-muted-foreground">
              Perbarui informasi karya Anda.
            </p>
          </div>
        </div>
        
        <PortfolioForm initialData={portfolio} />
      </div>
    </main>
  );
}
