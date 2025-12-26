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
import Image from "next/image";
import Link from "next/link";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { getContentUrl, type ContentType } from "@/lib/utils/content-url";
import { EmptyState } from "@/components/ui/empty-state";
import { DRASTIRIOTITES_CONSTANTS } from "@/lib/constants/drastiriotites";
import { logger } from "@/lib/utils/logger";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Dynamic metadata with canonical URLs
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ age?: string; type?: string; search?: string; page?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
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

  // Handle title - extract string from metadata object
  const getTitleString = (title: string | { default?: string } | undefined): string => {
    if (typeof title === "string") return title;
    if (title && typeof title === "object" && "default" in title) {
      return title.default ?? "Δραστηριότητες & Εκτυπώσιμα";
    }
    return "Δραστηριότητες & Εκτυπώσιμα";
  };
  const baseTitle = getTitleString(base.title);

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
      ...(typeof base === "object" && base && "alternates" in base
        ? (base.alternates as { canonical?: string })
        : {}),
      canonical,
    },
  } as Metadata;
}

// Incremental static regeneration
export const revalidate = 600;

interface PageProps {
  searchParams?: Promise<{ age?: string; type?: string; search?: string; page?: string }>;
}

export default async function DrastiriotitesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
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
      pageSize: DRASTIRIOTITES_CONSTANTS.PAGE_SIZE,
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
  const totalPages = total === 0 ? 0 : Math.ceil(total / DRASTIRIOTITES_CONSTANTS.PAGE_SIZE);

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

  // Helper to determine content type
  const getContentType = (item: { _type: string }): ContentType => {
    if (item._type === "activity") return "activity";
    if (item._type === "printable") return "printable";
    return "activity";
  };

  // Pre-generate image URLs for all items
  const itemsWithImageUrls = items.map((item) => {
    const contentType = getContentType(item);
    return {
      ...item,
      _contentType: contentType,
      imageUrl: generateImageUrl(
        item.coverImage,
        DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.width,
        DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.CARD.height
      ),
    };
  });

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
          <EmptyState
            title="Δεν βρέθηκαν αποτελέσματα"
            description="Δοκιμάστε άλλη λέξη ή αλλάξτε φίλτρα."
            action={{
              label: "Επιστροφή σε όλα",
              href: "/drastiriotites",
            }}
          />
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
            itemListElement: itemsWithImageUrls.slice(0, 10).map((item, index) => {
              const contentType = getContentType(item);
              const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr";
              const itemUrl = getContentUrl(contentType, item.slug);
              
              return {
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "CreativeWork",
                  "@id": `${baseUrl}${itemUrl}`,
                  name: item.title,
                  description: item.summary || "",
                  image: item.imageUrl || undefined,
                },
              };
            }),
          }),
        }}
      />
    </PageWrapper>
  );
}
