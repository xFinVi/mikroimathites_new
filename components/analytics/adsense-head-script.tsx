import Script from "next/script";

interface AdSenseHeadScriptProps {
  client?: string;
}

/**
 * AdSense Head Script Component (Server Component)
 * 
 * Uses Next.js Script component with "beforeInteractive" strategy to ensure
 * the AdSense script is in the <head> tag and visible to Google's crawler
 * for site verification.
 * 
 * The "beforeInteractive" strategy:
 * - Injects the script into the initial HTML <head> during SSR
 * - Loads before the page becomes interactive
 * - Visible to crawlers (including Google AdSense verification)
 * 
 * This script is required for AdSense site verification and must be
 * loaded before ad units can be initialized.
 * 
 * Note: In Next.js App Router, beforeInteractive scripts are automatically
 * moved to the <head> even if placed in the body.
 */
export function AdSenseHeadScript({ client }: AdSenseHeadScriptProps) {
  if (!client) {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      strategy="beforeInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
