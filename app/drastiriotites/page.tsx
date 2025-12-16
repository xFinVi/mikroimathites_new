import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("drastiriotites");

export default function DrastiriotitesPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Δραστηριότητες background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/45 via-background-light/80 to-background-light" />
        </div>
        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <PageHeader
              eyebrow="Activities & Printables"
              title="Δραστηριότητες & Εκτυπώσιμα"
              description="Διασκεδαστικές δραστηριότητες και εκτυπώσιμα για παιδιά 0-6 ετών"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Filters placeholder */}
        <section className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-text-dark">Φίλτρα (CMS ready):</span>
            <div className="px-3 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm">
              Ηλικίες (0-2, 2-4, 4-6, Εξωτερικό)
            </div>
            <div className="px-3 py-2 rounded-full bg-secondary-blue/10 text-secondary-blue text-sm">
              Τύπος (Δραστηριότητα / Εκτυπώσιμο)
            </div>
            <div className="px-3 py-2 rounded-full bg-accent-yellow/10 text-accent-yellow text-sm">
              Διάρκεια (5’ / 10’ / 15’+)
            </div>
          </div>
          <p className="text-text-medium text-sm">Τα φίλτρα θα συνδεθούν με CMS (Sanity) και API layer.</p>
        </section>

        {/* Featured grid placeholder */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Προτεινόμενα</h2>
            <span className="text-sm text-text-medium">Σύντομα από CMS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-background-white rounded-card p-5 shadow-subtle border border-border/50 space-y-3"
              >
                <div className="h-36 w-full rounded-lg bg-background-light animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-text-medium/15" />
                <div className="h-4 w-1/2 rounded bg-text-medium/10" />
                <div className="flex items-center gap-2 text-sm text-text-light">
                  <span className="px-2 py-1 bg-accent-green/20 text-accent-green rounded-full">CMS</span>
                  <span className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full">Placeholder</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA to activities page (once CMS live) */}
        <section className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-dark">Θα συνδεθεί με CMS (Sanity)</h3>
              <p className="text-text-medium">
                Οι δραστηριότητες, εκτυπώσιμα και υλικό θα φορτώνουν δυναμικά από Sanity μέσω Server Components.
              </p>
            </div>
            <Link
              href="/drastiriotites"
              className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-5 py-3 text-white hover:bg-secondary-blue/90 transition"
            >
              Δείτε όλες
            </Link>
          </div>
        </section>
      </Container>
    </PageWrapper>
  );
}

