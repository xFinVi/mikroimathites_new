"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
  categories?: Array<{ _id: string; title: string; slug: string }>;
}

export function ActiveFilters({ ageGroups = [], categories = [] }: ActiveFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const age = searchParams.get("age");
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const hasFilters = age || category || type || search;

  if (!hasFilters) return null;

  const buildUrlWithoutParam = (paramToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramToRemove);
    // Remove page param when filters change
    params.delete("page");
    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  const clearAllUrl = pathname;

  const ageGroupTitle = ageGroups.find((ag) => ag.slug === age)?.title || age;
  const categoryTitle = categories.find((cat) => cat.slug === category)?.title || category;
  const typeTitle = type === "activity" ? "Δραστηριότητες" : type === "printable" ? "Εκτυπώσιμα" : type;

  return (
    <div className="bg-background-white rounded-card p-4 shadow-subtle border border-border/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-dark mr-2">Ενεργά φίλτρα:</span>
        
        {search && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-pink/10 text-primary-pink text-sm font-medium">
            Αναζήτηση: "{search}"
            <Link href={buildUrlWithoutParam("search")}>
              <button
                type="button"
                className="ml-1 hover:bg-primary-pink/20 rounded-full p-0.5 transition-colors"
                aria-label="Αφαίρεση αναζήτησης"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Link>
          </span>
        )}
        
        {age && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-blue/10 text-secondary-blue text-sm font-medium">
            Ηλικία: {ageGroupTitle}
            <Link href={buildUrlWithoutParam("age")}>
              <button
                type="button"
                className="ml-1 hover:bg-secondary-blue/20 rounded-full p-0.5 transition-colors"
                aria-label="Αφαίρεση φίλτρου ηλικίας"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Link>
          </span>
        )}
        
        {category && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-yellow/10 text-accent-yellow text-sm font-medium">
            Κατηγορία: {categoryTitle}
            <Link href={buildUrlWithoutParam("category")}>
              <button
                type="button"
                className="ml-1 hover:bg-accent-yellow/20 rounded-full p-0.5 transition-colors"
                aria-label="Αφαίρεση φίλτρου κατηγορίας"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Link>
          </span>
        )}
        
        {type && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            Τύπος: {typeTitle}
            <Link href={buildUrlWithoutParam("type")}>
              <button
                type="button"
                className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                aria-label="Αφαίρεση φίλτρου τύπου"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Link>
          </span>
        )}
        
        {(age || category || type || search) && (
          <Link href={clearAllUrl} className="ml-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <X className="w-4 h-4" />
              Καθαρισμός όλων
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

