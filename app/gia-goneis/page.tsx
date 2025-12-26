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
  searchParams?: Promise<{ age?: string; category?: string; search?: string; page?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
    age?: string;
    category?: string;
    search?: string;
    page?: string;
  };
  const base = generateMetadataFor("gia-goneis");

  const parts: string[] = [];
  if (params.category) parts.push("Κατηγορία");
  if (params.age) parts.push("Ηλικία");
  if (params.search) parts.push(`Αναζήτηση: ${params.search}`);
  const suffix = parts.length ? ` — ${parts.join(" • ")}` : "";

  // Handle title - can be string or object
  const baseTitle =
    typeof base.title === "string"
      ? base.title
      : (base.title as any)?.default ?? "Για Γονείς";

  // Canonical: don't include page param, and use base URL for search pages (noindex)
  const hasSearch = !!params.search;
  const canonical = hasSearch ? "/gia-goneis" : (() => {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.age) qs.set("age", params.age);
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
      ...(base as any)?.alternates,
      canonical,
    },
  } as Metadata;
}

// Incremental static regeneration
export const revalidate = 600;

interface PageProps {
  searchParams?: Promise<{ age?: string; category?: string; search?: string; page?: string }>;
}

// Category mapping - merge categories
const getMappedCategories = (categorySlug: string): string[] => {
  const normalized = categorySlug.replace(/-and-/g, "-");
  const mapping: Record<string, string[]> = {
    // "Διατροφή & Επιλογές" includes recipes
    "diatrofi-epiloges": ["diatrofi-epiloges", "fysikes-syntages"],
    // "Τέχνες & Χειροτεχνίες" includes play ideas
    "texnes-xirotexnies": ["texnes-xirotexnies", "idees-paixnidiou"],
  };
  return mapping[normalized] ?? [normalized];
};

