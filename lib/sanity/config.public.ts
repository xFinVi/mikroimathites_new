/**
 * Sanity Public Configuration
 * Safe for: Client components, Server Components, Studio, build-time
 * 
 * No secrets in this file - projectId and dataset are public information
 */

export const SANITY_PUBLIC = {
  projectId: 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 
    process.env.SANITY_PROJECT_ID ?? 
    "",
  dataset: 
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 
    process.env.SANITY_DATASET ?? 
    "",
  apiVersion: 
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? 
    process.env.SANITY_API_VERSION ?? 
    "2024-03-01",
} as const;

/**
 * Validates public config - call this when you actually need Sanity,
 * not at import time
 */
export function assertSanityPublic() {
  const { projectId, dataset } = SANITY_PUBLIC;
  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity public configuration. " +
      "Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local"
    );
  }
  return SANITY_PUBLIC;
}


