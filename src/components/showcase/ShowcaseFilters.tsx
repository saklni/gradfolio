"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { CATEGORIES } from "@/constants";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ShowcaseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue, 500);

  // Update URL function
  const updateUrl = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    // Only update if it actually changed and isn't the initial render mounting mismatch
    if (debouncedSearch !== initialSearch) {
      updateUrl("search", debouncedSearch);
    }
  }, [debouncedSearch, updateUrl, initialSearch]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
    updateUrl("search", "");
  };

  const setCategory = (category: string) => {
    if (currentCategory === category) {
      updateUrl("category", ""); // toggle off
    } else {
      updateUrl("category", category);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari karya mahasiswa (contoh: Sistem Inventaris)..."
          className="w-full h-12 pl-11 pr-10 rounded-full bg-background shadow-soft border-primary/15 focus-visible:ring-primary/10"
          value={searchValue}
          onChange={onSearchChange}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex justify-center w-full">
        <ScrollArea className="w-full whitespace-nowrap px-4 py-2">
          <div className="flex items-center justify-center gap-2 w-max mx-auto">
            <Button
              variant={currentCategory === "" ? "default" : "outline"}
              size="sm"
              className={cn("rounded-full", currentCategory === "" ? "" : "opacity-70 hover:opacity-100")}
              onClick={() => updateUrl("category", "")}
            >
              Semua
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={currentCategory === cat ? "default" : "outline"}
                size="sm"
                className={cn("rounded-full", currentCategory === cat ? "" : "opacity-70 hover:opacity-100")}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden sm:flex" />
        </ScrollArea>
      </div>
    </div>
  );
}
