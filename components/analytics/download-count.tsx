"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface DownloadCountProps {
  content_slug: string;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function DownloadCount({
  content_slug,
  className = "",
  showIcon = true,
  compact = false,
}: DownloadCountProps) {
  const [downloads, setDownloads] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const response = await fetch(
          `/api/analytics/downloads?content_slug=${encodeURIComponent(content_slug)}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch downloads");
        }
        
        const data = await response.json();
        setDownloads(data.downloads || 0);
      } catch (error) {
        // Silently fail - don't break the page if download count fails
        setDownloads(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDownloads();
  }, [content_slug]);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1.5 text-text-light text-xs ${className}`}>
        {showIcon && <Download className="w-3 h-3" />}
        <span className="animate-pulse">...</span>
      </div>
    );
  }

  if (downloads === null) {
    return null; // Don't show while loading
  }

  const formattedDownloads = compact
    ? downloads >= 1000
      ? `${(downloads / 1000).toFixed(1)}K`
      : downloads.toString()
    : downloads.toLocaleString("el-GR");

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showIcon && <Download className="w-4 h-4" />}
      <span>{formattedDownloads} {compact ? "" : "λήψεις"}</span>
    </div>
  );
}

