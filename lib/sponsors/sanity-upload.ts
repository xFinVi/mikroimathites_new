/**
 * Direct Sanity Asset Upload
 * 
 * Simplest approach: Upload logo directly to Sanity Assets
 * No Supabase Storage bucket needed for MVP
 */

import { getSanityWriteClient } from "@/lib/sanity/write-client";
import { logger } from "@/lib/utils/logger";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

/**
 * Upload image directly to Sanity Assets
 * Returns Sanity asset reference ID
 */
export async function uploadImageToSanity(
  file: File | Blob,
  filename?: string
): Promise<{ assetId: string; url: string } | null> {
  let sanityWriteClient;
  try {
    sanityWriteClient = getSanityWriteClient();
  } catch (error) {
    logger.error("Sanity write client not configured:", error);
    return null;
  }

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    logger.error(`Invalid MIME type: ${file.type}`);
    return null;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    logger.error(`File size too large: ${file.size} bytes`);
    return null;
  }

  try {
    // Convert File/Blob to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert to Buffer (Node.js) or Uint8Array (Edge)
    const buffer = typeof Buffer !== "undefined" 
      ? Buffer.from(arrayBuffer)
      : new Uint8Array(arrayBuffer);

    // Upload to Sanity Assets
    const asset = await sanityWriteClient.assets.upload("image", buffer, {
      filename: filename || `sponsor-logo-${Date.now()}.${file.type.split("/")[1]}`,
      contentType: file.type,
    });

    // Generate CDN URL
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
    
    const url = projectId && dataset
      ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset._id}`
      : asset.url;

    return {
      assetId: asset._id,
      url,
    };
  } catch (error) {
    logger.error("Error uploading image to Sanity:", error);
    return null;
  }
}

