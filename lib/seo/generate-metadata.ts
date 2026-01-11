/**
 * SEO Metadata Generator - Generates Next.js metadata for pages
 * 
 * Provides functions to generate SEO metadata (title, description, Open Graph, Twitter)
 * for different routes. Used by page components to set metadata for better SEO.
 */

import type { Metadata } from "next";
import { seoConfig, type SeoRouteKey } from "./config";

export function generateMetadataFor(routeKey: SeoRouteKey): Metadata {
  const cfg = seoConfig[routeKey];

  return {
    title: cfg.title,
    description: cfg.description,
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      images: cfg.ogImage ? [{ url: cfg.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: cfg.title,
      description: cfg.description,
      images: cfg.ogImage ? [cfg.ogImage] : undefined,
    },
  };
}

