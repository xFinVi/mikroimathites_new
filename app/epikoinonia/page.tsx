import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";

export const metadata = generateMetadataFor("epikoinonia");

export default function EpikoinoniaPage() {
  return (
    <PageWrapper>
      <Container className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Επικοινωνία"
            description="Η γνώμη σας μετράει - Στείλτε ιδέα για βίντεο, feedback ή ερώτηση"
          />

          {/* Placeholder content */}
          <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle">
            <p className="text-text-medium">
              Φόρμες επικοινωνίας σε εξέλιξη...
            </p>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

