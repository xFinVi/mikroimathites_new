import "server-only"; // Prevent accidental client-side usage

/**
 * Sanity CMS Utilities (SERVER-ONLY)
 * 
 * Used in: app/api/admin/submissions/[id]/send-reply/route.ts
 * 
 * These functions make database queries and must only run server-side.
 * 
 * Decision: Keep in lib/utils/ - follows current codebase structure.
 * If usage expands significantly beyond admin API, consider moving to lib/sanity/utils.ts
 */

import { sanityClient } from "@/lib/sanity/client";
import { logger } from "@/lib/utils/logger";

/**
 * Map topic string to Sanity category ID
 * Returns the category _id if found, null otherwise
 */
export async function getCategoryIdByTopic(topic: string | null): Promise<string | null> {
  if (!topic || !sanityClient) return null;

  try {
    // Map topic to potential category slugs
    const topicToSlugMap: Record<string, string> = {
      sleep: "ypnos-kai-routines",
      speech: "omilia-kai-lexilogio",
      food: "diatrofi",
      emotions: "synaisthimata",
      screens: "othones",
      routines: "routines",
      other: "allos",
    };

    const slug = topicToSlugMap[topic];
    if (!slug) return null;

    const result = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug }
    );

    // Validate that we got a valid result with an _id
    if (!result || !result._id) {
      logger.warn(`Category not found in Sanity for topic: ${topic}, slug: ${slug}`);
      return null;
    }

    return result._id;
  } catch (error) {
    logger.error("Failed to get category ID by topic", error);
    return null;
  }
}

/**
 * Map age group string to Sanity ageGroup IDs
 * Returns array of ageGroup _id values
 */
export async function getAgeGroupIdsByAgeGroup(
  ageGroup: string | null
): Promise<string[]> {
  if (!ageGroup || !sanityClient) return [];

  try {
    // Map database age group to potential age group slugs
    const ageGroupToSlugMap: Record<string, string[]> = {
      "0_2": ["0-2-etwn"],
      "2_4": ["2-4-etwn"],
      "4_6": ["4-6-etwn"],
      other: [], // No specific mapping
    };

    const slugs = ageGroupToSlugMap[ageGroup];
    if (!slugs || slugs.length === 0) return [];

    const ageGroups = await sanityClient.fetch<Array<{ _id: string }>>(
      `*[_type == "ageGroup" && slug.current in $slugs]`,
      { slugs }
    );

    // Validate results and extract _id values
    if (!ageGroups || !Array.isArray(ageGroups)) {
      logger.warn(`Age groups not found in Sanity for ageGroup: ${ageGroup}, slugs: ${slugs.join(", ")}`);
      return [];
    }

    // Extract _id values and validate they exist
    const validIds = ageGroups
      .filter((ag) => ag && ag._id)
      .map((ag) => ag._id);

    if (validIds.length === 0 && slugs.length > 0) {
      logger.warn(`No valid age group IDs found for ageGroup: ${ageGroup}`);
    }

    return validIds;
  } catch (error) {
    logger.error("Failed to get age group IDs", error);
    return [];
  }
}

/**
 * Convert plain text answer to PortableText format
 */
export function textToPortableText(text: string): any[] {
  return [
    {
      _type: "block",
      _key: "answer-block",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "answer-span",
          text: text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];
}

