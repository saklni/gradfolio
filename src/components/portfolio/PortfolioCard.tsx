import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { truncateText } from "@/utils";
import type { PortfolioItem } from "@/types/portfolio.types";
import PortfolioCardActions from "./PortfolioCardActions";

interface PortfolioCardProps {
  item: PortfolioItem & {
    profiles?: {
      full_name: string;
      institution: string | null;
      avatar_url: string | null;
    };
  };
  showStatus?: boolean;
}

export default function PortfolioCard({ item, showStatus = false }: PortfolioCardProps) {
  return (
    <Card className="group overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 relative flex flex-col h-full">
      {/* Absolute Header for Status & Actions */}
      {showStatus && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Badge
            variant={item.status === "published" ? "default" : "secondary"}
            className="text-xs shadow-sm"
          >
            {item.status === "published" ? "Published" : "Draft"}
          </Badge>
          <PortfolioCardActions id={item.id} title={item.title} />
        </div>
      )}

      <Link href={`/portfolio/${item.id}`} className="flex-1 flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <span className="text-4xl opacity-30">📁</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Category & Type */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {item.category}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
              {item.jenis_portfolio}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {truncateText(item.deskripsi_singkat, 120)}
          </p>

          {/* Tech Stack (first 3) */}
          {item.tech_stack && item.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tech_stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
              {item.tech_stack.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  +{item.tech_stack.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author Info (showcase only) */}
          {item.profiles && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-auto">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary overflow-hidden shrink-0">
                {item.profiles.avatar_url ? (
                  <Image
                    src={item.profiles.avatar_url}
                    alt={item.profiles.full_name}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                ) : (
                  item.profiles.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium leading-none truncate">
                  {item.profiles.full_name}
                </span>
                {item.profiles.institution && (
                  <span className="text-[10px] text-muted-foreground leading-tight truncate">
                    {item.profiles.institution}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
