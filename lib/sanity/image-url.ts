import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { logger } from "@/lib/utils/logger";

/**
 * Builds a URL for a Sanity image
 * @param source - Sanity image source (from a field like `coverImage`)
 * @returns Image URL builder instance (chain methods like `.width()`, `.height()`, `.url()`)
 */
export function urlFor(source: SanityImageSource) {
  if (!sanityClient) {
    logger.warn("Sanity client not configured, image URL builder may not work");
    // Return a dummy builder that will fail gracefully
    const dummyBuilder = createImageUrlBuilder({
      projectId: "",
      dataset: "",
    });
    return dummyBuilder.image(source);
  }
  const builder = createImageUrlBuilder(sanityClient);
  return builder.image(source);
}

/**
 * Generates an image URL with specified dimensions
 * @param image - Sanity image source (from a field like `coverImage`)
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Image URL string or null if image is missing or invalid
 */
export function generateImageUrl(
  image: unknown,
  width: number,
  height: number
): string | null {
  if (!image) return null;
  try {
    return urlFor(image as SanityImageSource).width(width).height(height).url();
  } catch {
    return null;
  }
}

/**
 * Generates a file URL for Sanity file assets (PDFs, etc.)
 * @param file - Sanity file asset (from a field like `file`)
 * @returns File URL string or null if file is missing or invalid
 */
export function generateFileUrl(file: unknown): string | null {
  if (!file) return null;
  try {
    // For files, we can use urlFor but without image-specific transformations
    const fileAsset = file as { asset?: { _ref?: string; _type?: string } };
    if (!fileAsset?.asset?._ref) return null;
    
    // Extract asset ID from ref (format: "file-{assetId}-{extension}")
    const assetRef = fileAsset.asset._ref;
    const assetId = assetRef.replace(/^file-/, "").replace(/-\w+$/, "");
    
    // Get project ID and dataset from environment
    const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
    
    if (!projectId || !dataset) {
      logger.warn("Sanity project ID or dataset not configured for file URL generation");
      return null;
    }
    
    // Construct CDN URL for file
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetRef}`;
  } catch (error) {
    logger.error("Error generating file URL:", error);
    return null;
  }
}

