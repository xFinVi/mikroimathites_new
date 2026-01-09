"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

interface ConditionalAnalyticsProps {
  gaId?: string;
  adsenseClient?: string;
}

/**
 * Conditional Analytics Component
 * 
 * Respects cookie consent preferences:
 * - Google Analytics: only loads if analytics cookies are allowed
 * - Google AdSense: script always loads (for verification), but ads only initialize when advertising cookies are allowed
 * 
 * Uses Next.js Script component for optimal performance and automatic
 * page view tracking in Next.js App Router.
 */
export function ConditionalAnalytics({ gaId, adsenseClient }: ConditionalAnalyticsProps) {
  const { isCategoryAllowed, isLoading } = useCookieConsent();
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);
  const [shouldLoadAds, setShouldLoadAds] = useState(false);

  useEffect(() => {
    // Only load if cookies are allowed and not loading
    if (!isLoading) {
      setShouldLoadAnalytics(isCategoryAllowed("analytics"));
      setShouldLoadAds(isCategoryAllowed("advertising"));
    }
  }, [isLoading, isCategoryAllowed]);

  // Don't render anything if no IDs provided
  if (!gaId && !adsenseClient) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 - Manual Script implementation */}
      {gaId && shouldLoadAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: true });
            `}
          </Script>
        </>
      )}
      
      {/* Google AdSense script is loaded in layout.tsx head for verification */}
      {/* Ad initialization is handled in AdUnit components, which respect cookie consent */}
    </>
  );
}


