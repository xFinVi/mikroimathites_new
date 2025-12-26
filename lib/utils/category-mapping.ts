/**
 * Category mapping utilities
 * 
 * Philosophy: CMS is the source of truth for category display names.
 * Code only handles special merge/hide rules for legacy categories.
 */

/**
 * Category merge rules - maps a category slug to an array of slugs to include
 * Used when filtering content to show items from merged categories
 */
const CATEGORY_MERGE_RULES: Record<string, string[]> = {
  "diatrofi-epiloges": ["diatrofi-epiloges", "fysikes-syntages"],
  "texnes-xirotexnies": ["texnes-xirotexnies", "idees-paixnidiou"],
} as const;

/**
 * Categories that should be hidden from display (merged into other categories)
 */
const HIDDEN_CATEGORIES = ["fysikes-syntages", "idees-paixnidiou"] as const;

/**
 * Gets the array of category slugs to use when filtering content
 * Returns the merged categories if a merge rule exists, otherwise returns the single slug
 * 
 * @param categorySlug - The category slug to map
 * @returns Array of category slugs to include in the filter
 */
export function getMappedCategories(categorySlug: string): string[] {
  return CATEGORY_MERGE_RULES[categorySlug] ?? [categorySlug];
}

/**
 * Checks if a category should be hidden from display
 * 
 * @param categorySlug - The category slug to check
 * @returns True if the category should be hidden
 */
export function shouldHideCategory(categorySlug: string): boolean {
  return (HIDDEN_CATEGORIES as readonly string[]).includes(categorySlug);
}

/**
 * Gets the display name for a category
 * Only provides overrides for merged categories that need different display names
 * All other categories should use their CMS title
 * 
 * @param categorySlug - The category slug
 * @param cmsTitle - The title from CMS (preferred source)
 * @returns The display name to use
 */
export function getCategoryDisplayName(
  categorySlug: string,
  cmsTitle?: string
): string {
  // Only special overrides for merged categories
  const displayOverrides: Record<string, string> = {
    "diatrofi-epiloges": "Διατροφή & Συνταγές",
    "texnes-xirotexnies": "Δραστηριότητες & Παιχνίδια",
  };
  
  // Use override if exists, otherwise use CMS title, fallback to slug
  return displayOverrides[categorySlug] ?? cmsTitle ?? categorySlug;
}

