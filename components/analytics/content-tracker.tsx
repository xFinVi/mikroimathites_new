"use client";

import { useContentTracking } from "@/hooks/use-content-tracking";
import { useEffect, useState } from "react";

interface ContentTrackerProps {
  content_type: "article" | "activity" | "recipe" | "printable";
  content_slug: string;
  source_page?: string;
  search_query?: string;
}

/**
 * Client component to track content views
 * Add this to any content detail page
 */
export function ContentTracker({
  content_type,
  content_slug,
  source_page,
  search_query,
}: ContentTrackerProps) {
  // Get source page from URL if not provided
  const [actualSourcePage, setActualSourcePage] = useState<string | undefined>(
    source_page
  );

  useEffect(() => {
    if (!actualSourcePage && typeof window !== "undefined") {
      // Get previous page from sessionStorage or referrer
      const prevPage = sessionStorage.getItem("previous_page");
      if (prevPage) {
        setActualSourcePage(prevPage);
      } else if (document.referrer) {
        try {
          const referrerUrl = new URL(document.referrer);
          if (referrerUrl.origin === window.location.origin) {
            setActualSourcePage(referrerUrl.pathname);
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    }

    // Store current page for next navigation
    if (typeof window !== "undefined") {
      sessionStorage.setItem("previous_page", window.location.pathname);
    }
  }, [actualSourcePage]);

  useContentTracking({
    content_type,
    content_slug,
    source_page: actualSourcePage,
    search_query,
  });

  return null; // This component doesn't render anything
}

