"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants/gia-goneis";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when URL search param changes (e.g., from browser back/forward)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchQuery((prev) => {
      // Only update if different to avoid unnecessary re-renders
      return urlSearch !== prev ? urlSearch : prev;
    });
  }, [searchParams]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const updateURL = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    // Update local state immediately (so input shows typed value)
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce URL update (wait after user stops typing)
    debounceTimerRef.current = setTimeout(() => {
      updateURL(value);
    }, GIA_GONEIS_CONSTANTS.SEARCH_DEBOUNCE_MS);
  };

  const clearSearch = () => {
    setSearchQuery("");
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Update URL immediately when clearing
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-medium" />
      <Input
        type="text"
        placeholder="Αναζήτηση..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10 h-12 text-base"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

