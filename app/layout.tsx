/**
 * Root Layout - Wraps all pages with global providers and scripts
 * 
 * Sets up fonts (Inter, Poppins), analytics (GA, AdSense), cookie consent,
 * theme provider, and toast notifications. This is the top-level layout for the entire app.
 */

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ConditionalAnalytics } from "@/components/analytics/conditional-analytics";
import { AdSenseHeadScript } from "@/components/analytics/adsense-head-script";
import { CookieConsentModal } from "@/components/cookies/cookie-consent-modal";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// Get base URL for metadata
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Μικροί Μαθητές",
  description: "Parent Hub - Practical tips and activities for parents with children 0-6 years old",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {/* AdSense script - beforeInteractive strategy moves it to <head> automatically */}
        {adsenseClient && <AdSenseHeadScript client={adsenseClient} />}
        <Providers>
          {/* Conditional Analytics - respects cookie consent */}
          <ConditionalAnalytics gaId={gaId} />
          <CookieConsentModal />
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}

