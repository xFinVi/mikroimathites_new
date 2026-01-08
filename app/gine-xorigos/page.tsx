import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { SponsorApplicationForm } from "@/components/sponsors/sponsor-application-form";
import { CONTACT_CONSTANTS } from "@/lib/constants";
import Image from "next/image";

export const metadata = generateMetadataFor("gine-xorigos");

// ISR revalidation
export const revalidate = 600; // 10 minutes

export default async function GineXorigosPage() {
  return (
    <PageWrapper mainClassName="relative">
      {/* Background Image */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden pointer-events-none z-0">
        <Image
          src={CONTACT_CONSTANTS.BACKGROUND_IMAGE_PATH}
          alt="Γίνετε χορηγός background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pt-12 sm:pt-16 md:pt-20 pb-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Γίνετε Χορηγός"
              description="Υποστηρίξτε την κοινότητά μας και φτάστε σε χιλιάδες γονείς"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-10 relative z-10">
        {/* Introduction Section */}
        <section className={CONTACT_CONSTANTS.SECTION_CLASSES}>
          <div className="space-y-4 text-text-medium">
            <p className="text-lg leading-relaxed">
              Ως χορηγός της κοινότητας Μικροί Μαθητές, θα έχετε την ευκαιρία να 
              φτάσετε σε χιλιάδες γονείς που αναζητούν ποιοτικά εκπαιδευτικά 
              περιεχόμενο και συμβουλές για τα παιδιά τους.
            </p>
            <p>
              Το λογότυπό σας θα εμφανίζεται στην κύρια σελίδα μας, δίνοντάς σας 
              ορατότητα και αναγνώριση στην κοινότητά μας.
            </p>
          </div>
        </section>

        {/* Application Form */}
        <section className="max-w-4xl mx-auto">
          <div className={CONTACT_CONSTANTS.SECTION_CLASSES}>
            <SponsorApplicationForm />
          </div>
        </section>

        {/* Information Section */}
        <section className={CONTACT_CONSTANTS.SECTION_CLASSES}>
          <h3 className="text-2xl font-bold text-text-dark mb-6">
            Πώς λειτουργεί
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-text-dark mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>Βήμα 1: Υποβάλετε την αίτησή σας</span>
              </h4>
              <p className="text-text-medium ml-7">
                Συμπληρώστε τη φόρμα με τα στοιχεία της εταιρείας/οργανισμού σας 
                και ανεβάστε το λογότυπό σας.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-dark mb-3 flex items-center gap-2">
                <span>✅</span>
                <span>Βήμα 2: Εξέταση αίτησης</span>
              </h4>
              <p className="text-text-medium ml-7">
                Η ομάδα μας θα εξετάσει την αίτησή σας και θα επικοινωνήσει 
                μαζί σας για τα επόμενα βήματα.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-dark mb-3 flex items-center gap-2">
                <span>🌟</span>
                <span>Βήμα 3: Εμφάνιση στην ιστοσελίδα</span>
              </h4>
              <p className="text-text-medium ml-7">
                Μετά την έγκριση, το λογότυπό σας θα εμφανίζεται στην κύρια 
                σελίδα μας, φτάνοντας σε χιλιάδες γονείς.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={CONTACT_CONSTANTS.SECTION_CLASSES}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-text-dark">
                Έχετε ερωτήσεις;
              </h3>
              <p className="text-text-medium">
                Μη διστάσετε να επικοινωνήσετε μαζί μας στο{" "}
                <a
                  href={`mailto:${CONTACT_CONSTANTS.EMAIL}`}
                  className="text-primary-pink hover:underline font-semibold"
                >
                  {CONTACT_CONSTANTS.EMAIL}
                </a>
              </p>
            </div>
            <a
              href={`mailto:${CONTACT_CONSTANTS.EMAIL}`}
              className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-6 py-4 text-white hover:bg-secondary-blue/90 transition font-semibold whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Στείλτε Email
            </a>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}

