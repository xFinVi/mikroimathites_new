import { NextRequest, NextResponse } from "next/server";
import { generateSignedUploadUrl } from "@/lib/storage/signed-urls";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/sponsors/upload-url
 * Generate a signed upload URL for logo file
 * 
 * Body:
 * {
 *   fileName: string,
 *   mimeType: string,
 *   fileSize: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, mimeType, fileSize } = body;

    // Validation
    if (!fileName || !mimeType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, mimeType, fileSize" },
        { status: 400 }
      );
    }

    // Generate signed upload URL
    const result = await generateSignedUploadUrl(fileName, mimeType, fileSize);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate upload URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadUrl: result.uploadUrl,
      storagePath: result.storagePath,
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    logger.error("Error in upload-url route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

