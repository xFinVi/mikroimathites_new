import { createClient } from "next-sanity";
import { SANITY_PUBLIC } from "./config.public";

/**
 * Sanity Read Client
 * 
 * Used in: 
 * - lib/content/index.ts (primary data fetching)
 * - app/*/page.tsx (direct Server Component fetches)
 * - lib/utils/sanity.ts (reference lookups)
 * 
 * CDN: Enabled for performance
 * Caching: Requests automatically memoized by Next.js fetch cache
 * 
 * Safe for: Both server and client contexts (read-only, no secrets)
 */

// Gracefully handle missing config (log warning instead of throwing)
export const sanityClient = 
  SANITY_PUBLIC.projectId && SANITY_PUBLIC.dataset
    ? createClient({
        projectId: SANITY_PUBLIC.projectId,
        dataset: SANITY_PUBLIC.dataset,
        apiVersion: SANITY_PUBLIC.apiVersion,
        useCdn: true,
        token: process.env.SANITY_READ_TOKEN, // Optional read token
      })
    : null;

// Warn in development if not configured
if (!sanityClient && process.env.NODE_ENV === "development") {
  console.warn(
    "[Sanity] Client not configured. Check NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET"
  );
}

/**
 * Wrapper function to add timeout to Sanity fetch operations
 */
export async function fetchWithTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number = 20000, // 20 seconds default
  errorMessage: string = "Request timeout"
): Promise<T> {
  return Promise.race([
    fetchFn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}
