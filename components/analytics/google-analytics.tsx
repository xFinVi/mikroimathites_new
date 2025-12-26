"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
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
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

