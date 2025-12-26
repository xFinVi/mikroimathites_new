/**
 * Frontend utility functions for calculating article statistics
 * These work with PortableText data from Sanity
 */

import type { PortableTextBlock } from "@portabletext/types";

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
export function getImageRecommendation(wordCount: number): { min: number; max: number } {
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
export function getRecommendationMessage(
  wordCount: number,
  imageCount: number,
  hasCoverImage: boolean = true
): string {
  const recommendation = getImageRecommendation(wordCount);
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
  const recommendedImages = getImageRecommendation(wordCount);
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

