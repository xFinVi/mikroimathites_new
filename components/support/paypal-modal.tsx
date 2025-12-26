"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  paypalUrl: string;
}

export function PayPalModal({ isOpen, onClose, paypalUrl }: PayPalModalProps) {
  const popupRef = useRef<Window | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      // Open PayPal in a popup window
      const width = 800;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      popupRef.current = window.open(
        paypalUrl,
        "PayPal Donation",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      // Check if popup was blocked
      if (!popupRef.current || popupRef.current.closed) {
        // If popup blocked, open in new tab as fallback
        window.open(paypalUrl, "_blank", "noopener,noreferrer");
        onClose();
        return;
      }

      // Check if popup is closed (user completed or cancelled)
      checkIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          onClose();
        }
      }, 500);
    } else {
      document.body.style.overflow = "unset";
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, [isOpen, paypalUrl, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-background-light shadow-lg transition-all hover:scale-110"
          aria-label="Κλείσιμο"
        >
          <X className="w-6 h-6 text-text-dark" />
        </button>

        {/* Loading/Info Message */}
        <div className="text-center space-y-4">
          <div className="text-5xl mb-4">💝</div>
          <h3 className="text-2xl font-bold text-text-dark">
            Ανοίγει το PayPal...
          </h3>
          <p className="text-text-medium">
            Αν δεν ανοίξει αυτόματα, ελέγξτε τα pop-up blockers του browser σας
          </p>
          <button
            onClick={() => {
              window.open(paypalUrl, "_blank", "noopener,noreferrer");
              onClose();
            }}
            className="mt-4 text-primary-pink hover:underline font-semibold"
          >
            Άνοιγμα σε νέα καρτέλα →
          </button>
        </div>
      </div>
    </div>
  );
}

