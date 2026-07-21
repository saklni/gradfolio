import { Folder, FolderCheck, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PortfolioItem } from "@/types/portfolio.types";

interface DashboardStatsProps {
  portfolios: PortfolioItem[];
}

export default function DashboardStats({ portfolios }: DashboardStatsProps) {
  const total = portfolios.length;
  const published = portfolios.filter((p) => p.status === "published").length;
  const draft = portfolios.filter((p) => p.status === "draft").length;

  const stats = [
    {
      label: "Total Portfolio",
      value: total,
      description: "Karya yang telah Anda buat",
      icon: Folder,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Published",
      value: published,
      description: "Tampil di Project Showcase",
      icon: FolderCheck,
      iconClass: "bg-success/15 text-success",
    },
    {
      label: "Drafts",
      value: draft,
      description: "Belum dipublikasikan",
      icon: FolderOpen,
      iconClass: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="hover-lift">
          <CardContent className="flex items-start justify-between px-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="font-heading text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", stat.iconClass)}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
