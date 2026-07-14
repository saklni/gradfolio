import { Folder, FolderCheck, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioItem } from "@/types/portfolio.types";

interface DashboardStatsProps {
  portfolios: PortfolioItem[];
}

export default function DashboardStats({ portfolios }: DashboardStatsProps) {
  const total = portfolios.length;
  const published = portfolios.filter((p) => p.status === "published").length;
  const draft = portfolios.filter((p) => p.status === "draft").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
          <Folder className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">
            Karya yang telah Anda buat
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <FolderCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{published}</div>
          <p className="text-xs text-muted-foreground">
            Tampil di Project Showcase
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{draft}</div>
          <p className="text-xs text-muted-foreground">
            Belum dipublikasikan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
