import { createClient } from "next-sanity";
import { logger } from "@/lib/utils/logger";

// Support both NEXT_PUBLIC_ (client-side) and non-prefixed (server-side) versions
// This matches the pattern used in sanity.config.ts
const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2024-03-01";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

if (!projectId || !dataset) {
  logger.warn("Sanity client not configured: missing SANITY_PROJECT_ID or SANITY_DATASET");
}

export const sanityClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: true, // set false if you need freshest drafts
        token, // optional; required for drafts/authed reads
      })
    : null;

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

