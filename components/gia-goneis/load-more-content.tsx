"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ContentList } from "@/components/content/content-list";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";

interface LoadMoreContentProps {
  initialItems: Array<{
    _id: string;
    _type: string;
    _contentType?: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    [key: string]: unknown;
  }>;
  initialTotal: number;
  initialTitle: string;
}

export function LoadMoreContent({
  initialItems,
  initialTotal,
  initialTitle,
}: LoadMoreContentProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(
    initialItems.length < initialTotal
  );
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevSearchKeyRef = useRef<string>("");
  const prevInitialIdsRef = useRef<string>("");
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a stable key from search params to detect filter changes
  const searchKey = useMemo(() => {
    return searchParams.toString();
  }, [searchParams]);

  // Reset when filters change - use stable comparison
  useEffect(() => {
    // Only reset if search params actually changed
    if (searchKey !== prevSearchKeyRef.current) {
      setItems(initialItems);
      setCurrentPage(1);
      setHasMore(initialItems.length < initialTotal);
      setError(null);
      prevSearchKeyRef.current = searchKey;
      // Update the IDs ref when search params change
      prevInitialIdsRef.current = initialItems.map((i) => i._id).sort().join(",");
    } else {
      // If search params didn't change but initialItems did (e.g., server revalidation)
      // Only update if the item IDs are different
      const currentIds = initialItems.map((i) => i._id).sort().join(",");
      if (currentIds !== prevInitialIdsRef.current && currentIds.length > 0) {
        setItems(initialItems);
        setHasMore(initialItems.length < initialTotal);
        prevInitialIdsRef.current = currentIds;
      }
    }
  }, [searchKey, initialItems, initialTotal]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(currentPage + 1));

      const response = await fetch(
        `/api/gia-goneis/load-more?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to load more content");
      }

      const data = await response.json();
      
      // Validate response data
      if (!data || !Array.isArray(data.items)) {
        throw new Error("Invalid response format");
      }

      setItems((prev) => [...prev, ...data.items]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(data.hasMore ?? false);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Αποτυχία φόρτωσης περιεχομένου";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, searchParams]);

  // Infinite scroll with Intersection Observer (with debouncing)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !error) {
          // Debounce to prevent rapid-fire requests
          if (loadMoreTimeoutRef.current) {
            clearTimeout(loadMoreTimeoutRef.current);
          }
          loadMoreTimeoutRef.current = setTimeout(() => {
            loadMore();
          }, 300);
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Start loading 100px before reaching the button
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, [hasMore, isLoading, loadMore, error]);

  return (
    <>
      <ContentList items={items} title={initialTitle} />
      
      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4" role="alert" aria-live="polite">
          <p className="text-red-600 text-sm font-medium text-center max-w-md">
            {error}
          </p>
          <Button
            onClick={() => {
              setError(null);
              loadMore();
            }}
            variant="outline"
            className="rounded-button px-6 py-2"
          >
            Δοκίμασε ξανά
          </Button>
        </div>
      )}
      
      {/* Load More Button / Infinite Scroll Trigger */}
      {hasMore && !error && (
        <div ref={observerTarget} className="flex justify-center py-8" aria-live="polite">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            className="rounded-button bg-primary-pink text-white hover:bg-primary-pink/90 px-8 py-3 min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isLoading ? "Φόρτωση περιεχομένου..." : "Φόρτωση περισσότερων στοιχείων"}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                <span>Φόρτωση...</span>
              </>
            ) : (
              "Φόρτωση περισσότερων"
            )}
          </Button>
        </div>
      )}
    </>
  );
}

