import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getAgeGroups, getActivitiesHubContent } from "@/lib/content";
import { ContentFilters } from "@/components/content/content-filters";
import { SearchBar } from "@/components/content/search-bar";
import { ActivitiesList } from "@/components/activities/activities-list";
import { ActiveFilters } from "@/components/content/active-filters";
import { Pagination } from "@/components/content/pagination";
import { ErrorFallback } from "@/components/ui/error-fallback";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image-url";
import { logger } from "@/lib/utils/logger";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const PAGE_SIZE = 18;

// Dynamic metadata with canonical URLs
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ age?: string; type?: string; search?: string; page?: string }> | { age?: string; type?: string; search?: string; page?: string };
}): Promise<Metadata> {
  // Handle both Promise and object types for Next.js 16 compatibility
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : (searchParams ?? {});
  const params = resolvedSearchParams as {
    age?: string;
    type?: string;
    search?: string;
    page?: string;
  };
  const base = generateMetadataFor("drastiriotites");

  const parts: string[] = [];
  if (params.type) {
    parts.push(params.type === "activity" ? "Δραστηριότητες" : "Εκτυπώσιμα");
  }
  if (params.age) parts.push("Ηλικία");
  if (params.search) parts.push(`Αναζήτηση: ${params.search}`);
  const suffix = parts.length ? ` — ${parts.join(" • ")}` : "";

  // Handle title - can be string or object
  const baseTitle =
    typeof base.title === "string"
      ? base.title
      : (base.title as any)?.default ?? "Δραστηριότητες & Εκτυπώσιμα";

  // Canonical: don't include page param, and use base URL for search pages (noindex)
  const hasSearch = !!params.search;
  const canonical = hasSearch ? "/drastiriotites" : (() => {
    const qs = new URLSearchParams();
    if (params.type) qs.set("type", params.type);
    if (params.age) qs.set("age", params.age);
    return `/drastiriotites${qs.toString() ? `?${qs.toString()}` : ""}`;
  })();

  return {
    ...base,
    title: `${baseTitle}${suffix}`,
    robots: hasSearch
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    alternates: {
      ...(base as any)?.alternates,
      canonical,
    },
  } as Metadata;
}

// Dynamic rendering for search/filter pages
export const dynamic = 'force-dynamic';

// Incremental static regeneration
export const revalidate = 600;

interface PageProps {
  searchParams?: Promise<{ age?: string; type?: string; search?: string; page?: string }> | { age?: string; type?: string; search?: string; page?: string };
}

export default async function DrastiriotitesPage({ searchParams }: PageProps) {
  // Handle both Promise and object types for Next.js 16 compatibility
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : (searchParams ?? {});
  const params = resolvedSearchParams as {
    age?: string;
    type?: string;
    search?: string;
    page?: string;
  };

  // Get current page (default to 1, validate it's a number)
  const pageNum = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;

  // Fetch all data in parallel
  const [ageGroupsResult, contentResult] = await Promise.allSettled([
    getAgeGroups(),
    getActivitiesHubContent({
      search: params.search,
      age: params.age,
      type: params.type,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
  ]);

  // Extract successful results, use empty arrays for failed ones
  const ageGroups = ageGroupsResult.status === "fulfilled" ? ageGroupsResult.value : [];
  const { items, total } =
    contentResult.status === "fulfilled" ? contentResult.value : { items: [], total: 0 };

  // Log errors for debugging
  if (ageGroupsResult.status === "rejected") {
    logger.error("Failed to fetch age groups:", ageGroupsResult.reason);
  }
  if (contentResult.status === "rejected") {
    logger.error("Failed to fetch activities content:", contentResult.reason);
  }

  // Calculate pagination
  // If total is 0, totalPages should be 0 (not 1) so pagination doesn't show
  const totalPages = total === 0 ? 0 : Math.ceil(total / PAGE_SIZE);

  // Validate current page is within bounds
  const validatedCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  // If user requested an out-of-range page, redirect to the last valid page
  if (totalPages > 0 && currentPage !== validatedCurrentPage) {
    const qs = new URLSearchParams();
    if (params.type) qs.set("type", params.type);
    if (params.age) qs.set("age", params.age);
    if (params.search) qs.set("search", params.search);
    qs.set("page", String(validatedCurrentPage));
    redirect(`/drastiriotites?${qs.toString()}`);
  }

  // Determine if we should show filtered content or all content
  const hasFilters = !!(params.age || params.type || params.search);

  // Pre-generate image URLs for all items
  const itemsWithImageUrls = items.map((item: any) => ({
    ...item,
    _contentType: item._type === "activity" ? ("activity" as const) : ("printable" as const),
    imageUrl: item.coverImage
      ? urlFor(item.coverImage as any).width(400).height(250).url()
      : null,
  }));

  // Determine title
  const title = hasFilters
    ? `Αποτελέσματα (${total})`
    : "Δραστηριότητες & Εκτυπώσιμα";

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

        {/* Active Filters Bar */}
        <ActiveFilters ageGroups={ageGroups} categories={[]} />

        {/* Content grid or empty state */}
        {itemsWithImageUrls.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-text-dark">Δεν βρέθηκαν αποτελέσματα</h2>
            <p className="mt-2 text-text-medium">
              Δοκιμάστε άλλη λέξη ή αλλάξτε φίλτρα.
            </p>
            <Link
              href="/drastiriotites"
              className="mt-5 inline-flex rounded-button bg-secondary-blue px-5 py-3 text-white hover:bg-secondary-blue/90 transition"
            >
              Επιστροφή σε όλα
            </Link>
          </div>
        ) : (
          <>
            <ActivitiesList items={itemsWithImageUrls} title={title} />
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={validatedCurrentPage} totalPages={totalPages} basePath="/drastiriotites" />
            )}
          </>
        )}

        {/* Support / CTA */}
        <section className="space-y-4 bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-dark">Στείλτε μας ιδέα ή ερώτηση</h3>
              <p className="text-text-medium">
                Όλα θα συνδεθούν με την υποβολή στο CMS/Supabase.
              </p>
            </div>
            <Link
              href="/epikoinonia"
              className="inline-flex items-center gap-2 rounded-button bg-secondary-blue px-5 py-3 text-white hover:bg-secondary-blue/90 transition"
            >
              Μετάβαση στην υποβολή
            </Link>
          </div>
        </section>
      </Container>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: title,
            description: "Διασκεδαστικές δραστηριότητες και εκτυπώσιμα για παιδιά 0-6 ετών",
            numberOfItems: total,
            itemListElement: itemsWithImageUrls.slice(0, 10).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": item._type === "activity" ? "CreativeWork" : "CreativeWork",
                "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr"}/drastiriotites${item._type === "printable" ? `/printables` : ""}/${item.slug}`,
                name: item.title,
                description: item.summary || "",
                image: item.imageUrl || undefined,
              },
            })),
          }),
        }}
      />
    </PageWrapper>
  );
}
