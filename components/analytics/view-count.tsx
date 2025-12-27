"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCountProps {
  content_type: "article" | "activity" | "recipe" | "printable";
  content_slug: string;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function ViewCount({
  content_type,
  content_slug,
  className = "",
  showIcon = true,
  compact = false,
}: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchViews() {
      try {
        const response = await fetch(
          `/api/analytics/views?content_type=${content_type}&content_slug=${encodeURIComponent(content_slug)}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch views");
        }
        
        const data = await response.json();
        setViews(data.views || 0);
      } catch (error) {
        // Silently fail - don't break the page if view count fails
        setViews(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchViews();
  }, [content_type, content_slug]);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1.5 text-text-light text-xs ${className}`}>
        {showIcon && <Eye className="w-3 h-3" />}
        <span className="animate-pulse">...</span>
      </div>
    );
  }

  if (views === null || views === 0) {
    return null; // Don't show if no views
  }

  const formattedViews = compact
    ? views >= 1000
      ? `${(views / 1000).toFixed(1)}K`
      : views.toString()
    : views.toLocaleString("el-GR");

  return (
    <div className={`flex items-center gap-1.5 text-text-light text-xs ${className}`}>
      {showIcon && <Eye className="w-3 h-3" />}
      <span>{formattedViews} {compact ? "" : "προβολές"}</span>
    </div>
  );
}


