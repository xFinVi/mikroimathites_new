"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

interface GoogleAnalyticsManualProps {
  gaId?: string;
}

/**
 * Manual Google Analytics Implementation
 * 
 * This is the manual script approach (equivalent to the gtag.js script).
 * However, the @next/third-parties/google approach is recommended for better
 * Next.js optimization and automatic page view tracking.
 * 
 * This component respects cookie consent and only loads if analytics cookies are allowed.
 */
export function GoogleAnalyticsManual({ gaId }: GoogleAnalyticsManualProps) {
  const { isCategoryAllowed, isLoading } = useCookieConsent();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load GA if analytics cookies are allowed and not loading
    if (!isLoading && isCategoryAllowed("analytics")) {
      setShouldLoad(true);
    }
  }, [isLoading, isCategoryAllowed]);

  if (!gaId || !shouldLoad) {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) - Manual implementation */}
      <Script
        id="google-analytics-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}

