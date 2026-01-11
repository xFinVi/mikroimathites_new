/**
 * "For Parents" Hub Page - Lists articles and recipes for parents
 * 
 * Displays filtered and searchable content from Sanity (articles, recipes).
 * Supports filtering by age group, category, and search queries.
 * Includes pagination and sorting options (latest, A-Z, views).
 */

import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import {
  getFeaturedArticles,
  getCategories,
  getAgeGroups,
  getCuratedCollectionByPlacement,
  getParentsHubContent,
} from "@/lib/content";
import { ContentFilters } from "@/components/content/content-filters";
import { SearchBar } from "@/components/content/search-bar";
import { ContentList } from "@/components/content/content-list";
import { ActiveFilters } from "@/components/content/active-filters";
import Image from "next/image";
import Link from "next/link";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { logger } from "@/lib/utils/logger";
import type { Metadata } from "next";
import { getMappedCategories, getContentUrl, type ContentType } from "@/lib/utils/content";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickTipsSection } from "@/components/gia-goneis/quick-tips-section";
import { LoadMoreContent } from "@/components/gia-goneis/load-more-content";

const INITIAL_PAGE_SIZE = GIA_GONEIS_CONSTANTS.INITIAL_PAGE_SIZE;

// Dynamic metadata with canonical URLs
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ age?: string; category?: string; search?: string; tag?: string; page?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
    age?: string;
    category?: string;
    search?: string;
    tag?: string;
    page?: string;
  };
  const base = generateMetadataFor("gia-goneis");

  const parts: string[] = [];
  if (params.category) parts.push("Κατηγορία");
  if (params.age) parts.push("Ηλικία");
  if (params.tag) parts.push("Ετικέτα");
  if (params.search) parts.push(`Αναζήτηση: ${params.search}`);
  const suffix = parts.length ? ` — ${parts.join(" • ")}` : "";

  // Handle title - extract string from metadata object
  const getTitleString = (title: string | { default?: string } | undefined): string => {
    if (typeof title === "string") return title;
    if (title && typeof title === "object" && "default" in title) {
      return title.default ?? "Για Γονείς";
    }
    return "Για Γονείς";
  };
  const baseTitle = getTitleString(base.title);

  // Canonical: don't include page param, and use base URL for search pages (noindex)
  const hasSearch = !!params.search;
  const canonical = hasSearch ? "/gia-goneis" : (() => {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.age) qs.set("age", params.age);
    if (params.tag) qs.set("tag", params.tag);
    return `/gia-goneis${qs.toString() ? `?${qs.toString()}` : ""}`;
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
  searchParams?: Promise<{ age?: string; category?: string; search?: string; tag?: string; page?: string; sort?: string }>;
}


