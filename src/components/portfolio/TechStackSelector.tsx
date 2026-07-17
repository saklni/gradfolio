"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VALIDATION_LIMITS } from "@/constants";

interface TechStackSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export default function TechStackSelector({
  value = [],
  onChange,
  disabled,
}: TechStackSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const maxItems = VALIDATION_LIMITS.TECH_STACK_MAX_ITEMS;

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Prevent duplicates
    if (value.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }

    if (value.length >= maxItems) {
      toast.error(`Maksimal ${maxItems} teknologi`);
      return;
    }

    onChange([...value, trimmed]);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Ketik teknologi (contoh: React, Node.js) lalu tekan Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={VALIDATION_LIMITS.TECH_STACK_ITEM_MAX}
          disabled={disabled || value.length >= maxItems}
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleAdd}
          disabled={disabled || !inputValue.trim() || value.length >= maxItems}
        >
          Tambah
        </Button>
      </div>
      
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tech, index) => (
            <Badge 
              key={tech} 
              variant="secondary" 
              className="px-3 py-1 text-sm flex items-center gap-1 group"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none disabled:opacity-50"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Hapus {tech}</span>
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Belum ada teknologi yang ditambahkan.
        </p>
      )}
    </div>
  );
}
