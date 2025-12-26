import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { DonationSection } from "@/components/support/donation-section";
import Image from "next/image";

export const metadata = generateMetadataFor("support");

export default async function SupportPage() {
  return (
    <PageWrapper>
      {/* Hero with Happy Background */}
      <div className="relative min-h-[85vh] flex items-start overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/sunnySky.png"
            alt="Happy background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
        </div>

        {/* Content - Top Aligned */}
        <Container className="relative z-10 pt-12 sm:pt-16 md:pt-20">
          <div className="flex flex-col items-center text-center px-4">
            {/* Minimal Text - Top with better readability */}
            <div className="space-y-4 max-w-2xl mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-dark drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
                Η υποστήριξή σας μετράει! ❤️
              </h1>
              <p className="text-lg sm:text-xl text-text-dark font-medium drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)]">
                Κάθε συνεισφορά βοηθάει να δημιουργούμε περισσότερο δωρεάν περιεχόμενο
              </p>
            </div>

            {/* Donation Button - Centered */}
            <DonationSection />
          </div>
        </Container>
      </div>
    </PageWrapper>
  );
}