export default async function GiaGoneisPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const params = (resolvedSearchParams ?? {}) as {
    age?: string;
    category?: string;
    search?: string;
    page?: string;
  };
  
  // Get current page (default to 1, validate it's a number)
  const pageNum = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  
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
      page: currentPage,
      pageSize: PAGE_SIZE,
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
  const hasFilters = !!(params.age || params.category || params.search);

  // Pre-generate image URLs for all items
  // Type assertion needed because GROQ returns _type but our interfaces don't include it
  const itemsWithImageUrls = items.map((item: any) => ({
    ...item,
    _contentType:
      item._type === "article"
        ? ("article" as const)
        : item._type === "recipe"
          ? ("recipe" as const)
          : ("activity" as const),
    imageUrl: item.coverImage
      ? urlFor(item.coverImage as any).width(400).height(250).url()
      : null,
  }));

  // Calculate pagination
  // If total is 0, totalPages should be 0 (not 1) so pagination doesn't show
  const totalPages = total === 0 ? 0 : Math.ceil(total / PAGE_SIZE);
  
  // Validate current page is within bounds
  const validatedCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  // If user requested an out-of-range page, redirect to the last valid page
  if (totalPages > 0 && currentPage !== validatedCurrentPage) {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.age) qs.set("age", params.age);
    if (params.search) qs.set("search", params.search);
    qs.set("page", String(validatedCurrentPage));
    redirect(`/gia-goneis?${qs.toString()}`);
  }

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
          <div className="rounded-2xl border border-border/50 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-text-dark">Δεν βρέθηκαν αποτελέσματα</h2>
            <p className="mt-2 text-text-medium">
              Δοκιμάστε άλλη λέξη ή αλλάξτε κατηγορία/ηλικία.
            </p>
                <Link
              href="/gia-goneis"
              className="mt-5 inline-flex rounded-button bg-primary-pink px-5 py-3 text-white hover:bg-primary-pink/90 transition"
                >
              Επιστροφή σε όλα
            </Link>
                  </div>
        ) : (
          <>
            <ContentList items={itemsWithImageUrls} title={title} />
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={validatedCurrentPage} totalPages={totalPages} />
            )}
          </>
        )}

        {/* Quick Tips list */}
        {quickTips ? (
          (() => {
            const validItems =
              quickTips.items?.filter((item: any) => item && item.slug && item.title) || [];
            return validItems.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                {quickTips.title || "Γρήγορες λύσεις (5')"}
              </h2>
            </div>
            {quickTips.description && (
              <p className="text-text-medium">{quickTips.description}</p>
            )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {validItems.map((item: any, idx: number) => {
                    // Build the correct URL based on content type
                    let href = "#";
                    if (item.slug) {
                      if (item._type === "article") {
                        href = `/gia-goneis/${item.slug}`;
                      } else if (item._type === "activity") {
                        href = `/drastiriotites/${item.slug}`;
                      } else if (item._type === "printable") {
                        href = `/drastiriotites/printables/${item.slug}`;
                      } else if (item._type === "recipe") {
                        href = `/gia-goneis/recipes/${item.slug}`;
                      }
                    }

                    // Get image URL
                    const imageUrl = item.coverImage
                      ? urlFor(item.coverImage).width(400).height(300).url()
                      : null;

                    // Playful color variations for cards
                    const colorVariants = [
                      "from-pink-100 to-pink-50 border-pink-200",
                      "from-blue-100 to-blue-50 border-blue-200",
                      "from-yellow-100 to-yellow-50 border-yellow-200",
                      "from-green-100 to-green-50 border-green-200",
                    ];
                    const colorClass = colorVariants[idx % colorVariants.length];

                    return (
                <Link
                        key={item._id || `item-${idx}`}
                        href={href}
                        className="group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary-pink/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
                      >
                        {/* Number Badge */}
                        <div className="absolute top-3 left-3 z-10 bg-primary-pink text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                          {idx + 1}
                        </div>

                        {/* Image Section */}
                        <div
                          className={`relative w-full h-48 bg-gradient-to-br ${colorClass} overflow-hidden`}
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-5xl mb-2">
                                  {item._type === "recipe"
                                    ? "🍳"
                      : item._type === "activity"
                                      ? "🎨"
                                      : "📄"}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Gradient overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-1 flex flex-col bg-white">
                          <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors">
                            {item.title}
                          </h3>

                          {/* Content Type Badge */}
                          <div className="mt-auto pt-3 border-t border-border/30">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-medium">
                              {item._type === "recipe" && "🍳 Συνταγή"}
                              {item._type === "activity" && "🎨 Δραστηριότητα"}
                              {item._type === "article" && "📄 Άρθρο"}
                              {item._type === "printable" && "🖨️ Εκτυπώσιμο"}
                            </span>
                          </div>
                        </div>
                </Link>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                    {quickTips.title || "Γρήγορες λύσεις (5')"}
                  </h2>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Collection found but no valid items to display. Make sure all items are
                    published and have slugs.
                  </p>
            </div>
          </section>
            );
          })()
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                Γρήγορες λύσεις (5')
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "3 φράσεις για ήρεμες μεταβάσεις",
                "Μικρά παιχνίδια λεξιλογίου",
                "Απαλά όρια χωρίς θυμούς",
                "Ρουτίνα ύπνου σε 4 βήματα",
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-background-white rounded-card p-4 shadow-subtle border border-border/50 flex items-center gap-3 opacity-60"
                >
                  <span className="text-lg font-semibold text-primary-pink flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <p className="text-text-dark">{tip}</p>
                </div>
              ))}
            </div>
            <div className="bg-background-light rounded-card p-6 border border-border/50">
              <p className="text-sm text-text-medium text-center">
                <strong className="text-text-dark">
                  Δημιουργήστε μια Curated Collection στο Sanity Studio:
                </strong>
                <br />
                <span className="text-text-light mt-2 block">
                  • Placement:{" "}
                  <code className="bg-background-white px-2 py-1 rounded text-xs">
                    "quick-tips"
                  </code>{" "}
                  ή{" "}
                  <code className="bg-background-white px-2 py-1 rounded text-xs">
                    "parentsPageQuickTips"
                  </code>
                  <br />
                  • Προσθέστε 4+ άρθρα/δραστηριότητες/συνταγές για να εμφανίζονται εδώ
                </span>
              </p>
            </div>
          </section>
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
            itemListElement: itemsWithImageUrls.slice(0, 10).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": item._type === "article" ? "Article" : item._type === "recipe" ? "Recipe" : "CreativeWork",
                "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr"}/gia-goneis${item._type === "recipe" ? `/recipes` : ""}/${item.slug}`,
                name: item.title,
                description: item.excerpt || item.summary || "",
                image: item.imageUrl || undefined,
              },
            })),
          }),
        }}
      />
    </PageWrapper>
  );
}
