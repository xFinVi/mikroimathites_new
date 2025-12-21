import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getActivities, getPrintables, getAgeGroups } from "@/lib/content";
import { ActivityCard } from "@/components/activities/activity-card";
import { ContentFilters } from "@/components/content/content-filters";
import { SearchBar } from "@/components/content/search-bar";
import { ActivitiesList } from "@/components/activities/activities-list";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image-url";

export const metadata = generateMetadataFor("drastiriotites");

interface PageProps {
  searchParams: Promise<{ age?: string; type?: string; search?: string }>;
}

export default async function DrastiriotitesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [activities, printables, ageGroups] = await Promise.all([
    getActivities(),
    getPrintables(),
    getAgeGroups(),
  ]);

  // Combine activities and printables
  let allItems = [
    ...activities.map((a) => ({ ...a, _contentType: "activity" as const })),
    ...printables.map((p) => ({ ...p, _contentType: "printable" as const })),
  ];

  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    allItems = allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower) ||
        (item._contentType === "activity" && 
          (item as any).goals?.some((g: string) => g.toLowerCase().includes(searchLower)))
    );
  }

  // Filter by age
  if (params.age) {
    allItems = allItems.filter((item) =>
      item.ageGroups?.some((ag) => ag.slug === params.age)
    );
  }

  // Filter by type
  if (params.type === "activity") {
    allItems = allItems.filter((item) => item._contentType === "activity");
  } else if (params.type === "printable") {
    allItems = allItems.filter((item) => item._contentType === "printable");
  }
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
              title="Δραστηριότητες & Εκτυπώσιμα"
              description="Διασκεδαστικές δραστηριότητες και εκτυπώσιμα για παιδιά 0-6 ετών"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar />
          <ContentFilters
            ageGroups={ageGroups}
            showTypeFilter={true}
            showCategoryFilter={false}
          />
        </div>

        {/* Activities and Printables List */}
        <ActivitiesList items={allItems} />

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

