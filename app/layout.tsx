import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ConditionalAnalytics } from "@/components/analytics/conditional-analytics";
import { CookieConsentModal } from "@/components/cookies/cookie-consent-modal";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
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
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          {/* Conditional Analytics - respects cookie consent */}
          <ConditionalAnalytics gaId={gaId} adsenseClient={adsenseClient} />
          <CookieConsentModal />
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}

