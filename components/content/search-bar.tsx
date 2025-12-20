"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      // Reset to page 1 when searching
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
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
        disabled={isPending}
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
      {isPending && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-pink border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

