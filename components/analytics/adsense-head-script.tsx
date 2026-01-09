"use client";

import { useEffect } from "react";

interface AdSenseHeadScriptProps {
  client: string;
}

/**
 * AdSense Head Script Component
 * 
 * Injects the AdSense script directly into the document head without
 * Next.js Script component attributes (like data-nscript) that AdSense
 * doesn't support for verification.
 * 
 * This script is required for AdSense site verification and must be
 * loaded before ad units can be initialized.
 */
export function AdSenseHeadScript({ client }: AdSenseHeadScriptProps) {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector(`script[src*="adsbygoogle.js?client=${client}"]`)) {
      return;
    }

    // Create and inject script into head
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-checked-head", "true"); // AdSense verification attribute
    
    document.head.appendChild(script);

    // Cleanup function (though script should persist)
    return () => {
      // Don't remove on unmount - AdSense needs it to persist
    };
  }, [client]);

  return null; // This component doesn't render anything
}
