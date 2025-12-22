"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "/gia-goneis" }: PaginationProps) {
  const searchParams = useSearchParams();
  
  // Build URL with all current params except page
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ""}`;
  };

  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // Show page numbers (current - 2 to current + 2, but keep within bounds)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5; // Show 5 page numbers max
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {/* Previous Button */}
      {prevPage ? (
        <Link href={buildUrl(prevPage)}>
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Προηγούμενο
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Προηγούμενο
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-text-medium">
                ...
              </span>
            );
          }
          
          const isCurrent = page === currentPage;
          
          return (
            <Link key={page} href={buildUrl(page)}>
              <Button
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                className={cn(
                  "min-w-[40px]",
                  isCurrent && "bg-primary-pink hover:bg-primary-pink/90"
                )}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Σελίδα ${page}`}
              >
                {page}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {nextPage ? (
        <Link href={buildUrl(nextPage)}>
          <Button variant="outline" size="sm" className="gap-2">
            Επόμενο
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-2">
          Επόμενο
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </nav>
  );
}

