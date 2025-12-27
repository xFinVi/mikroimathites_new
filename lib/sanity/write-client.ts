import { createClient } from "next-sanity";
import { logger } from "@/lib/utils/logger";

// Support both NEXT_PUBLIC_ (client-side) and non-prefixed (server-side) versions
// This matches the pattern used in sanity.config.ts
const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2024-03-01";
// Use SANITY_TOKEN as primary, fallback to SANITY_WRITE_TOKEN
const writeToken = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) {
  logger.warn("Sanity write client not configured: missing SANITY_PROJECT_ID or SANITY_DATASET");
}

if (!writeToken) {
  logger.warn("Sanity write client not configured: missing SANITY_TOKEN or SANITY_WRITE_TOKEN");
}

/**
 * Sanity client with write permissions for admin operations.
 * 
 * This client is used for:
 * - Publishing Q&A items from submissions
 * - Creating/updating content programmatically
 * 
 * IMPORTANT: This client should only be used in authenticated admin API routes.
 * Never expose the write token to the client-side.
 */
export const sanityWriteClient =
  projectId && dataset && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false, // Don't use CDN for writes (need fresh data)
        token: writeToken, // Required for write operations
      })
    : null;

/**
 * Helper function to create a DRAFT qaItem in Sanity from a submission
 * This creates a draft that admin can review and publish from Sanity Studio
 * 
 * Note: Drafts don't have publishedAt set - admin sets this when publishing from Studio
 * 
 * @param data - Draft data including question, answer, and optional references
 * @param existingDraftId - Optional existing draft ID to check before creating
 * @returns Sanity document ID or null if creation failed
 */
export async function createQADraftInSanity(
  data: {
    question: string;
    answer: any; // PortableText content
    categoryId?: string;
    ageGroupIds?: string[];
  },
  existingDraftId?: string | null
): Promise<string | null> {
  if (!sanityWriteClient) {
    const missing = [];
    const hasProjectId =
      !!process.env.SANITY_PROJECT_ID ||
      !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const hasDataset =
      !!process.env.SANITY_DATASET || !!process.env.NEXT_PUBLIC_SANITY_DATASET;
    const hasToken =
      !!process.env.SANITY_TOKEN || !!process.env.SANITY_WRITE_TOKEN;

    if (!hasProjectId)
      missing.push("SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID");
    if (!hasDataset)
      missing.push("SANITY_DATASET or NEXT_PUBLIC_SANITY_DATASET");
    if (!hasToken) missing.push("SANITY_TOKEN or SANITY_WRITE_TOKEN");

    logger.error("Sanity write client not configured", {
      missing,
      hasProjectId,
      hasDataset,
      hasToken,
      checkedVars: {
        SANITY_PROJECT_ID: !!process.env.SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_PROJECT_ID:
          !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        SANITY_DATASET: !!process.env.SANITY_DATASET,
        NEXT_PUBLIC_SANITY_DATASET: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_TOKEN: !!process.env.SANITY_TOKEN,
        SANITY_WRITE_TOKEN: !!process.env.SANITY_WRITE_TOKEN,
      },
    });
    return null;
  }

  // If existing draft ID is provided, verify it still exists in Sanity
  if (existingDraftId) {
    try {
      const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
        `*[_id == $id][0]`,
        { id: existingDraftId }
      );
      if (existing && existing._id) {
        logger.info("Draft already exists in Sanity, skipping creation", { id: existingDraftId });
        return existingDraftId;
      }
      logger.warn("Existing draft ID provided but document not found in Sanity, creating new draft", {
        providedId: existingDraftId,
      });
    } catch (error) {
      logger.warn("Failed to verify existing draft, creating new one", { error, existingDraftId });
    }
  }

  try {
    // Validate category reference if provided
    if (data.categoryId) {
      try {
        const categoryExists = await sanityWriteClient.fetch<{ _id: string } | null>(
          `*[_id == $id][0]`,
          { id: data.categoryId }
        );
        if (!categoryExists || !categoryExists._id) {
          logger.warn(`Category reference not found in Sanity: ${data.categoryId}, creating draft without category`);
          data.categoryId = undefined;
        }
      } catch (error) {
        logger.warn("Failed to validate category reference", { error, categoryId: data.categoryId });
        data.categoryId = undefined;
      }
    }

    // Validate age group references if provided
    if (data.ageGroupIds && data.ageGroupIds.length > 0) {
      try {
        const validAgeGroupIds: string[] = [];
        for (const ageGroupId of data.ageGroupIds) {
          const ageGroupExists = await sanityWriteClient.fetch<{ _id: string } | null>(
            `*[_id == $id][0]`,
            { id: ageGroupId }
          );
          if (ageGroupExists && ageGroupExists._id) {
            validAgeGroupIds.push(ageGroupId);
          } else {
            logger.warn(`Age group reference not found in Sanity: ${ageGroupId}`);
          }
        }
        data.ageGroupIds = validAgeGroupIds.length > 0 ? validAgeGroupIds : undefined;
      } catch (error) {
        logger.warn("Failed to validate age group references", { error, ageGroupIds: data.ageGroupIds });
        data.ageGroupIds = undefined;
      }
    }

    const document = {
      _type: "qaItem",
      question: data.question,
      answer: data.answer,
      // Don't set publishedAt - this keeps it as a draft
      // Admin will set publishedAt when publishing from Sanity Studio
      // Note: We don't include user names for privacy reasons
      ...(data.categoryId && {
        category: {
          _type: "reference",
          _ref: data.categoryId,
        },
      }),
      ...(data.ageGroupIds && data.ageGroupIds.length > 0 && {
        ageGroups: data.ageGroupIds.map((id) => ({
          _type: "reference",
          _ref: id,
        })),
      }),
    };

    // Create as draft (Sanity creates drafts by default with create())
    logger.info("Attempting to create document in Sanity", {
      documentType: document._type,
      hasCategory: !!document.category,
      categoryRef: document.category ? { _type: document.category._type, _ref: document.category._ref } : null,
      hasAgeGroups: !!document.ageGroups && document.ageGroups.length > 0,
      ageGroupRefs: document.ageGroups ? document.ageGroups.map((ag: any) => ({ _type: ag._type, _ref: ag._ref })) : null,
      ageGroupCount: document.ageGroups?.length || 0,
    });
    
    const result = await sanityWriteClient.create(document);
    
    if (!result || !result._id) {
      logger.error("Sanity create() returned invalid result", { result });
      return null;
    }
    
    logger.info("✅ Created Q&A draft in Sanity", { 
      id: result._id,
      documentId: result._id,
    });
    return result._id;
  } catch (error) {
    logger.error("❌ Failed to create Q&A draft in Sanity", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorDetails: error instanceof Error ? {
        name: error.name,
        message: error.message,
      } : error,
    });
    return null;
  }
}


