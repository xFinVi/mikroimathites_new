/**
 * PrintableDownloadButton Component - Download button for printables with analytics tracking
 * 
 * Client component that handles printable PDF downloads. Tracks downloads in Supabase
 * analytics when user clicks download. Shows loading state and handles errors gracefully.
 */

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PrintableDownloadButtonProps {
  slug: string;
  variant?: "default" | "gradient" | "bright-green" | "bright-blue";
}

// Get or create session ID for tracking
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  const key = "analytics_session_id";
  let sessionId = localStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Detect device type
function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Track download
async function trackDownload(slug: string) {
  try {
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const referrer = document.referrer || null;
    const sourcePage = window.location.pathname;

    await fetch("/api/analytics/downloads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content_slug: slug,
        session_id: sessionId,
        referrer,
        source_page: sourcePage,
        device_type: deviceType,
      }),
    });
  } catch (error) {
    // Silently fail - don't break download if tracking fails
    console.error("Error tracking download:", error);
  }
}

export function PrintableDownloadButton({ slug, variant = "default" }: PrintableDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Track download first (fire and forget - don't block download)
      trackDownload(slug).catch(err => {
        // Silently fail - don't break download if tracking fails
        console.error("Download tracking error:", err);
      });
      
      // Direct download - API returns the file with proper Content-Disposition headers
      // This will force the browser to download instead of navigate
      const link = document.createElement('a');
      link.href = `/api/printables/${slug}/download`;
      link.download = `${slug}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Bright, eye-catching button styles
  const getButtonClassName = () => {
    const baseClasses = "font-bold shadow-xl rounded-2xl px-8 sm:px-12 py-4 h-auto min-w-[200px] sm:min-w-[280px] text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-white";
    
    if (variant === "bright-green" || variant === "gradient") {
      return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600`;
    }
    if (variant === "bright-blue") {
      return `${baseClasses} bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600`;
    }
    return baseClasses;
  };

  if (variant === "gradient" || variant === "bright-green" || variant === "bright-blue") {
    return (
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className={getButtonClassName()}
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-base sm:text-lg">Κατεβάζεται...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-base sm:text-lg font-extrabold">Κατεβάστε PDF</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-primary-pink hover:bg-primary-pink/90 text-white rounded-2xl px-8 py-3 h-auto min-w-[200px]"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Κατεβάζεται...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-sm">Κατεβάστε PDF</span>
        </>
      )}
    </Button>
  );
}

