/**
 * Sanity Sync Utilities for Sponsors
 * 
 * Syncs sponsor data from Supabase to Sanity
 * - Logo is already in Sanity (uploaded during form submission)
 * - Gets asset ID from application
 * - Creates/updates document (idempotent by databaseId)
 */

import { getSanityWriteClient } from "@/lib/sanity/write-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

/**
 * Get Sanity asset ID from application
 * Logo is already uploaded to Sanity, we just need the asset ID
 */
async function getLogoAssetId(
  applicationId: string
): Promise<string | null> {
  if (!supabaseAdmin) {
    logger.error("Supabase admin client not configured");
    return null;
  }

  try {
    // Fetch application to get logo_storage_path (which contains Sanity asset ID)
    const { data: application, error } = await supabaseAdmin
      .from("sponsor_applications")
      .select("logo_storage_path")
      .eq("id", applicationId)
      .single();

    if (error || !application?.logo_storage_path) {
      logger.error("Error fetching application or logo asset ID:", error);
      return null;
    }

    // logo_storage_path contains the Sanity asset ID
    return application.logo_storage_path;
  } catch (error) {
    logger.error("Error getting logo asset ID:", error);
    return null;
  }
}

/**
 * Sync sponsor to Sanity (idempotent)
 * 
 * Process:
 * 1. Get logo asset ID from application (logo already in Sanity)
 * 2. Check if document exists (by databaseId)
 * 3. Create or update document
 * 4. Return Sanity document ID
 */
export async function syncSponsorToSanity(
  sponsorId: string
): Promise<{ success: boolean; sanityDocumentId?: string; error?: string }> {
  let sanityWriteClient;
  try {
    sanityWriteClient = getSanityWriteClient();
  } catch (error) {
    return {
      success: false,
      error: `Sanity write client not configured: ${error instanceof Error ? error.message : "Missing token"}`,
    };
  }

  if (!supabaseAdmin) {
    return {
      success: false,
      error: "Supabase admin client not configured",
    };
  }

  try {
    // Step 1: Fetch sponsor from database
    const { data: sponsor, error: fetchError } = await supabaseAdmin
      .from("sponsors")
      .select("*")
      .eq("id", sponsorId)
      .single();

    if (fetchError || !sponsor) {
      logger.error("Error fetching sponsor:", fetchError);
      return {
        success: false,
        error: "Sponsor not found",
      };
    }

    // Step 2: Get logo asset ID (logo is already in Sanity)
    let logoAssetId: string | null = null;
    if (sponsor.logo_url) {
      // Logo already synced - extract asset ID from existing document
      if (sponsor.sanity_document_id) {
        try {
          const existing = await sanityWriteClient.fetch(
            `*[_id == $sanityId][0]{ logo }`,
            { sanityId: sponsor.sanity_document_id }
          );
          if (existing?.logo?.asset?._ref) {
            logoAssetId = existing.logo.asset._ref;
          }
        } catch (error) {
          logger.warn("Failed to fetch existing logo from Sanity document", error);
        }
      }
    } else {
      // Get asset ID from application (stored in logo_storage_path)
      logoAssetId = await getLogoAssetId(sponsor.application_id);
      if (!logoAssetId) {
        return {
          success: false,
          error: "Logo asset ID not found",
        };
      }
    }

    // Step 3: Check if document exists (by databaseId)
    const databaseId = sponsor.id;
    const existingQuery = `*[_type == "sponsor" && databaseId == $databaseId][0]`;
    const existing = await sanityWriteClient.fetch(existingQuery, {
      databaseId,
    });

    // Step 4: Prepare document data (only safe fields)
    const documentData: {
      _type: "sponsor";
      databaseId: string;
      companyName: string;
      logo?: { _type: "image"; asset: { _type: "reference"; _ref: string } };
      website?: string;
      category?: string;
      tier: string;
      isActive: boolean;
      isFeatured: boolean;
    } = {
      _type: "sponsor",
      databaseId,
      companyName: sponsor.company_name,
      website: sponsor.website || undefined,
      category: sponsor.category || undefined,
      tier: sponsor.tier || "standard",
      isActive: sponsor.is_active ?? true,
      isFeatured: sponsor.is_featured ?? false,
    };

    // Add logo if available
    if (logoAssetId) {
      documentData.logo = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: logoAssetId,
        },
      };
    } else if (existing?.logo) {
      // Keep existing logo if no new upload
      documentData.logo = existing.logo;
    }

    // Step 5: Create or update document (idempotent)
    let sanityDocumentId: string;

    if (existing) {
      // Update existing document
      await sanityWriteClient
        .patch(existing._id)
        .set(documentData)
        .commit();
      sanityDocumentId = existing._id;
    } else {
      // Create new document
      const result = await sanityWriteClient.create(documentData);
      sanityDocumentId = result._id;
    }

    // Step 6: Update database with Sanity document ID and sync status
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
    
    await supabaseAdmin
      .from("sponsors")
      .update({
        sanity_document_id: sanityDocumentId,
        last_synced_to_sanity: new Date().toISOString(),
        sync_status: "synced",
        logo_url: logoAssetId && projectId && dataset
          ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${logoAssetId}`
          : null,
      })
      .eq("id", sponsorId);

    return {
      success: true,
      sanityDocumentId,
    };
  } catch (error) {
    logger.error("Error syncing sponsor to Sanity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

