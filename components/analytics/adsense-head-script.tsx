"use client";

import { useEffect } from "react";

interface AdSenseHeadScriptProps {
  client?: string;
}

/**
 * Injects the Google AdSense script directly into the document head.
 * This is necessary for AdSense verification and to avoid issues with
 * Next.js Script component adding `data-nscript` attributes, which AdSense
 * does not support.
 *
 * The script is always loaded for verification, but ad initialization
 * still respects user consent via the ConditionalAnalytics component.
 */
export function AdSenseHeadScript({ client }: AdSenseHeadScriptProps) {
  useEffect(() => {
    if (client && typeof window !== "undefined" && !document.querySelector(`script[src*="adsbygoogle.js?client=${client}"]`)) {
      const script = document.createElement("script");
      script.id = "adsense-init-manual";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      // Clean up on component unmount (though for head scripts, this is less critical)
      return () => {
        const existingScript = document.getElementById("adsense-init-manual");
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [client]);

  return null; // This component doesn't render any visible UI
}
