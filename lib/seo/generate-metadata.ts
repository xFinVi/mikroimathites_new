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

