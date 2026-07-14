"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function ShowcaseHero() {
  return (
    <section className="text-center space-y-6 max-w-3xl mx-auto overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
          Platform Portfolio Akademik
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance"
      >
        Build Today.{" "}
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Showcase Tomorrow.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-muted-foreground leading-relaxed text-balance"
      >
        Dokumentasikan setiap karya sejak awal perkuliahan. Bagikan dalam satu
        halaman profesional. Temukan inspirasi dari mahasiswa di seluruh
        Indonesia.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-4 pt-4"
      >
        <Link href={ROUTES.REGISTER}>
          <Button size="lg" className="rounded-full px-8 shadow-md transition-transform hover:scale-105">
            Mulai Sekarang
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
