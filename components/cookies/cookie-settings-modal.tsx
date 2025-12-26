"use client";

import { useState, useEffect } from "react";
import { useCookieConsent, type CookiePreferences } from "@/hooks/use-cookie-consent";
import { Button } from "@/components/ui/button";
import { X, Cookie, Check } from "lucide-react";
import Link from "next/link";

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookieSettingsModal({ isOpen, onClose }: CookieSettingsModalProps) {
  const { preferences, savePreferences, updatePreference } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    savePreferences(localPreferences, true);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
    };
    savePreferences(allAccepted, true);
    onClose();
  };

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      essential: true,
      analytics: false,
    };
    savePreferences(rejected, true);
    onClose();
  };

  const toggleCategory = (category: keyof CookiePreferences) => {
    if (category === "essential") return; // Cannot disable essential
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border/50 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-pink to-primary-pink/70 rounded-xl flex items-center justify-center">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark">Ρυθμίσεις Cookies</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-light transition-colors"
            aria-label="Κλείσιμο"
          >
            <X className="w-5 h-5 text-text-medium" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="space-y-3">
            <p className="text-text-medium leading-relaxed">
              Οι cookies είναι μικρά αρχεία που αποθηκεύονται στη συσκευή σας. Μπορείτε να
              επιλέξετε ποιες κατηγορίες cookies θέλετε να αποδεχτείτε.
            </p>
            <p className="text-sm text-text-light">
              Μάθετε περισσότερα στην{" "}
              <Link href="/privacy" className="text-primary-pink hover:underline">
                Πολιτική Απορρήτου
              </Link>
              .
            </p>
          </div>

          {/* Essential Cookies */}
          <div className="bg-background-light rounded-xl p-5 border-2 border-primary-pink/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-text-dark">Αναγκαία Cookies</h3>
                  <span className="text-xs bg-primary-pink/10 text-primary-pink px-2 py-1 rounded-full font-semibold">
                    Πάντα ενεργά
                  </span>
                </div>
                <p className="text-sm text-text-medium">
                  Αυτά τα cookies είναι απαραίτητα για τη λειτουργία του ιστότοπου. Δεν μπορούν
                  να απενεργοποιηθούν.
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-6 bg-primary-pink rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="text-xs text-text-light space-y-1">
              <p>• Αποθήκευση προτιμήσεων</p>
              <p>• Ασφάλεια συνεδρίας</p>
              <p>• Βασική λειτουργικότητα</p>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-background-light rounded-xl p-5 border-2 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-text-dark">Αναλυτικά Cookies</h3>
                  {localPreferences.analytics && (
                    <span className="text-xs bg-accent-green/10 text-accent-green px-2 py-1 rounded-full font-semibold">
                      Ενεργό
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-medium">
                  Μας βοηθούν να κατανοήσουμε πώς οι επισκέπτες χρησιμοποιούν τον ιστότοπο
                  (Google Analytics). Αυτά τα δεδομένα είναι ανώνυμα.
                </p>
              </div>
              <button
                onClick={() => toggleCategory("analytics")}
                className={`flex-shrink-0 ml-4 w-12 h-6 rounded-full transition-colors relative ${
                  localPreferences.analytics
                    ? "bg-secondary-blue"
                    : "bg-text-light"
                }`}
                aria-label="Εναλλαγή αναλυτικών cookies"
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localPreferences.analytics ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="text-xs text-text-light space-y-1">
              <p>• Στατιστικά επισκεψιμότητας</p>
              <p>• Ανώνυμα δεδομένα χρήσης</p>
              <p>• Βελτίωση του περιεχομένου</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-accent-yellow/10 border-l-4 border-accent-yellow p-4 rounded-lg">
            <p className="text-sm text-text-dark">
              <strong>Σημείωση:</strong> Αν αλλάξετε τις προτιμήσεις σας, ο ιστότοπος θα
              ανανεωθεί για να εφαρμοστούν οι αλλαγές.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border/50 p-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1 border-2"
          >
            Απόρριψη Όλων
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink text-white font-semibold"
          >
            Αποθήκευση Προτιμήσεων
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="flex-1 bg-gradient-to-r from-secondary-blue to-secondary-blue/90 hover:from-secondary-blue/90 hover:to-secondary-blue text-white font-semibold"
          >
            Αποδοχή Όλων
          </Button>
        </div>
      </div>
    </div>
  );
}

