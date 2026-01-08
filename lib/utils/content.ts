/**
 * Content Utilities
 * Consolidated content-related helper functions
 * 
 * CLIENT-SAFE: All functions in this file are pure and can be used in client components
 * NO server-only dependencies (Node APIs, database calls, env vars)
 */

import type { PortableTextBlock } from "@portabletext/types";

// ============================================================================
// URL & TYPE UTILITIES
// Used in: components/articles/*, components/activities/*, app/*/page.tsx
// ============================================================================

/**
 * Type-safe content type definitions
 * Prevents typos and enables TypeScript exhaustiveness checking
 */
export type ContentType = 'article' | 'activity' | 'recipe' | 'printable';

/**
 * Builds the correct URL for a content item based on its type
 * @param contentType - The type of content (type-safe union)
 * @param slug - The slug of the content item
 * @returns The full URL path for the content item
 */
export function getContentUrl(contentType: ContentType, slug: string): string {
  switch (contentType) {
    case "article":
      return `/gia-goneis/${slug}`;
    case "activity":
      return `/drastiriotites/${slug}`;
    case "printable":
      return `/drastiriotites/printables/${slug}`;
    case "recipe":
      return `/gia-goneis/recipes/${slug}`;
    default: {
      // Exhaustiveness check - TypeScript will error if we miss a case
      const _exhaustive: never = contentType;
      return "#";
    }
  }
}

/**
 * Gets the Greek label for a content type
 * 
 * @param contentType - The content type (string or ContentType)
 * @returns The Greek label for the content type
 */
export function getContentTypeLabel(contentType: ContentType | string): string {
  switch (contentType) {
    case "article":
      return "Άρθρο";
    case "activity":
      return "Δραστηριότητα";
    case "printable":
      return "Εκτυπώσιμο";
    case "recipe":
      return "Συνταγή";
    default:
      return "Περιεχόμενο";
  }
}

// ============================================================================
// CATEGORY MAPPING
// Used in: app/gia-goneis/page.tsx, components/content/content-filters.tsx
// ============================================================================

/**
 * Category merge rules - maps a category slug to an array of slugs to include
 * Used when filtering content to show items from merged categories
 */
const CATEGORY_MERGE_RULES: Record<string, string[]> = {
  "diatrofi-epiloges": ["diatrofi-epiloges", "fysikes-syntages"],
  "texnes-xirotexnies": ["texnes-xirotexnies", "idees-paixnidiou"],
} as const;

/**
 * Categories that should be hidden from display (merged into other categories)
 */
const HIDDEN_CATEGORIES = ["fysikes-syntages", "idees-paixnidiou"] as const;

/**
 * Gets the array of category slugs to use when filtering content
 * Returns the merged categories if a merge rule exists, otherwise returns the single slug
 * 
 * @param categorySlug - The category slug to map
 * @returns Array of category slugs to include in the filter
 */
export function getMappedCategories(categorySlug: string): string[] {
  return CATEGORY_MERGE_RULES[categorySlug] ?? [categorySlug];
}

/**
 * Checks if a category should be hidden from display
 * 
 * @param categorySlug - The category slug to check
 * @returns True if the category should be hidden
 */
export function shouldHideCategory(categorySlug: string): boolean {
  return (HIDDEN_CATEGORIES as readonly string[]).includes(categorySlug);
}

/**
 * Gets the display name for a category
 * Only provides overrides for merged categories that need different display names
 * All other categories should use their CMS title
 * 
 * @param categorySlug - The category slug
 * @param cmsTitle - The title from CMS (preferred source)
 * @returns The display name to use
 */
export function getCategoryDisplayName(
  categorySlug: string,
  cmsTitle?: string
): string {
  // Only special overrides for merged categories
  const displayOverrides: Record<string, string> = {
    "diatrofi-epiloges": "Διατροφή & Συνταγές",
    "texnes-xirotexnies": "Δραστηριότητες & Παιχνίδια",
  };
  
  // Use override if exists, otherwise use CMS title, fallback to slug
  return displayOverrides[categorySlug] ?? cmsTitle ?? categorySlug;
}

// ============================================================================
// ARTICLE STATISTICS
// Used in: components/articles/article-stats.tsx, sanity/schemas/utils/image-recommendations.ts
// ============================================================================

