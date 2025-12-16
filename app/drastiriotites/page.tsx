import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";

export const metadata = generateMetadataFor("drastiriotites");

export default function DrastiriotitesPage() {
  return (
    <PageWrapper>
      <Container className="py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title="Δραστηριότητες & Εκτυπώσιμα"
            description="Διασκεδαστικές δραστηριότητες και εκτυπώσιμα για παιδιά 0-6 ετών"
          />

          {/* Placeholder content */}
          <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle">
            <p className="text-text-medium">Περιεχόμενο σε εξέλιξη...</p>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

