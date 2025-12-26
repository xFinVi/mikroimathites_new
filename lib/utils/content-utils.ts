/**
 * Content type utilities
 * Shared helpers for working with content types
 */

import { ContentType } from './content-url';

/**
 * Gets the Greek label for a content type
 * 
 * @param contentType - The content type (string or ContentType)
 * @returns The Greek label for the content type
 */
export function getContentTypeLabel(contentType: ContentType | string): string {
  switch (contentType) {
    case "article":
      return "Άρθρο";
    case "activity":
      return "Δραστηριότητα";
    case "printable":
      return "Εκτυπώσιμο";
    case "recipe":
      return "Συνταγή";
    default:
      return "Περιεχόμενο";
  }
}

