import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";

export async function GET() {
  try {
    // Fetch the raw section document without any transformations
    const rawSection = await sanityClient?.fetch(
      `*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]`
    );

    // Also fetch with the contentItems to see what we get
    const sectionWithItems = await sanityClient?.fetch(
      `*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]{
        _id,
        title,
        "contentItems": contentItems[]
      }`
    );

    // Fetch with resolved references
    const sectionWithResolved = await sanityClient?.fetch(
      `*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]{
        _id,
        title,
        "contentItems": contentItems[]{
          contentType,
          "activityRef": activity._ref,
          "activity": activity-> { _id, title, "slug": slug.current },
          "printableRef": printable._ref,
          "printable": printable-> { _id, title, "slug": slug.current }
        }
      }`
    );

    return NextResponse.json({
      rawSection: {
        _id: rawSection?._id,
        hasContentItems: !!rawSection?.contentItems,
        contentItemsLength: rawSection?.contentItems?.length || 0,
        contentItems: rawSection?.contentItems || [],
      },
      sectionWithItems: {
        _id: sectionWithItems?._id,
        title: sectionWithItems?.title,
        contentItemsLength: sectionWithItems?.contentItems?.length || 0,
        contentItems: sectionWithItems?.contentItems || [],
      },
      sectionWithResolved: {
        _id: sectionWithResolved?._id,
        title: sectionWithResolved?.title,
        contentItemsLength: sectionWithResolved?.contentItems?.length || 0,
        contentItems: sectionWithResolved?.contentItems || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to fetch raw Sanity data",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

