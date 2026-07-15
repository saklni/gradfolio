import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicPortfolioAction } from "@/actions/portfolio.actions";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import ShareButton from "@/components/portfolio/ShareButton";
import { RESOURCE_TYPE_LABELS } from "@/constants";
import { RESOURCE_TYPE_ICONS } from "@/lib/resource-icons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getPublicPortfolioAction(id);

  if (!res.success || !res.data) {
    return {
      title: "Portfolio Tidak Ditemukan",
    };
  }

  const portfolio = res.data;

  return {
    title: `${portfolio.title} | Gradfolio`,
    description: portfolio.deskripsi_singkat,
    openGraph: {
      title: portfolio.title,
      description: portfolio.deskripsi_singkat,
      images: portfolio.cover_image_url ? [portfolio.cover_image_url] : [],
    },
  };
}

export default async function PortfolioSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getPublicPortfolioAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const item = res.data;
  const author = item.profiles;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <article className="space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.category}</Badge>
                <Badge variant="outline">{item.jenis_portfolio}</Badge>
              </div>
              <ShareButton title={item.title} text={item.deskripsi_singkat} />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {item.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {item.deskripsi_singkat}
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm">
            {item.cover_image_url ? (
              <Image
                src={item.cover_image_url}
                alt={item.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                <span className="text-6xl opacity-30">📁</span>
              </div>
            )}
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column: Descriptions & Tech Stack */}
            <div className="md:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Deskripsi Lengkap</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-loose">
                  {item.deskripsi_lengkap.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {item.tech_stack && item.tech_stack.length > 0 && (
                <section className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-lg font-semibold tracking-tight">Teknologi yang Digunakan</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="px-3 py-1 font-normal bg-primary/10 text-primary hover:bg-primary/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Metadata & Author */}
            <div className="space-y-6">
              {/* Author Card */}
              {author && (
                <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pembuat</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary overflow-hidden shrink-0">
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
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">{author.full_name}</span>
                      {author.institution && (
                        <span className="text-xs text-muted-foreground truncate">{author.institution}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Detail Proyek</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Tahun: {item.tahun_pengerjaan}</span>
                  </div>
                  {item.semester && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">SM</span>
                      <span>Semester {item.semester}</span>
                    </div>
                  )}
                  {item.peran && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="leading-snug">Peran: {item.peran}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resources */}
              {item.resources && item.resources.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tautan Terkait</h3>
                  <div className="flex flex-col gap-2">
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
                          className="group inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-full justify-start h-auto py-2.5 px-3"
                        >
                          <ResourceIcon className="h-4 w-4 mr-2 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="truncate">{resource.label || typeLabel}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
