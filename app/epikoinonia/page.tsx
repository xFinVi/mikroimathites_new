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
        {/* Introduction Section */}
        <section className="max-w-4xl mx-auto bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
          <div className="space-y-4 text-text-medium">
            <p className="text-lg leading-relaxed">
              Η γνώμη σας είναι πολύτιμη για εμάς! Είμαστε εδώ για να ακούσουμε τις ιδέες σας, 
              να απαντήσουμε στις ερωτήσεις σας, και να βελτιώσουμε συνεχώς το περιεχόμενο μας.
            </p>
            <p>
              Μπορείτε να μας στείλετε <strong>ιδέες για βίντεο</strong>, <strong> feedback</strong> 
              
              , ή <strong>ερωτήσεις</strong> που θα θέλατε να δημοσιεύσουμε 
              στο Q&A μας.
            </p>
          </div>
        </section>

        {/* Unified Contact Form */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
            <UnifiedContactForm />
          </div>
        </section>

        {/* Q&A Preview Section */}
        {qaItems.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <QAPreview items={qaItems} />
          </section>
        )}

        {/* Information Section */}
        <section className="max-w-4xl mx-auto bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
          <h3 className="text-2xl font-bold text-text-dark mb-6">Σημαντικές πληροφορίες</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-text-dark mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>Πώς λειτουργεί</span>
              </h4>
              <ul className="space-y-2 text-text-medium ml-7">
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span><strong>Ιδέες για βίντεο:</strong> Προτείνετε θέματα που θα θέλατε να δούμε σε βίντεο</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span><strong>Feedback:</strong> Πείτε μας τι σας αρέσει, τι όχι, και πώς μπορούμε να βελτιωθούμε</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span><strong>Q&A:</strong> Κάντε ερώτηση και επιλέξτε αν θέλετε να δημοσιευτεί (μετά από έγκριση)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-text-dark mb-3 flex items-center gap-2">
                <span>🔒</span>
                <span>Ασφάλεια & Απόρρητο</span>
              </h4>
              <ul className="space-y-2 text-text-medium ml-7">
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>Δεν δημοσιεύουμε προσωπικές πληροφορίες για παιδιά</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>Οι Q&A δημοσιεύονται μόνο μετά από έγκριση και αφαίρεση προσωπικών στοιχείων</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>Όλες οι υποβολές αποθηκεύονται ασφαλώς και χρησιμοποιούνται μόνο για βελτίωση της υπηρεσίας</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-pink mt-1">•</span>
                  <span>Μπορείτε να διαβάσετε την <Link href="/privacy" className="text-primary-pink hover:underline font-semibold">Πολιτική Απορρήτου</Link> μας</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Alternative Contact */}
        <section className="max-w-4xl mx-auto bg-background-white rounded-card p-6 sm:p-8 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-text-dark">Εναλλακτικός τρόπος επικοινωνίας</h3>
              <p className="text-text-medium">
                Προτιμάτε email; Μπορείτε να μας στείλετε email απευθείας στο 
                <a href="mailto:info@mikroimathites.gr" className="text-primary-pink hover:underline font-semibold ml-1">
                  info@mikroimathites.gr
                </a>
              </p>
            </div>
            <Link
              href="mailto:info@mikroimathites.gr"
              className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-6 py-4 text-white hover:bg-secondary-blue/90 transition font-semibold whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Στείλτε Email
            </Link>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}

