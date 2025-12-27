/**
 * Age Group Display Utilities
 * 
 * CLIENT-SAFE: Pure display logic
 * Used in: app/age/[slug]/page.tsx
 * 
 * TODO: Single-use utility - consider moving to app/age/ folder in Phase 6
 */

/**
 * Gets the background color class for an age group based on its slug
 * @param slug - The age group slug (e.g., "0-2", "2-4", "4-6")
 * @returns Tailwind CSS background color class
 */
export function getAgeGroupColor(slug: string): string {
  const normalizedSlug = slug.toLowerCase().trim();
  
  // Handle 0-2 age group - check exact matches first, then patterns
  if (
    normalizedSlug === "0-2" || 
    normalizedSlug === "0_2" ||
    (normalizedSlug.startsWith("0") && normalizedSlug.length <= 3)
  ) {
    return "bg-primary-pink";
  }
  
  // Handle 2-4 age group - must include 2 but not 4, or exact matches
  if (
    normalizedSlug === "2-4" || 
    normalizedSlug === "2_4" ||
    (normalizedSlug.includes("2") && !normalizedSlug.includes("4") && !normalizedSlug.startsWith("0"))
  ) {
    return "bg-secondary-blue";
  }
  
  // Handle 4-6 age group - check exact matches first, then patterns
  if (
    normalizedSlug === "4-6" || 
    normalizedSlug === "4_6" ||
    (normalizedSlug.includes("4") && !normalizedSlug.includes("2"))
  ) {
    return "bg-accent-yellow";
  }
  
  // Default fallback
  return "bg-primary-pink";
}

/**
 * Checks if an age group should be excluded from display
 * Excludes groups related to "abroad", "greek", or "εξωτερικό"
 * @param slug - The age group slug
 * @returns true if the age group should be excluded
 */
export function shouldExcludeAgeGroup(slug: string): boolean {
  const normalizedSlug = slug.toLowerCase().trim();
  return (
    normalizedSlug.includes("abroad") ||
    normalizedSlug.includes("greek") ||
    normalizedSlug.includes("εξωτερικό")
  );
}

/**
 * Filters age groups to exclude unwanted ones
 * @param ageGroups - Array of age groups
 * @returns Filtered array of age groups
 */
export function filterAgeGroups<T extends { slug: string }>(
  ageGroups: T[]
): T[] {
  return ageGroups.filter(
    (ageGroup) => !shouldExcludeAgeGroup(ageGroup.slug)
  );
}

