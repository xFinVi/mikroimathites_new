"use client";

import Image from "next/image";
import Link from "next/link";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { SponsorLogoPlaceholder } from "./sponsor-logo-placeholder";

export interface Sponsor {
  _id: string;
  name: string;
  logo?: unknown; // Sanity image or string URL
  website?: string;
  contactEmail?: string;
  category?: 'education' | 'health' | 'local' | 'tech' | 'other';
  sponsorType?: 'business' | 'individual' | 'organization';
  tier?: 'premium' | 'standard' | 'community';
  featured?: boolean;
  isActive?: boolean;
}

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  // Handle both Sanity image objects and URL strings
  let logoUrl: string | null = null;
  if (sponsor.logo) {
    if (typeof sponsor.logo === 'string') {
      logoUrl = sponsor.logo;
    } else {
      logoUrl = generateImageUrl(sponsor.logo, 300, 200);
    }
  }
  
  // Determine click action: website first, then contact email
  const clickUrl = sponsor.website || (sponsor.contactEmail ? `mailto:${sponsor.contactEmail}` : null);
  const clickTarget = sponsor.website ? '_blank' : undefined;
  const clickRel = sponsor.website ? 'noopener noreferrer' : undefined;

  const CardContent = (
    <div className="rounded-[20px] overflow-hidden cursor-pointer group flex flex-col items-center justify-center min-h-[220px] w-full bg-white">
      {/* Logo Section - Centered */}
      <div className="relative w-full flex-1 flex items-center justify-center p-6 pt-8">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={sponsor.name}
            width={300}
            height={200}
            className="object-contain max-w-full max-h-[140px] transition-transform duration-300 group-hover:scale-110"
            unoptimized={logoUrl.startsWith('http') && !logoUrl.includes('cdn.sanity.io')}
          />
        ) : (
          <div className="group-hover:scale-110 transition-transform duration-300">
            <SponsorLogoPlaceholder 
              name={sponsor.name} 
              color={
                sponsor.category === 'education' ? '#FF6B9D' :
                sponsor.category === 'health' ? '#4ECDC4' :
                sponsor.category === 'local' ? '#95E1D3' :
                sponsor.category === 'tech' ? '#FFD93D' :
                '#FFA07A'
              }
            />
          </div>
        )}
      </div>
      {/* Company Name - Styled nicely under logo */}
      <div className="w-full px-4 pb-6 pt-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-primary-pink transition-colors leading-tight line-clamp-2">
          {sponsor.name}
        </h3>
      </div>
    </div>
  );

  if (clickUrl) {
    return (
      <Link
        href={clickUrl}
        target={clickTarget}
        rel={clickRel}
        className="block w-full"
        aria-label={`Visit ${sponsor.name}`}
      >
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