export interface ArticleStats {
  wordCount: number;
  imageCount: number;
  totalImages: number; // includes cover image
  recommendedImages: {
    min: number;
    max: number;
  };
  meetsRecommendation: boolean;
  recommendationMessage: string;
}

/**
 * Count words in PortableText body
 */
export function countWordsInPortableText(body: unknown): number {
  if (!body || !Array.isArray(body)) return 0;

  let words = 0;
  const blocks = body as PortableTextBlock[];

  blocks.forEach((block) => {
    if (block._type === "block" && "children" in block && Array.isArray(block.children)) {
      block.children.forEach((child: any) => {
        if (child.text && typeof child.text === "string") {
          const textWords = child.text
            .trim()
            .split(/\s+/)
            .filter((w: string) => w.length > 0);
          words += textWords.length;
        }
      });
    }
  });

  return words;
}

/**
 * Count images in PortableText body
 */
export function countImagesInPortableText(body: unknown): number {
  if (!body || !Array.isArray(body)) return 0;

  const blocks = body as PortableTextBlock[];
  return blocks.filter((block) => block._type === "image").length;
}

/**
 * Calculate recommended images based on word count
 */
export function getImageRecommendation(wordCount: number): { 
  recommended: number;
  minimum: number;
  optimal: number;
  status: 'low' | 'good' | 'excellent';
} {
  const baseRec = getImageRecommendationMinMax(wordCount);
  return {
    recommended: baseRec.min,
    minimum: baseRec.min,
    optimal: baseRec.max,
    status: 'good' as const, // Default status
  };
}

/**
 * Internal helper for min/max image recommendation
 */
function getImageRecommendationMinMax(wordCount: number): { min: number; max: number } {
  if (wordCount === 0) return { min: 1, max: 1 };
  if (wordCount <= 300) return { min: 1, max: 1 };
  if (wordCount <= 600) return { min: 2, max: 2 };
  if (wordCount <= 1000) return { min: 3, max: 4 };
  if (wordCount <= 1500) return { min: 5, max: 6 };
  if (wordCount <= 2000) return { min: 7, max: 8 };
  // For 2000+ words: 1 image per 200-250 words
  const baseCount = Math.ceil(wordCount / 250);
  return { min: baseCount, max: baseCount + 2 };
}

/**
 * Get recommendation message
 */
function getRecommendationMessage(
  wordCount: number,
  imageCount: number,
  hasCoverImage: boolean = true
): string {
  const recommendation = getImageRecommendationMinMax(wordCount);
  const totalImages = imageCount + (hasCoverImage ? 1 : 0);

  if (totalImages < recommendation.min) {
    const needed = recommendation.min - totalImages;
    return `Συνιστάται ${recommendation.min}${
      recommendation.max > recommendation.min ? `-${recommendation.max}` : ""
    } εικόνες. Προσθέστε ${needed} ακόμα.`;
  }

  if (totalImages >= recommendation.min && totalImages < recommendation.max) {
    return `Έχετε ${totalImages} εικόνες (${recommendation.min}-${recommendation.max} συνιστάται).`;
  }

  return `Εξαιρετικά! Έχετε ${totalImages} εικόνες.`;
}

/**
 * Calculate complete article statistics
 */
export function calculateArticleStats(
  body: unknown,
  hasCoverImage: boolean = true
): ArticleStats {
  const wordCount = countWordsInPortableText(body);
  const imageCount = countImagesInPortableText(body);
  const totalImages = imageCount + (hasCoverImage ? 1 : 0);
  const recommendedImages = getImageRecommendationMinMax(wordCount);
  const meetsRecommendation = totalImages >= recommendedImages.min;
  const recommendationMessage = getRecommendationMessage(wordCount, imageCount, hasCoverImage);

  return {
    wordCount,
    imageCount,
    totalImages,
    recommendedImages,
    meetsRecommendation,
    recommendationMessage,
  };
}

/**
 * Format word count for display
 */
export function formatWordCount(count: number): string {
  if (count < 1000) {
    return `${count} λέξεις`;
  }
  return `${(count / 1000).toFixed(1)}K λέξεις`;
}

/**
 * Estimate reading time from word count (average 200 words per minute)
 */
export function estimateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}


