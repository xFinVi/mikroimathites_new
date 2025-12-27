"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings } from "lucide-react";
import Link from "next/link";

export function CookieConsentModal() {
  const { hasConsented, isLoading, acceptAll, rejectAll } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only show if consent hasn't been given yet (null means no consent given)
    if (mounted && !isLoading) {
      if (hasConsented === null) {
        // No consent given yet - show modal
        setIsVisible(true);
      } else {
        // Consent already given - hide modal
        setIsVisible(false);
      }
    }
  }, [hasConsented, isLoading, mounted]);

  // Don't render on server or if loading/consented
  if (!mounted || isLoading || hasConsented !== null || !isVisible) {
    return null;
  }

  const handleAccept = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleReject = () => {
    rejectAll();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-primary-pink/20 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-pink to-primary-pink/70 rounded-xl flex items-center justify-center">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-text-dark mb-2">
              Χρησιμοποιούμε Cookies 🍪
            </h3>
            <p className="text-sm md:text-base text-text-medium leading-relaxed">
              Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας στον ιστότοπο. Μερικά
              είναι απαραίτητα για τη λειτουργία, ενώ άλλα μας βοηθούν να κατανοήσουμε πώς
              χρησιμοποιείτε τον ιστότοπο.
            </p>
          </div>
        </div>

        {/* Cookie Types Info */}
        <div className="bg-background-light rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-primary-pink mt-1">✓</span>
            <div className="flex-1">
              <span className="font-semibold text-text-dark">Αναγκαία cookies:</span>
              <span className="text-sm text-text-medium ml-2">
                Απαραίτητα για τη λειτουργία του ιστότοπου
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-secondary-blue mt-1">📊</span>
            <div className="flex-1">
              <span className="font-semibold text-text-dark">Αναλυτικά cookies:</span>
              <span className="text-sm text-text-medium ml-2">
                Μας βοηθούν να κατανοήσουμε πώς χρησιμοποιείτε τον ιστότοπο (Google Analytics)
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-yellow mt-1">📢</span>
            <div className="flex-1">
              <span className="font-semibold text-text-dark">Διαφημίσεις cookies:</span>
              <span className="text-sm text-text-medium ml-2">
                Χρησιμοποιούνται για την εμφάνιση διαφημίσεων (Google AdSense)
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <Link
            href="/privacy"
            className="text-primary-pink hover:underline font-medium"
          >
            Πολιτική Απορρήτου
          </Link>
          <span className="text-text-light">•</span>
          <Link
            href="/terms"
            className="text-primary-pink hover:underline font-medium"
          >
            Όροι & Προϋποθέσεις
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleReject}
            variant="outline"
            className="flex-1 border-2 border-text-light hover:border-text-medium"
          >
            Απόρριψη
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink text-white font-semibold shadow-lg"
          >
            Αποδοχή Όλων
          </Button>
        </div>

        {/* Settings Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Open settings modal (will be handled by footer)
              const event = new CustomEvent("openCookieSettings");
              window.dispatchEvent(event);
              setIsVisible(false);
            }}
            className="text-sm text-text-medium hover:text-primary-pink transition-colors inline-flex items-center gap-1"
          >
            <Settings className="w-4 h-4" />
            Προσαρμογή Ρυθμίσεων
          </button>
        </div>
      </div>
    </div>
  );
}

