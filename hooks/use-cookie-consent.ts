"use client";

import { useState, useEffect } from "react";
import { logger } from "@/lib/utils/logger";

export type CookieCategory = "essential" | "analytics" | "advertising";

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  advertising: boolean;
}

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFERENCES_KEY = "cookie-preferences";

// Default preferences
const defaultPreferences: CookiePreferences = {
  essential: true, // Always enabled
  analytics: false,
  advertising: false,
};

export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent and preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Check if user has given consent
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      // If no consent value exists, user hasn't consented yet (null)
      // If consent exists, check if it's "true"
      const hasConsent = consent === null ? null : consent === "true";

      // Load preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      const prefs: CookiePreferences = savedPreferences
        ? JSON.parse(savedPreferences)
        : defaultPreferences;

      setHasConsented(hasConsent);
      setPreferences(prefs);
    } catch (error) {
      logger.error("Error loading cookie consent:", error);
      // On error, assume no consent given yet (null)
      setHasConsented(null);
      setPreferences(defaultPreferences);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Accept all cookies
  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    savePreferences(allAccepted, true);
  };

  // Reject all (except essential)
  const rejectAll = () => {
    savePreferences(defaultPreferences, true);
  };

  // Save custom preferences
  const savePreferences = (newPreferences: CookiePreferences, hasConsent: boolean) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, String(hasConsent));
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
      setHasConsented(hasConsent);
      setPreferences(newPreferences);

      // Reload page to apply changes (especially for GA)
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      logger.error("Error saving cookie preferences:", error);
    }
  };

  // Update a specific category preference
  const updatePreference = (category: CookieCategory, value: boolean) => {
    // Essential cookies cannot be disabled
    if (category === "essential") return;

    const newPreferences: CookiePreferences = {
      ...preferences,
      [category]: value,
    };
    savePreferences(newPreferences, true);
  };

  // Check if a specific category is allowed
  const isCategoryAllowed = (category: CookieCategory): boolean => {
    if (category === "essential") return true; // Always allowed
    return preferences[category] === true && hasConsented === true;
  };

  return {
    hasConsented,
    preferences,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    updatePreference,
    isCategoryAllowed,
  };
}

