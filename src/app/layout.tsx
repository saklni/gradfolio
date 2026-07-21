import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// Self-hosted premium fonts (via @fontsource — no external request to Google
// at runtime, faster + more reliable than next/font/google fetching).
//
// Display/heading — Geist Sans: tight, geometric, confident. Wired to every
// h1–h6 through the `--font-heading` token in globals.css.
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-sans/800.css";
// Body — Manrope: warmer and more distinctive than Inter, still very
// readable at small sizes (labels, paragraphs, form fields).
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
// Mono — used for tags, share links, code-like metadata.
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gradfolio — Build Today. Showcase Tomorrow.",
    template: "%s | Gradfolio",
  },
  description:
    "Platform portfolio akademik lintas institusi. Dokumentasikan setiap karya sejak awal perkuliahan dan bagikan dalam satu tautan profesional.",
  keywords: [
    "portfolio",
    "akademik",
    "mahasiswa",
    "showcase",
    "gradfolio",
    "karya",
    "project",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
