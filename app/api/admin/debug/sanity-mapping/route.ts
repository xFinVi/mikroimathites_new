import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { sanityClient } from "@/lib/sanity/client";
import { logger } from "@/lib/utils/logger";
import type { NextRequest } from "next/server";

/**
 * GET /api/admin/debug/sanity-mapping
 * Diagnostic endpoint to check category and age group mappings
 * Protected: Admin only
 */
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    topicMapping: {
      sleep: "ypnos-kai-routines",
      speech: "omilia-kai-lexilogio",
      food: "diatrofi",
      emotions: "synaisthimata",
      screens: "othones",
      routines: "routines",
      other: "allos",
    },
    ageGroupMapping: {
      "0_2": ["0-2-etwn"],
      "2_4": ["2-4-etwn"],
      "4_6": ["4-6-etwn"],
      other: [],
    },
  };

  if (!sanityClient) {
    return NextResponse.json({
      error: "Sanity client not configured",
      ...diagnostics,
    });
  }

  try {
    // Fetch all categories
    const categories = await sanityClient.fetch<Array<{
      _id: string;
      title: string;
      slug: { current: string };
    }>>(
      `*[_type == "category"]{_id, title, "slug": slug.current} | order(title asc)`
    );

    diagnostics.categories = {
      found: categories.length,
      items: categories,
      slugs: categories.map((c) => c.slug),
    };

    // Fetch all age groups
    const ageGroups = await sanityClient.fetch<Array<{
      _id: string;
      title: string;
      slug: { current: string };
    }>>(
      `*[_type == "ageGroup"]{_id, title, "slug": slug.current} | order(order asc, title asc)`
    );

    diagnostics.ageGroups = {
      found: ageGroups.length,
      items: ageGroups,
      slugs: ageGroups.map((ag) => ag.slug),
    };

    // Test mappings
    const mappingTests: Record<string, any> = {};

    // Test category mappings
    for (const [topic, expectedSlug] of Object.entries(diagnostics.topicMapping)) {
      const found = categories.find((c) => c.slug === expectedSlug);
      mappingTests[`topic:${topic}`] = {
        expectedSlug,
        found: !!found,
        categoryId: found?._id || null,
        categoryTitle: found?.title || null,
      };
    }

    // Test age group mappings
    for (const [ageGroup, expectedSlugs] of Object.entries(diagnostics.ageGroupMapping)) {
      const found = ageGroups.filter((ag) => expectedSlugs.includes(ag.slug));
      mappingTests[`ageGroup:${ageGroup}`] = {
        expectedSlugs,
        found: found.length,
        ageGroupIds: found.map((ag) => ag._id),
        ageGroupTitles: found.map((ag) => ag.title),
      };
    }

    diagnostics.mappingTests = mappingTests;

    return NextResponse.json(diagnostics);
  } catch (error) {
    logger.error("Failed to fetch Sanity data for mapping diagnostics", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        errorMessage: error instanceof Error ? error.message : String(error),
        ...diagnostics,
      },
      { status: 500 }
    );
  }
}

