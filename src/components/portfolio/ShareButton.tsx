"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton({ title, text, url }: { title: string; text?: string; url?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Use Web Share API if available (mobile devices usually)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || "Lihat portfolio ini di Gradfolio!",
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to copy if user cancels or it fails
        console.error("Error sharing", err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Disalin!" : "Bagikan"}
    </Button>
  );
}
