/**
 * SEO Metadata Generator - Generates Next.js metadata for pages
 *
 * Provides functions to generate SEO metadata (title, description, Open Graph, Twitter)
 * for different routes. Used by page components to set metadata for better SEO.
 *
 * Titles in seoConfig are unbranded; the root layout's title template appends the
 * "| Μικροί Μαθητές" suffix. The home title is emitted as absolute to avoid doubling.
 */

import type { Metadata } from "next";
import { seoConfig, SITE_NAME, type SeoRouteKey } from "./config";

export function generateMetadataFor(routeKey: SeoRouteKey): Metadata {
  const cfg = seoConfig[routeKey];
  const isHome = routeKey === "home";
  const brandedTitle = isHome ? cfg.title : `${cfg.title} | ${SITE_NAME}`;

  return {
    title: isHome ? { absolute: cfg.title } : cfg.title,
    description: cfg.description,
    alternates: cfg.path ? { canonical: cfg.path } : undefined,
    openGraph: {
      // Page-level openGraph replaces the root layout's, so repeat site info here
      type: "website",
      siteName: SITE_NAME,
      locale: "el_GR",
      title: brandedTitle,
      description: cfg.description,
      url: cfg.path ?? undefined,
      images: cfg.ogImage ? [{ url: cfg.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description: cfg.description,
      images: cfg.ogImage ? [cfg.ogImage] : undefined,
    },
  };
}
