import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Builds a URL for a Sanity image
 * @param source - Sanity image source (from a field like `coverImage`)
 * @returns Image URL builder instance (chain methods like `.width()`, `.height()`, `.url()`)
 */
export function urlFor(source: SanityImageSource) {
  if (!sanityClient) {
    console.warn("Sanity client not configured, image URL builder may not work");
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