export default async function GiaGoneisPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
    age?: string;
    category?: string;
    search?: string;
    tag?: string;
    page?: string;
  };
  
  // Always start with page 1 for initial load (load more handles subsequent pages)
  // Get mapped categories if category filter is active
  const mappedCategories = params.category ? getMappedCategories(params.category) : undefined;

  // Fetch all data in parallel (including content)
  const [
    featuredArticles,
    categories,
    ageGroups,
    quickTipsFromQuickTips,
    quickTipsFromParents,
    contentResult,
  ] = await Promise.allSettled([
    getFeaturedArticles(),
    getCategories(),
    getAgeGroups(),
    getCuratedCollectionByPlacement("quick-tips"),
    getCuratedCollectionByPlacement("parentsPageQuickTips"),
    getParentsHubContent({
      search: params.search,
      age: params.age,
      categories: mappedCategories,
      tag: params.tag,
      page: 1, // Always start with page 1
      pageSize: INITIAL_PAGE_SIZE, // Show only 9 items initially
      sortBy: (params.sort as "latest" | "popular" | "alphabetical") || "latest",
    }),
  ]);

  // Extract successful results, use empty arrays/null for failed ones
  const featuredArticlesData =
    featuredArticles.status === "fulfilled" ? featuredArticles.value : [];
  const categoriesData = categories.status === "fulfilled" ? categories.value : [];
  const ageGroupsData = ageGroups.status === "fulfilled" ? ageGroups.value : [];
  const quickTipsFromQuickTipsData =
    quickTipsFromQuickTips.status === "fulfilled" ? quickTipsFromQuickTips.value : null;
  const quickTipsFromParentsData =
    quickTipsFromParents.status === "fulfilled" ? quickTipsFromParents.value : null;
  const { items, total } =
    contentResult.status === "fulfilled" ? contentResult.value : { items: [], total: 0 };

  // Log errors for debugging
  if (featuredArticles.status === "rejected") {
    logger.error("Failed to fetch featured articles:", featuredArticles.reason);
  }
  if (categories.status === "rejected") {
    logger.error("Failed to fetch categories:", categories.reason);
  }
  if (ageGroups.status === "rejected") {
    logger.error("Failed to fetch age groups:", ageGroups.reason);
  }
  if (quickTipsFromQuickTips.status === "rejected") {
    logger.error("Failed to fetch quick tips collection:", quickTipsFromQuickTips.reason);
  }
  if (quickTipsFromParents.status === "rejected") {
    logger.error("Failed to fetch parents quick tips:", quickTipsFromParents.reason);
  }
  if (contentResult.status === "rejected") {
    logger.error("Failed to fetch content:", contentResult.reason);
  }

  const quickTips = quickTipsFromQuickTipsData || quickTipsFromParentsData;

  // Determine if we should show featured content or search results
  const hasFilters = !!(params.age || params.category || params.search || params.tag);

  // Pre-generate image URLs for all items
  // Type guard to determine content type safely
  const getContentType = (item: { _type: string }): ContentType => {
    if (item._type === "article") return "article";
    if (item._type === "recipe") return "recipe";
    if (item._type === "activity") return "activity";
    if (item._type === "printable") return "printable";
    return "article"; // Default fallback
  };

  const itemsWithImageUrls = items.map((item) => {
    const contentType = getContentType(item);
    return {
      ...item,
      _contentType: contentType,
      imageUrl: generateImageUrl(
        item.coverImage,
        GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.width,
        GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.height
      ),
    };
  });

  // Determine title
  const title = hasFilters
    ? `Αποτελέσματα (${total})`
    : featuredArticlesData.length > 0
      ? "Προτεινόμενο περιεχόμενο"
      : "Τελευταίο περιεχόμενο";

  return (
    <PageWrapper>
      {/* Hero with background image */}
      <div className="relative overflow-hidden bg-background-light">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Για Γονείς background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1330]/50 via-background-light/70 to-background-light" />
        </div>

        <Container className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              title="Για Γονείς"
              description="Σύντομες συμβουλές & πρακτικές ιδέες για την καθημερινότητα με το παιδί"
            />
          </div>
        </Container>
      </div>

      <Container className="py-10 sm:py-14 md:py-16 space-y-12">
        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar />
          <ContentFilters ageGroups={ageGroupsData} categories={categoriesData} />
        </div>

        {/* Active Filters Bar */}
        <ActiveFilters ageGroups={ageGroupsData} categories={categoriesData} />

        {/* Content grid or empty state */}
        {itemsWithImageUrls.length === 0 ? (
          <EmptyState
            title="Δεν βρέθηκαν αποτελέσματα"
            description="Δοκιμάστε άλλη λέξη ή αλλάξτε κατηγορία/ηλικία."
            action={{
              label: "Επιστροφή σε όλα",
              href: "/gia-goneis",
            }}
          />
        ) : (
          <LoadMoreContent
            initialItems={itemsWithImageUrls}
            initialTotal={total}
            initialTitle={title}
          />
        )}

        {/* Quick Tips list */}
        <QuickTipsSection quickTips={quickTips} />

        {/* Support / CTA */}
        <section className="space-y-4 bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-dark">Στείλτε μας ιδέα ή ερώτηση</h3>
            </div>
            <Link
              href="/epikoinonia"
              className="inline-flex items-center gap-2 rounded-button bg-primary-pink px-5 py-3 text-white hover:bg-primary-pink/90 transition"
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
            description: "Σύντομες συμβουλές & πρακτικές ιδέες για την καθημερινότητα με το παιδί",
            numberOfItems: total,
            itemListElement: itemsWithImageUrls.slice(0, 9).map((item, index) => {
              const contentType = getContentType(item);
              const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr";
              const itemUrl = getContentUrl(contentType, item.slug);
              
              // Map content type to Schema.org type
              const schemaType = contentType === "article" ? "Article" 
                : contentType === "recipe" ? "Recipe" 
                : "CreativeWork";
              
              return {
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": schemaType,
                  "@id": `${baseUrl}${itemUrl}`,
                  name: item.title,
                  description: item.excerpt || item.summary || "",
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
