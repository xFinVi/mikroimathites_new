/**
 * LazyWrapper Component - Defers component loading until visible in viewport
 * 
 * Uses IntersectionObserver to only load components when they're about to enter
 * the viewport. This reduces initial JavaScript bundle size and improves performance.
 * 
 * Fixes hydration errors by ensuring initial render matches between server and client.
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyWrapper({ 
  children, 
  fallback = null,
  rootMargin = "200px",
  threshold = 0.1
}: LazyWrapperProps) {
  // Start with false to match server render, only change after mount
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure we're mounted before starting IntersectionObserver
  // This prevents hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only start observing after mount to prevent hydration issues
    if (!isMounted) return;
    
    const container = containerRef.current;
    if (!container || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMounted, shouldLoad, rootMargin, threshold]);

  // Always render fallback initially to match server render
  // Only render children after shouldLoad becomes true
  return (
    <div ref={containerRef}>
      {shouldLoad ? children : fallback}
    </div>
  );
}
