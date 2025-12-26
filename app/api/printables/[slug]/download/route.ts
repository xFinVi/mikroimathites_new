import { NextRequest, NextResponse } from "next/server";
import { getPrintableBySlug } from "@/lib/content";
import { sanityClient } from "@/lib/sanity/client";
import { logger } from "@/lib/utils/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const printable = await getPrintableBySlug(slug);

    if (!printable || !printable.file) {
      return NextResponse.json(
        { error: "Printable not found or no file available" },
        { status: 404 }
      );
    }

    // Get file asset reference
    const fileAsset = printable.file as { asset?: { _ref?: string; _type?: string } };
    if (!fileAsset?.asset?._ref) {
      return NextResponse.json(
        { error: "File asset not found" },
        { status: 404 }
      );
    }

    // Fetch the asset document from Sanity to get the URL
    const assetId = fileAsset.asset._ref.replace(/^(file-|image-)/, "");
    const asset = await sanityClient?.fetch(
      `*[_id == $assetId][0]{ url, originalFilename }`,
      { assetId: fileAsset.asset._ref }
    );

    if (!asset?.url) {
      // Fallback: construct URL manually
      const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;

      if (!projectId || !dataset) {
        return NextResponse.json(
          { error: "Sanity configuration missing" },
          { status: 500 }
        );
      }

      // Sanity file URL format: https://cdn.sanity.io/files/{projectId}/{dataset}/{assetRef}
      const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileAsset.asset._ref}`;
      return NextResponse.json({ url: fileUrl });
    }

    return NextResponse.json({ url: asset.url });
  } catch (error) {
    logger.error("Error generating file URL:", error);
    return NextResponse.json(
      { error: "Failed to generate file URL" },
      { status: 500 }
    );
  }
}

