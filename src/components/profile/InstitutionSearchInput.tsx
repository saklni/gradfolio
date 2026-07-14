// =============================================================================
// Gradfolio — InstitutionSearchInput Component
// =============================================================================
// An autocomplete input for institutions/universities.
// =============================================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";

interface InstitutionSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function InstitutionSearchInput({
  value,
  onChange,
  disabled = false,
}: InstitutionSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initial load and debounced search
  useEffect(() => {
    async function searchInstitutions() {
      setIsLoading(true);
      const supabase = createClient();
      
      try {
        let query = supabase.from("institutions").select("id, name").limit(10);
        
        if (debouncedQuery) {
          query = query.ilike("name", `%${debouncedQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (!error && data) {
          setInstitutions(data);
        }
      } catch (error) {
        console.error("Failed to fetch institutions", error);
      } finally {
        setIsLoading(false);
      }
    }

    searchInstitutions();
  }, [debouncedQuery]);

  // Determine if the current input value should be shown as a "Create new" option
  const showCreateOption = 
    searchQuery.trim().length > 0 && 
    !institutions.some((inst) => inst.name.toLowerCase() === searchQuery.trim().toLowerCase());

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  const handleCreate = async () => {
    const newName = searchQuery.trim();
    if (!newName) return;

    setIsLoading(true);
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from("institutions")
        .insert({ name: newName })
        .select()
        .single();
        
      if (!error && data) {
        setInstitutions((prev) => [data, ...prev]);
        handleSelect(data.name);
      } else if (error?.code === '23505') {
        // Unique violation - already exists
        handleSelect(newName);
      }
    } catch (error) {
      console.error("Failed to create institution", error);
      // Fallback to just using the string value even if not saved to DB
      handleSelect(newName);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        role="combobox"
        aria-expanded={open}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal",
          !value && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        {value ? value : "Cari institusi..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Ketik nama institusi..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mencari...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchQuery ? "Institusi tidak ditemukan." : "Mulai mengetik untuk mencari."}
                </CommandEmpty>
                <CommandGroup>
                  {institutions.map((inst) => (
                    <CommandItem
                      key={inst.id}
                      value={inst.name}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === inst.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {inst.name}
                    </CommandItem>
                  ))}
                  
                  {showCreateOption && (
                    <CommandItem
                      value={searchQuery}
                      onSelect={handleCreate}
                      className="text-primary italic"
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      Gunakan "{searchQuery}"
                    </CommandItem>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
