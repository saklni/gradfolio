import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowUpRight, FolderOpen } from "lucide-react";

import { getPublicCollectionAction } from "@/actions/collection.actions";
import { RESOURCE_TYPE_LABELS, ROUTES } from "@/constants";
import { RESOURCE_TYPE_ICONS } from "@/lib/resource-icons";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getPublicCollectionAction(id);

  if (!res.success || !res.data) {
    return { title: "Link Bagikan Tidak Ditemukan" };
  }

  const collection = res.data;

  return {
    title: `${collection.title} | Gradfolio`,
    description: `${collection.items.length} karya dari ${collection.profiles.full_name} — dibagikan lewat Gradfolio.`,
  };
}

export default async function CollectionSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getPublicCollectionAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const collection = res.data;
  const author = collection.profiles;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="animate-fade-in-up space-y-6 mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <FolderOpen className="h-3 w-3" />
                {collection.items.length} Karya Dibagikan
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {collection.title}
              </h1>
            </div>
          </div>

          {/* Author strip */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
            <div className="h-12 w-12 rounded-full bg-gradient-brand-soft flex items-center justify-center text-lg font-heading font-semibold text-primary overflow-hidden shrink-0">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.full_name}
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                />
              ) : (
                author.full_name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{author.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {[author.program_studi, author.institution]
                  .filter(Boolean)
                  .join(" · ") || "Mahasiswa"}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-6">
          {collection.items.map((item, index) => (
            <article
              key={item.id}
              className="hover-lift animate-fade-in-up rounded-2xl border border-border/60 bg-card shadow-soft overflow-hidden"
              style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Cover */}
                <div className="relative w-full sm:w-64 aspect-[16/9] sm:aspect-auto shrink-0 bg-muted">
                  {item.cover_image_url ? (
                    <Image
                      src={item.cover_image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 256px"
                    />
                  ) : (
                    <div className="flex h-full min-h-40 items-center justify-center bg-gradient-brand-soft">
                      <span className="text-4xl opacity-30">📁</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.jenis_portfolio}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Calendar className="h-3 w-3" />
                      {item.tahun_pengerjaan}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-bold tracking-tight">{item.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {item.deskripsi_singkat}
                    </p>
                  </div>

                  {item.tech_stack && item.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tech_stack.slice(0, 6).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="rounded-full px-2.5 py-0.5 text-xs font-normal bg-primary/[0.06] text-primary"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {item.resources && item.resources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.resources.map((resource) => {
                        const ResourceIcon =
                          RESOURCE_TYPE_ICONS[
                            resource.resource_type as keyof typeof RESOURCE_TYPE_ICONS
                          ] ?? RESOURCE_TYPE_ICONS.other;
                        const typeLabel =
                          RESOURCE_TYPE_LABELS[
                            resource.resource_type as keyof typeof RESOURCE_TYPE_LABELS
                          ] ?? resource.resource_type;

                        return (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium shadow-xs transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:-translate-y-0.5"
                          >
                            <ResourceIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            {resource.label || typeLabel}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-1">
                    <Link
                      href={`${ROUTES.PORTFOLIO_SHARE}/${item.id}?from=share`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Lihat detail lengkap
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
