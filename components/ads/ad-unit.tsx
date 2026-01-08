"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Google AdSense Ad Unit Component
 * 
 * Displays a Google AdSense ad unit. Only renders if:
 * - Advertising cookies are allowed
 * - AdSense client ID is configured
 * 
 * Usage:
 * <AdUnit slot="1234567890" format="auto" />
 */
export function AdUnit({ 
  slot, 
  format = "auto",
  style,
  className = ""
}: AdUnitProps) {
  const { isCategoryAllowed, isLoading } = useCookieConsent();
  const [isInitialized, setIsInitialized] = useState(false);
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    // Only initialize if ads are allowed and not loading
    if (isLoading || !isCategoryAllowed("advertising") || !adsenseClient) {
      return;
    }

    // Wait for adsbygoogle to be available
    const initAd = () => {
      try {
        if (window.adsbygoogle && !isInitialized) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsInitialized(true);
        }
      } catch (error) {
        // Silently fail if ads can't load (e.g., ad blocker)
      }
    };

    // Try to initialize immediately
    initAd();

    // If not ready, wait a bit and try again
    if (!window.adsbygoogle) {
      const timer = setTimeout(initAd, 100);
      return () => clearTimeout(timer);
    }
  }, [isCategoryAllowed, isLoading, adsenseClient, isInitialized]);

  // Don't render if ads not allowed, loading, or no client ID
  if (isLoading || !isCategoryAllowed("advertising") || !adsenseClient) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client={adsenseClient}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}



