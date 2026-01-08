"use client";

import { useState } from "react";
import Image from "next/image";

interface DonationSectionProps {
  paypalUrl?: string;
}

export function DonationSection({ paypalUrl }: DonationSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  // PayPal donation URL - can be overridden via props or env variable
  const donationUrl =
    paypalUrl ||
    process.env.NEXT_PUBLIC_PAYPAL_DONATION_URL ||
    null;

  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!donationUrl) {
      console.error("PayPal donation URL is not configured");
      return;
    }
    // Navigate directly to PayPal
    window.open(donationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Donation Button - First */}
      {donationUrl && (
        <div className="mt-8 sm:mt-12 md:mt-16 mb-12 sm:mb-16 md:mb-20">
          <button
            onClick={handleDonateClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative w-full max-w-2xl mx-auto bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-2xl border-2 border-primary-pink/30 shadow-2xl hover:shadow-primary-pink/30 hover:border-primary-pink/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 md:gap-5 whitespace-nowrap"
            aria-label="Στηρίξτε μας μέσω PayPal"
          >
            {/* Logo */}
            <div className="relative w-[100px] h-[50px] sm:w-[140px] sm:h-[68px] md:w-[176px] md:h-[86px] flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Μικροί Μαθητές"
                fill
                className="object-contain drop-shadow-lg"
                sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 176px"
              />
            </div>

            {/* Text Content - All on one line */}
            <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow-md group-hover:text-white/95 transition-colors duration-200">
              Στηρίξτε μας μέσω PayPal
            </span>

            {/* Arrow Icon */}
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-md group-hover:text-white/95 transition-all duration-200 flex-shrink-0 ${
                isHovered ? "translate-x-2" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      )}

      {/* How It Works - Below Button */}
      <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/30">
        <h2 className="text-2xl font-bold mb-4 text-text-dark text-center">Πώς λειτουργεί η συνεισφορά;</h2>
        <ul className="text-left space-y-3 text-base sm:text-lg text-text-medium">
          <li className="flex items-start gap-3">
            <span className="text-primary-pink text-2xl flex-shrink-0">✓</span>
            <span>Κάντε κλικ στο κουμπί παραπάνω για να μεταφερθείτε στο PayPal</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-pink text-2xl flex-shrink-0">✓</span>
            <span>Επιλέξτε το ποσό που θέλετε να συνεισφέρετε</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-pink text-2xl flex-shrink-0">✓</span>
            <span>Ολοκληρώστε τη συνεισφορά σας με ασφάλεια μέσω PayPal</span>
          </li>
        </ul>
      </div>

      {/* Where Money Goes - Below Button */}
      <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/30">
        <h2 className="text-2xl font-bold mb-4 text-text-dark text-center">Πού πηγαίνουν τα χρήματα;</h2>
        <p className="text-base sm:text-lg text-text-medium text-left">
          Οι συνεισφορές σας βοηθούν να δημιουργούμε περισσότερο δωρεάν περιεχόμενο,
          να βελτιώνουμε την ποιότητα των βίντεο και να επεκτείνουμε την προσφορά μας
          για να φτάσουμε σε περισσότερες οικογένειες.
        </p>
      </div>
    </div>
  );
}
