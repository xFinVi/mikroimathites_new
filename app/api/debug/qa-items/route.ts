import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { qaItemsQuery } from "@/lib/sanity/queries";

/**
 * GET /api/debug/qa-items
 * Debug endpoint to check what Q&A items are being fetched
 */
export async function GET() {
  if (!sanityClient) {
    return NextResponse.json({
      error: "Sanity client not configured",
    });
  }

  try {
    // Fetch published Q&A items
    const publishedItems = await sanityClient.fetch(qaItemsQuery);

    // Also fetch ALL qaItems (including drafts) for comparison
    const allItems = await sanityClient.fetch(
      `*[_type == "qaItem"]{_id, question, publishedAt, "isDraft": _id in path("drafts.**")} | order(_createdAt desc)`
    );

    return NextResponse.json({
      publishedItems: {
        count: publishedItems.length,
        items: publishedItems,
      },
      allItems: {
        count: allItems.length,
        items: allItems,
      },
      query: qaItemsQuery,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch Q&A items",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

