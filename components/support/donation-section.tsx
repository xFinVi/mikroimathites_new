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
        <button
          onClick={handleDonateClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative w-[65vw] max-w-3xl mx-auto bg-white/80 backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg border border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 whitespace-nowrap"
          aria-label="Στηρίξτε μας μέσω PayPal"
        >
          {/* Logo */}
          <div className="relative w-[100px] h-[50px] sm:w-[140px] sm:h-[68px] md:w-[176px] md:h-[86px] flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Μικροί Μαθητές"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 176px"
            />
          </div>

          {/* Text Content - All on one line */}
          <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-700 group-hover:text-primary-pink transition-colors duration-200">
            Στηρίξτε μας μέσω PayPal
          </span>

          {/* Arrow Icon */}
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-primary-pink transition-all duration-200 flex-shrink-0 ${
              isHovered ? "translate-x-1" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
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
