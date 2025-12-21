import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { UnifiedContactForm } from "@/components/forms/unified-contact-form";
import { QAPreview } from "@/components/qa/qa-preview";
import { getQAItems } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("epikoinonia");

export default async function EpikoinoniaPage() {
  const qaItems = await getQAItems();
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Επικοινωνία background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Επικοινωνία"
              description="Η γνώμη σας μετράει - Στείλτε ιδέα για βίντεο, feedback ή ερώτηση"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-10">
        {/* Unified Contact Form */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <UnifiedContactForm />
          </div>
        </section>

        {/* Q&A Preview Section */}
        {qaItems.length > 0 && <QAPreview items={qaItems} />}

        {/* Safety Rules Section */}
        <section className="max-w-4xl mx-auto bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <h3 className="text-xl font-bold text-text-dark mb-4">Κανόνες & Ασφάλεια</h3>
          <ul className="space-y-3 text-text-medium">
            <li className="flex items-start gap-3">
              <span className="text-primary-pink mt-1">•</span>
              <span>Δεν δημοσιεύουμε προσωπικές πληροφορίες για παιδιά</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-pink mt-1">•</span>
              <span>Οι Q&A δημοσιεύονται μόνο μετά από έγκριση</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-pink mt-1">•</span>
              <span>Δεν παρέχουμε ιατρικές διαγνώσεις - για σοβαρές ανησυχίες, συμβουλευτείτε επαγγελματία</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-pink mt-1">•</span>
              <span>Όλες οι υποβολές αποθηκεύονται ασφαλώς και χρησιμοποιούνται μόνο για βελτίωση της υπηρεσίας</span>
            </li>
          </ul>
        </section>

        {/* Alternative Contact */}
        <section className="max-w-4xl mx-auto bg-background-white rounded-card p-6 shadow-subtle border border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-text-dark mb-2">Εναλλακτικοί τρόποι επικοινωνίας</h3>
            <p className="text-text-medium">
              Προτιμάτε email; Μπορείτε να μας στείλετε email απευθείας.
            </p>
          </div>
          <Link
            href="mailto:info@mikroimathites.gr"
            className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-5 py-3 text-white hover:bg-secondary-blue/90 transition"
          >
            Στείλτε Email
          </Link>
        </section>
      </Container>
    </PageWrapper>
  );
}

