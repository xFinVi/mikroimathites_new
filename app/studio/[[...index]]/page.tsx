"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { useEffect } from "react";

/**
 * Sanity Studio page
 * 
 * Note: The `disableTransition` warning is a known compatibility issue
 * between next-sanity and React 19. It's harmless and doesn't affect functionality.
 * This component suppresses the warning in development.
 */
export default function StudioPage() {
  useEffect(() => {
    // Suppress the harmless disableTransition warning from next-sanity
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args: unknown[]) => {
        // Filter out the disableTransition warning
        if (
          typeof args[0] === "string" &&
          args[0].includes("disableTransition")
        ) {
          return;
        }
        originalError(...args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return <NextStudio config={config} />;
}


