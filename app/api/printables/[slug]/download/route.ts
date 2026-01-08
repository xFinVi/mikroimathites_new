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

    let fileUrl: string;
    
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
      fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileAsset.asset._ref}`;
    } else {
      fileUrl = asset.url;
    }

    // Fetch the PDF file from Sanity CDN
    const fileResponse = await fetch(fileUrl, {
      headers: {
        'Accept': 'application/pdf',
      },
    });
    
    if (!fileResponse.ok) {
      logger.error(`Failed to fetch file from Sanity: ${fileResponse.status} ${fileResponse.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 }
      );
    }

    // Get the file as an ArrayBuffer for proper streaming
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Get filename from asset or use slug
    const filename = asset?.originalFilename || `${slug}.pdf`;
    
    // Sanitize filename for Content-Disposition header
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Return the file with proper download headers
    // This forces the browser to download instead of navigate
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizedFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    logger.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}

