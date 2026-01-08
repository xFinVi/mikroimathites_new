/**
 * Generate signed upload URLs for Supabase Storage
 */

import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

const BUCKET_NAME = "sponsor-logos";
const UPLOAD_EXPIRY_SECONDS = 3600; // 1 hour

/**
 * Generate a signed upload URL for a file
 * @param fileName - Original filename
 * @param mimeType - MIME type of the file
 * @param fileSize - File size in bytes
 * @returns Object with uploadUrl and storagePath
 */
export async function generateSignedUploadUrl(
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<{ uploadUrl: string; storagePath: string } | null> {
  if (!supabaseAdmin) {
    logger.error("Supabase admin client not configured");
    return null;
  }

  // Validate file type
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
  ];
  if (!allowedMimeTypes.includes(mimeType)) {
    logger.error(`Invalid MIME type: ${mimeType}`);
    return null;
  }

  // Validate file size (5MB max)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (fileSize > MAX_FILE_SIZE) {
    logger.error(`File size too large: ${fileSize} bytes`);
    return null;
  }

  // Generate unique storage path
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split(".").pop() || "png";
  const storagePath = `pending/${timestamp}_${random}.${extension}`;

  try {
    // Generate signed upload URL
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(storagePath, {
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      logger.error("Error generating signed upload URL:", error);
      return null;
    }

    if (!data?.signedUrl) {
      logger.error("No signed URL returned from Supabase");
      return null;
    }

    return {
      uploadUrl: data.signedUrl,
      storagePath,
    };
  } catch (error) {
    logger.error("Exception generating signed upload URL:", error);
    return null;
  }
}

/**
 * Generate a signed download URL for viewing a file (admin only)
 * @param storagePath - Path to file in storage
 * @param expiresIn - Expiry time in seconds (default: 1 hour)
 * @returns Signed URL or null
 */
export async function generateSignedDownloadUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!supabaseAdmin) {
    logger.error("Supabase admin client not configured");
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      logger.error("Error generating signed download URL:", error);
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    logger.error("Exception generating signed download URL:", error);
    return null;
  }
}

