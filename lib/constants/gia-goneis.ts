/**
 * Constants for the gia-goneis (For Parents) page
 * Centralizes magic numbers, image dimensions, and configuration values
 */

export const GIA_GONEIS_CONSTANTS = {
  // Pagination
  INITIAL_PAGE_SIZE: 9, // Initial items to show
  LOAD_MORE_SIZE: 9, // Items to load per "Load More" action
  PAGE_SIZE: 18, // Keep for backward compatibility

  // Search debounce timeout in milliseconds
  SEARCH_DEBOUNCE_MS: 500,

  // Image dimensions for different use cases
  IMAGE_SIZES: {
    // Card images in content grids
    CARD: { width: 400, height: 250 },
    // Quick Tips section images
    QUICK_TIP: { width: 400, height: 300 },
    // Open Graph / social sharing images
    OG_IMAGE: { width: 1200, height: 630 },
    // Hero images on detail pages
    HERO: { width: 1200, height: 600 },
  },

  // Color variants for Quick Tips cards (rotating through these)
  QUICK_TIPS_COLOR_VARIANTS: [
    "from-pink-100 to-pink-50 border-pink-200",
    "from-blue-100 to-blue-50 border-blue-200",
    "from-yellow-100 to-yellow-50 border-yellow-200",
    "from-green-100 to-green-50 border-green-200",
  ] as const,
} as const;

