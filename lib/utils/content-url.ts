/**
 * Type-safe content type definitions
 * Prevents typos and enables TypeScript exhaustiveness checking
 */
export type ContentType = 'article' | 'activity' | 'recipe' | 'printable';

/**
 * Builds the correct URL for a content item based on its type
 * @param contentType - The type of content (type-safe union)
 * @param slug - The slug of the content item
 * @returns The full URL path for the content item
 */
export function getContentUrl(contentType: ContentType, slug: string): string {
  switch (contentType) {
    case "article":
      return `/gia-goneis/${slug}`;
    case "activity":
      return `/drastiriotites/${slug}`;
    case "printable":
      return `/drastiriotites/printables/${slug}`;
    case "recipe":
      return `/gia-goneis/recipes/${slug}`;
    default: {
      // Exhaustiveness check - TypeScript will error if we miss a case
      const _exhaustive: never = contentType;
      return "#";
    }
  }
}

