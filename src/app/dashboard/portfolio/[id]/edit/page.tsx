import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import { ROUTES } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

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

  // Fetch portfolio item
  const { data: portfolio } = await supabase
    .from("portfolio_items")
    .select(`
      *,
      resources:portfolio_resources(*)
    `)
    .eq("id", id)
    .single();

  if (!portfolio) {
    notFound();
  }

  // Ensure user owns this portfolio
  if (portfolio.user_id !== user.id) {
    redirect(ROUTES.DASHBOARD);
  }

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
              Edit Karya
            </h1>
            <p className="text-muted-foreground">
              Perbarui informasi karya Anda.
            </p>
          </div>
        </div>
        
        <PortfolioForm initialData={portfolio as any} />
      </div>
    </main>
  );
}
