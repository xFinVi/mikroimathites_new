/**
 * Sanity Plugin: Q&A Publish/Unpublish Action
 * 
 * This plugin adds custom publish/unpublish actions for Q&A items
 * that automatically set/clear the publishedAt field.
 * 
 * When publishing: Sets publishedAt to current date if not already set
 * When unpublishing: Document becomes draft (publishedAt remains for reference)
 */

import type { DocumentActionProps } from "sanity";

export function qaPublishActions(
  prev: any[],
  context: DocumentActionProps
): any[] {
  // Only apply to qaItem documents
  if (context.schemaType !== "qaItem") {
    return prev;
  }

  const { draft, published } = context;
  const isPublished = !!published;
  const isDraft = !!draft;

  // Replace default publish action with custom one that sets publishedAt
  return prev.map((action) => {
    // Custom Publish Action - sets publishedAt when publishing
    if (action && action.action === "publish" && !isPublished && isDraft) {
      const originalOnHandle = action.onHandle;
      return {
        ...action,
        onHandle: async () => {
          // Set publishedAt if not already set
          if (!draft?.publishedAt) {
            await context.patch.execute([
              {
                set: {
                  publishedAt: new Date().toISOString(),
                },
              },
            ]);
          }
          // Execute the original publish action
          if (originalOnHandle) {
            await originalOnHandle();
          }
        },
      };
    }

    // Return other actions as-is
    return action;
  });
}
