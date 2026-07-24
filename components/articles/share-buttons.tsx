/**
 * ShareButtons Component - Generic share using Web Share API
 * 
 * Uses native Web Share API when available (mobile/desktop browsers),
 * falls back to copy link when Web Share API is not supported.
 * This lets users choose their preferred sharing app instead of
 * forcing specific social media platforms.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [supportsWebShare, setSupportsWebShare] = useState(false);
  
  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${url}` 
    : url;

  useEffect(() => {
    // Check if Web Share API is supported
    if (typeof navigator !== "undefined" && navigator.share) {
      setSupportsWebShare(true);
    }
  }, []);

  const handleShare = async () => {
    // Use Web Share API if available
    if (supportsWebShare && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or error occurred, fall back to copy
        if ((error as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy link:", err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <div className="border-t border-border/50 pt-8 mt-8">
      <h3 className="text-lg font-semibold text-text-dark mb-4">Κοινοποίηση</h3>
      <div className="flex flex-wrap gap-3">
        {/* Generic Share Button - Uses Web Share API or falls back to copy */}
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Αντιγράφηκε!
            </>
          ) : (
            <>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342c-.4 0-.811.037-1.23.11a5.5 5.5 0 01-1.5-1.5 5.5 5.5 0 01-1.5-1.5c.073-.419.11-.83.11-1.23 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .4.037.811.11 1.23a5.5 5.5 0 011.5 1.5 5.5 5.5 0 011.5 1.5c.419.073.83.11 1.23.11 1.657 0 3-1.343 3-3s-1.343-3-3-3zm-6 0c-1.657 0-3 1.343-3 3s1.343 3 3 3c.4 0 .811-.037 1.23-.11a5.5 5.5 0 001.5-1.5 5.5 5.5 0 001.5-1.5c-.073-.419-.11-.83-.11-1.23 0-1.657 1.343-3 3-3s3 1.343 3 3c0 .4-.037.811-.11 1.23a5.5 5.5 0 00-1.5 1.5 5.5 5.5 0 00-1.5 1.5c-.419.073-.83.11-1.23.11zm18-6c-1.657 0-3 1.343-3 3s1.343 3 3 3c.4 0 .811-.037 1.23-.11a5.5 5.5 0 001.5-1.5 5.5 5.5 0 001.5-1.5c-.073-.419-.11-.83-.11-1.23 0-1.657 1.343-3 3-3s3 1.343 3 3c0 .4-.037.811-.11 1.23a5.5 5.5 0 00-1.5 1.5 5.5 5.5 0 00-1.5 1.5c-.419.073-.83.11-1.23.11z" 
                />
              </svg>
              {supportsWebShare ? "Κοινοποίηση" : "Αντιγραφή συνδέσμου"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

