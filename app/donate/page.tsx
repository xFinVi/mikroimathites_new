import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import Image from "next/image";
import Link from "next/link";
import { DonateButton } from "@/components/support/donate-button";

export const metadata = generateMetadataFor("donate");

export default async function DonatePage() {
  const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_DONATION_URL || null;

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
        <Container className="relative z-10 pt-12 sm:pt-16 md:pt-20 pb-16">
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

            {/* Donation Button - Direct Link to PayPal */}
            {paypalUrl ? (
              <DonateButton paypalUrl={paypalUrl} />
            ) : (
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-lg border border-white/30 shadow-lg">
                <p className="text-text-medium">
                  Η σύνδεση PayPal δεν είναι διαθέσιμη αυτή τη στιγμή.
                </p>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-12 max-w-3xl space-y-6 text-text-dark">
              <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Πώς λειτουργεί η συνεισφορά;</h2>
                <ul className="text-left space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-primary-pink text-2xl">✓</span>
                    <span>Κάντε κλικ στο κουμπί παραπάνω για να μεταφερθείτε στο PayPal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-pink text-2xl">✓</span>
                    <span>Επιλέξτε το ποσό που θέλετε να συνεισφέρετε</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary-pink text-2xl">✓</span>
                    <span>Ολοκληρώστε τη συνεισφορά σας με ασφάλεια μέσω PayPal</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Πού πηγαίνουν τα χρήματα;</h2>
                <p className="text-lg text-left">
                  Οι συνεισφορές σας βοηθούν να δημιουργούμε περισσότερο δωρεάν περιεχόμενο,
                  να βελτιώνουμε την ποιότητα των βίντεο και να επεκτείνουμε την προσφορά μας
                  για να φτάσουμε σε περισσότερες οικογένειες.
                </p>
              </div>
            </div>

            {/* Back to Support Link */}
            <div className="mt-8">
              <Link
                href="/support"
                className="text-primary-pink hover:text-primary-pink/80 font-semibold text-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Επιστροφή στη σελίδα υποστήριξης
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </PageWrapper>
  );
}


