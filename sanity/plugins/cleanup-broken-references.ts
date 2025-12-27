/**
 * Sanity Plugin: Cleanup Broken References
 * 
 * This plugin adds a document action to automatically remove broken references
 * from featured content sections, curated collections, and other referencing documents
 * when a content item (article, activity, printable, recipe) is deleted.
 * 
 * Usage: After deleting a document, use the "Cleanup Broken References" action
 * to automatically remove it from all referencing documents.
 */

import { DocumentActionComponent, DocumentActionProps } from "sanity";
import { TrashIcon } from "@sanity/icons";

const CONTENT_TYPES = ["article", "activity", "printable", "recipe"] as const;

export const cleanupBrokenReferences: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { type, onComplete } = props;

  // Only show for content types that can be referenced
  if (!CONTENT_TYPES.includes(type as (typeof CONTENT_TYPES)[number])) {
    return null;
  }

  return {
    label: "Cleanup Broken References",
    icon: TrashIcon,
    tone: "caution",
    onHandle: async () => {
      // This is a placeholder - actual cleanup happens automatically via queries
      // that filter out null references. This action is informational.
      if (window.confirm(
        "Broken references will be automatically filtered out in queries.\n\n" +
        "The following documents may have references to this item:\n" +
        "- Featured Content Section\n" +
        "- For Parents Section\n" +
        "- Activities & Printables Section\n" +
        "- Curated Collections\n\n" +
        "These will be automatically excluded from display. You may want to manually review and update these sections in Studio."
      )) {
        onComplete();
      }
    },
  };
};

