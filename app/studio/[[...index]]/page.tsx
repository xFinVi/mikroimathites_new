"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect } from "react";
import config from "@/sanity.config";

/**
 * Sanity Studio page
 * 
 * Suppresses the `disableTransition` prop warning which is a known compatibility
 * issue between next-sanity and React 19. This warning is harmless and doesn't
 * affect functionality. It will be resolved when next-sanity releases a React 19
 * compatible version.
 */
export default function StudioPage() {
  useEffect(() => {
    // Suppress the disableTransition prop warning from next-sanity
    // This is a known compatibility issue between next-sanity and React 19
    const originalError = console.error;
    console.error = (...args) => {
      // Only filter if the first argument is a string matching the exact warning pattern
      const firstArg = args[0];
      if (
        typeof firstArg === "string" &&
        firstArg.includes("disableTransition") &&
        firstArg.includes("React does not recognize") &&
        firstArg.includes("DOM element")
      ) {
        // Suppress this specific warning - it's harmless and will be fixed in a future next-sanity release
        return;
      }
      // Allow all other console errors to pass through normally
      originalError.apply(console, args);
    };

    // Cleanup: restore original console.error on unmount to prevent memory leaks
    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextStudio config={config} />;
}


