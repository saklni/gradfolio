import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <Card className="hover-lift group relative flex h-full flex-col overflow-hidden ring-1 ring-foreground/[0.06] hover:shadow-soft-lg hover:ring-primary/20">
      {/* Absolute Header for Status & Actions */}
      {showStatus && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <Badge
            variant={item.status === "published" ? "success" : "secondary"}
            className="shadow-sm backdrop-blur-sm"
          >
            {item.status === "published" ? "Published" : "Draft"}
          </Badge>
          <PortfolioCardActions id={item.id} title={item.title} status={item.status} />
        </div>
      )}

      <Link href={`/portfolio/${item.id}`} className="flex flex-1 flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-brand-soft">
              <span className="text-4xl opacity-30">📁</span>
            </div>
          )}
          {/* Gradient overlay + "view" affordance on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-foreground opacity-0 shadow-soft backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          {/* Category & Type */}
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="border-primary/20 bg-primary/[0.04] font-normal text-primary">
              {item.category}
            </Badge>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {item.jenis_portfolio}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-heading text-base leading-snug font-semibold tracking-tight line-clamp-2 transition-colors group-hover:text-primary">
            {item.title}
          </h3>

          {/* Short Description */}
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {truncateText(item.deskripsi_singkat, 120)}
          </p>

          {/* Tech Stack (first 3) */}
          {item.tech_stack && item.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tech_stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
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
            <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gradient-brand-soft flex items-center justify-center text-[10px] font-semibold text-primary">
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
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs leading-none font-medium">
                  {item.profiles.full_name}
                </span>
                {item.profiles.institution && (
                  <span className="truncate text-[10px] leading-tight text-muted-foreground">
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
