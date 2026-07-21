"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function ShowcaseHero() {
  return (
    <section className="relative mx-auto max-w-3xl overflow-hidden px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 flex justify-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Platform Portfolio Akademik
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        Build Today.{" "}
        <span className="animate-gradient-pan text-gradient-brand">
          Showcase Tomorrow.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-balance text-muted-foreground"
      >
        Dokumentasikan setiap karya sejak awal perkuliahan. Bagikan dalam satu
        halaman profesional. Temukan inspirasi dari mahasiswa di seluruh
        Indonesia.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex items-center justify-center gap-3"
      >
        <Link href={ROUTES.REGISTER}>
          <Button size="lg" className="group rounded-full px-7">
            Mulai Sekarang
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
        <Link href="#showcase">
          <Button size="lg" variant="outline" className="rounded-full px-7">
            Lihat Karya
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
