import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getActivities } from "@/lib/content";
import { ActivityCard } from "@/components/activities/activity-card";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("drastiriotites");

export default async function DrastiriotitesPage() {
  const activities = await getActivities();
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

        {/* Activities grid from Sanity */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
              {activities.length > 0 ? "Δραστηριότητες" : "Δραστηριότητες"}
            </h2>
            {activities.length > 0 && (
              <span className="text-sm text-text-medium">{activities.length} δραστηριότητες</span>
            )}
          </div>
          {activities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="bg-background-white rounded-card p-12 shadow-subtle border border-border/50 text-center">
              <p className="text-text-medium mb-4">
                Δεν υπάρχουν δραστηριότητες ακόμα. Προσθέστε περιεχόμενο από το{" "}
                <Link href="/studio" className="text-secondary-blue hover:underline font-semibold">
                  Sanity Studio
                </Link>
                .
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-5 py-3 text-white hover:bg-secondary-blue/90 transition"
              >
                Άνοιγμα Studio
              </Link>
            </div>
          )}
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

