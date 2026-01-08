import { createClient } from "next-sanity";
import { SANITY_PUBLIC } from "./config.public";
import { logger } from "@/lib/utils/logger";

/**
 * Sanity Write Client
 * 
 * Used for:
 * - Uploading assets (images, files)
 * - Creating/updating documents
 * - Mutations (create, patch, delete)
 * 
 * Requires: SANITY_WRITE_TOKEN (server-only, never expose to client)
 * 
 * CDN: Disabled (write operations don't use CDN)
 * Caching: Disabled (write operations bypass cache)
 */

const writeToken = process.env.SANITY_WRITE_TOKEN?.trim();

export const sanityWriteClient =
  SANITY_PUBLIC.projectId &&
  SANITY_PUBLIC.dataset &&
  writeToken
    ? createClient({
        projectId: SANITY_PUBLIC.projectId,
        dataset: SANITY_PUBLIC.dataset,
        apiVersion: SANITY_PUBLIC.apiVersion,
        useCdn: false, // Write operations don't use CDN
        token: writeToken,
      })
    : null;

// Warn in development if not configured
if (!sanityWriteClient && process.env.NODE_ENV === "development") {
  logger.warn(
    "[Sanity] Write client not configured. Check SANITY_WRITE_TOKEN"
  );
}

