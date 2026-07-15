// =============================================================================
// Gradfolio — PortfolioGrid Component
// =============================================================================
// Responsive grid layout for displaying portfolio cards.
// =============================================================================

"use client";

import type { PortfolioItem } from "@/types/portfolio.types";
import PortfolioCard from "./PortfolioCard";
import { motion, type Variants } from "framer-motion";

interface PortfolioGridProps {
  items: (PortfolioItem & {
    profiles?: {
      full_name: string;
      institution: string | null;
      avatar_url: string | null;
    };
  })[];
  showStatus?: boolean;
  emptyMessage?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function PortfolioGrid({
  items,
  showStatus = false,
  emptyMessage = "Belum ada portfolio item.",
}: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-16 px-6"
      >
        <span className="text-5xl mb-4">📂</span>
        <p className="text-muted-foreground text-center">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants} className="h-full">
          <PortfolioCard item={item} showStatus={showStatus} />
        </motion.div>
      ))}
    </motion.div>
  );
}
