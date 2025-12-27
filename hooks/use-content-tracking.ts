"use client";

import { useEffect, useRef, useState } from "react";
import { logger } from "@/lib/utils/logger";

interface TrackViewOptions {
  content_type: "article" | "activity" | "recipe" | "printable";
  content_slug: string;
  source_page?: string;
  search_query?: string;
}

/**
 * Hook to track content views, time spent, and scroll depth
 * 
 * Usage:
 * ```tsx
 * useContentTracking({
 *   content_type: "article",
 *   content_slug: "sleep-tips",
 *   source_page: "/gia-goneis"
 * });
 * ```
 */
export function useContentTracking(options: TrackViewOptions) {
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID
    if (typeof window === "undefined") return null;
    let sid = localStorage.getItem("analytics_session_id");
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("analytics_session_id", sid);
    }
    return sid;
  });

  const startTime = useRef(Date.now());
  const [scrollDepth, setScrollDepth] = useState(0);
  const [readComplete, setReadComplete] = useState(false);
  const trackedRef = useRef(false);
  const finalTrackedRef = useRef(false);

  // Track initial view on mount
  useEffect(() => {
    if (trackedRef.current || typeof window === "undefined") return;
    trackedRef.current = true;

    const trackView = async () => {
      // Detect device type
      const userAgent = navigator.userAgent;
      let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
      if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceType = "mobile";
      } else if (/Tablet|iPad|PlayBook|Silk/i.test(userAgent)) {
        deviceType = "tablet";
      }

      try {
        await fetch("/api/analytics/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: options.content_type,
            content_slug: options.content_slug,
            session_id: sessionId,
            referrer: document.referrer || null,
            source_page: options.source_page || null,
            search_query: options.search_query || null,
            device_type: deviceType,
          }),
        });
      } catch (error) {
        // Silently fail - don't break the page if tracking fails
        logger.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [options.content_type, options.content_slug, sessionId, options.source_page, options.search_query]);

  // Track scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrolled = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );
      const newScrollDepth = Math.min(scrolled, 100);
      setScrollDepth(newScrollDepth);

      // Mark as read complete if scrolled to bottom (90% threshold)
      if (newScrollDepth >= 90 && !readComplete) {
        setReadComplete(true);
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [readComplete]);

  // Track time spent and completion on unmount or page visibility change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackFinal = async () => {
      if (finalTrackedRef.current) return;
      finalTrackedRef.current = true;

      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

      try {
        await fetch("/api/analytics/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: options.content_type,
            content_slug: options.content_slug,
            session_id: sessionId,
            time_spent: timeSpent,
            scroll_depth: scrollDepth,
            read_complete: readComplete,
          }),
        });
      } catch (error) {
        // Silently fail
        logger.error("Failed to track final view data:", error);
      }
    };

    // Track when page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackFinal();
      }
    };

    // Track on page unload
    const handleBeforeUnload = () => {
      trackFinal();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Final track on cleanup
      trackFinal();
    };
  }, [options.content_type, options.content_slug, sessionId, scrollDepth, readComplete]);
}

