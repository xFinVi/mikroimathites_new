import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

export async function GET() {
  if (!sanityClient) {
    return NextResponse.json(
      {
        success: false,
        error: "Sanity client not configured",
        config: {
          projectId: process.env.SANITY_PROJECT_ID || "MISSING",
          dataset: process.env.SANITY_DATASET || "MISSING",
          hasToken: !!process.env.SANITY_TOKEN,
        },
      },
      { status: 500 }
    );
  }

  try {
    // Test query - fetch first activity
    const activities = await sanityClient.fetch(
      `*[_type == "activity"][0...1]`
    );

    return NextResponse.json({
      success: true,
      message: "Sanity connection successful!",
      config: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        hasToken: !!process.env.SANITY_TOKEN,
      },
      data: {
        activitiesFound: activities.length,
        sample: activities[0]?.title || "No activities yet",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        config: {
          projectId: process.env.SANITY_PROJECT_ID,
          dataset: process.env.SANITY_DATASET,
          hasToken: !!process.env.SANITY_TOKEN,
        },
        hint:
          errorMessage.includes("401") || errorMessage.includes("403")
            ? "Check your SANITY_TOKEN - it might be invalid. Get a new token from https://sanity.io/manage"
            : "Check your project ID and dataset name",
      },
      { status: 500 }
    );
  }
}


