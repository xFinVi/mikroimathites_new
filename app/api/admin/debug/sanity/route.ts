import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { sanityWriteClient } from "@/lib/sanity/write-client";
import { logger } from "@/lib/utils/logger";
import type { NextRequest } from "next/server";

/**
 * GET /api/admin/debug/sanity
 * Diagnostic endpoint to check Sanity write client configuration
 * Protected: Admin only
 */
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin(request);
  if (authCheck) return authCheck;

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: {
      hasProjectId:
        !!(
          process.env.SANITY_PROJECT_ID ||
          process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        ),
      hasDataset:
        !!(
          process.env.SANITY_DATASET ||
          process.env.NEXT_PUBLIC_SANITY_DATASET
        ),
      hasToken: !!(
        process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
      ),
      projectId:
        process.env.SANITY_PROJECT_ID ||
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
          ? "***" +
            (
              process.env.SANITY_PROJECT_ID ||
              process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
            )?.slice(-4)
          : null,
      dataset:
        process.env.SANITY_DATASET ||
        process.env.NEXT_PUBLIC_SANITY_DATASET ||
        null,
      tokenType: process.env.SANITY_TOKEN
        ? "SANITY_TOKEN"
        : process.env.SANITY_WRITE_TOKEN
        ? "SANITY_WRITE_TOKEN"
        : null,
      apiVersion:
        process.env.SANITY_API_VERSION ||
        process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
        "2024-03-01",
      vars: {
        SANITY_PROJECT_ID: !!process.env.SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_PROJECT_ID:
          !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        SANITY_DATASET: !!process.env.SANITY_DATASET,
        NEXT_PUBLIC_SANITY_DATASET: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_TOKEN: !!process.env.SANITY_TOKEN,
        SANITY_WRITE_TOKEN: !!process.env.SANITY_WRITE_TOKEN,
      },
    },
    client: {
      isConfigured: !!sanityWriteClient,
    },
  };

  // Test Sanity connection if client is configured
  if (sanityWriteClient) {
    try {
      // Try a simple query to test connection
      const testQuery = await sanityWriteClient.fetch<number>(
        `count(*[_type == "qaItem"])`
      );
      diagnostics.connection = {
        status: "success",
        testQuery: testQuery,
        message: "Successfully connected to Sanity",
      };
    } catch (error) {
      diagnostics.connection = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to connect to Sanity",
      };
      logger.error("Sanity connection test failed", error);
    }

    // Try to create a test draft (then delete it)
    try {
      const testDraft = await sanityWriteClient.create({
        _type: "qaItem",
        question: "Test question - DELETE ME",
        answer: [
          {
            _type: "block",
            _key: "test",
            style: "normal",
            children: [{ _type: "span", _key: "test-span", text: "Test answer", marks: [] }],
            markDefs: [],
          },
        ],
      });

      diagnostics.writeTest = {
        status: "success",
        draftId: testDraft._id,
        message: "Successfully created test draft",
      };

      // Clean up - delete the test draft
      try {
        await sanityWriteClient.delete(testDraft._id);
        diagnostics.writeTest.cleanedUp = true;
      } catch (deleteError) {
        diagnostics.writeTest.cleanedUp = false;
        diagnostics.writeTest.deleteError = deleteError instanceof Error ? deleteError.message : String(deleteError);
        logger.warn("Failed to delete test draft", { draftId: testDraft._id, error: deleteError });
      }
    } catch (error) {
      diagnostics.writeTest = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        errorDetails: error instanceof Error ? {
          name: error.name,
          message: error.message,
        } : error,
        message: "Failed to create test draft",
      };
      logger.error("Sanity write test failed", error);
    }
  } else {
    diagnostics.connection = {
      status: "not_configured",
      message: "Sanity write client is not configured - check environment variables",
    };
  }

  return NextResponse.json(diagnostics);
}

