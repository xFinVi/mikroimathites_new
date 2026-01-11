/**
 * LazyWrapper Component - Defers component loading until visible in viewport
 * 
 * Uses IntersectionObserver to only load components when they're about to enter
 * the viewport. This reduces initial JavaScript bundle size and improves performance.
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
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [shouldLoad, rootMargin, threshold]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? children : fallback}
    </div>
  );
}
