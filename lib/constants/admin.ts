/**
 * Constants for admin dashboard
 * Centralizes configuration values
 */

export const ADMIN_CONSTANTS = {
  SUBMISSIONS: {
    PAGE_SIZE: 20,
    SEARCH_DEBOUNCE_MS: 300, // Reduced for more responsive search
  },
  UI: {
    SUCCESS_MESSAGE_TIMEOUT: 3000,
    ERROR_MESSAGE_TIMEOUT: 8000,
  },
} as const;

