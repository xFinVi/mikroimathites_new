"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ContentFiltersProps {
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
  categories?: Array<{ _id: string; title: string; slug: string }>;
  showTypeFilter?: boolean; // For activities page (activity vs printable)
  showCategoryFilter?: boolean; // Whether to show category filter (default: true)
}

export function ContentFilters({
  ageGroups = [],
  categories = [],
  showTypeFilter = false,
  showCategoryFilter = true,
}: ContentFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const ageFilter = searchParams.get("age") || undefined;
  const categoryFilter = searchParams.get("category") || undefined;
  const typeFilter = searchParams.get("type") || undefined;

  // Map categories - show all but with merged display names
  // Note: "Ελληνικό Εξωτερικό" is filtered out at the query level
  const displayCategories = categories.map((cat) => {
    // Rename merged categories for display
    if (cat.slug === 'diatrofi-epiloges') {
      return { ...cat, title: 'Διατροφή & Συνταγές' };
    }
    if (cat.slug === 'fysikes-syntages') {
      // Hide this one since it's merged into "Διατροφή & Επιλογές"
      return null;
    }
    if (cat.slug === 'texnes-xirotexnies') {
      return { ...cat, title: 'Δραστηριότητες & Παιχνίδια' };
    }
    if (cat.slug === 'idees-paixnidiou') {
      // Hide this one since it's merged into "Τέχνες & Χειροτεχνίες"
      return null;
    }
    return cat;
  }).filter((cat): cat is NonNullable<typeof cat> => cat !== null);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Handle "all" value to clear filter
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to page 1 when filtering
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = ageFilter || (showCategoryFilter && categoryFilter) || typeFilter;

  return (
    <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-text-dark">Φίλτρα:</span>

        {/* Age Group Filter */}
        {ageGroups.length > 0 && (
          <div className="space-y-2">
            <Select value={ageFilter || "all"} onValueChange={(value) => updateFilter("age", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Όλες οι ηλικίες" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι ηλικίες</SelectItem>
                {ageGroups.map((ageGroup) => (
                  <SelectItem key={ageGroup._id} value={ageGroup.slug}>
                    {ageGroup.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Category Filter */}
        {showCategoryFilter && displayCategories.length > 0 && (
          <div className="space-y-2">
            <Select
              value={categoryFilter || "all"}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Όλες οι κατηγορίες" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι κατηγορίες</SelectItem>
                {displayCategories.map((category) => (
                  <SelectItem key={category._id} value={category.slug}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Type Filter (for activities page) */}
        {showTypeFilter && (
          <div className="space-y-2">
            <Select value={typeFilter || "all"} onValueChange={(value) => updateFilter("type", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Όλοι οι τύποι" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                <SelectItem value="activity">Δραστηριότητες</SelectItem>
                <SelectItem value="printable">Εκτυπώσιμα</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Καθαρισμός
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-border/50">
          <span className="text-xs text-text-medium">Ενεργά φίλτρα:</span>
          {ageFilter && (
            <span className="px-3 py-1 rounded-full bg-primary-pink/10 text-primary-pink text-xs font-medium">
              Ηλικία: {ageGroups.find((ag) => ag.slug === ageFilter)?.title || ageFilter}
            </span>
          )}
          {showCategoryFilter && categoryFilter && (
            <span className="px-3 py-1 rounded-full bg-secondary-blue/10 text-secondary-blue text-xs font-medium">
              Κατηγορία: {displayCategories.find((c) => c.slug === categoryFilter)?.title || categories.find((c) => c.slug === categoryFilter)?.title || categoryFilter}
            </span>
          )}
          {typeFilter && (
            <span className="px-3 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow text-xs font-medium">
              Τύπος: {typeFilter === "activity" ? "Δραστηριότητες" : "Εκτυπώσιμα"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

