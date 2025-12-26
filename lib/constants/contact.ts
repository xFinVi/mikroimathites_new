/**
 * Constants for contact/communication pages
 * Centralizes email addresses, image paths, and shared values
 * 
 * Note: If more site-wide constants are needed (social links, address, etc.),
 * consider renaming to lib/constants/site.ts
 */

export const CONTACT_CONSTANTS = {
  // Contact email address (used in epikoinonia, privacy, terms pages)
  // Future: Can add env override: process.env.CONTACT_EMAIL ?? "info@mikroimathites.gr"
  EMAIL: "info@mikroimathites.gr",
  
  // Background image path (used in multiple pages)
  BACKGROUND_IMAGE_PATH: "/images/background.png",
  
  // Common section styling (used in epikoinonia page)
  // Prevents "tiny drift" where sections get slightly different classes over time
  SECTION_CLASSES: "max-w-4xl mx-auto bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50",
} as const;

