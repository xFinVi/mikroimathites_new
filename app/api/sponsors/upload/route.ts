import { NextRequest, NextResponse } from "next/server";
import { uploadImageToSanity } from "@/lib/sponsors/sanity-upload";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/sponsors/upload
 * Upload logo directly to Sanity Assets
 * 
 * Body: FormData with file
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload to Sanity
    const result = await uploadImageToSanity(file, file.name);

    if (!result) {
      // Check if it's a configuration issue
      const writeToken = process.env.SANITY_WRITE_TOKEN?.trim();
      if (!writeToken) {
        logger.error("SANITY_WRITE_TOKEN is not configured");
        return NextResponse.json(
          { 
            error: "Server configuration error: SANITY_WRITE_TOKEN is missing. Please configure it in .env.local",
            code: "MISSING_TOKEN"
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to upload image. Please check server logs." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assetId: result.assetId,
      url: result.url,
    });
  } catch (error) {
    logger.error("Error in upload route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

