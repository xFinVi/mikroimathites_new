import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getFeaturedArticles, getArticles, getRecipes, getActivities, getCategories, getAgeGroups, getCuratedCollectionByPlacement } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ContentFilters } from "@/components/content/content-filters";
import { SearchBar } from "@/components/content/search-bar";
import { ContentList } from "@/components/content/content-list";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image-url";

export const metadata = generateMetadataFor("gia-goneis");

interface PageProps {
  searchParams: Promise<{ age?: string; category?: string; search?: string }>;
}

export default async function GiaGoneisPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [featuredArticles, allArticles, allRecipes, allActivities, categories, ageGroups, quickTipsFromQuickTips, quickTipsFromParents] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
    getRecipes(),
    getActivities(),
    getCategories(),
    getAgeGroups(),
    getCuratedCollectionByPlacement("quick-tips"),
    getCuratedCollectionByPlacement("parentsPageQuickTips"),
  ]);
  
  // Use whichever collection exists (try quick-tips first, then parentsPageQuickTips)
  const quickTips = quickTipsFromQuickTips || quickTipsFromParents;
  
  // Combine articles, recipes, and activities into one content list
  const allContent = [
    ...allArticles.map((article) => ({ ...article, _contentType: 'article' as const })),
    ...allRecipes.map((recipe) => ({ ...recipe, _contentType: 'recipe' as const })),
    ...allActivities.map((activity) => ({ ...activity, _contentType: 'activity' as const })),
  ];

  // Category mapping - merge categories
  // When user selects "Διατροφή & Επιλογές", show both "Διατροφή & Επιλογές" and "Φυσικές Συνταγές"
  // When user selects "Τέχνες & Χειροτεχνίες", show both "Τέχνες & Χειροτεχνίες" and "Ιδέες Παιχνιδιού"
  const categoryMapping: Record<string, string[]> = {
    'diatrofi-epiloges': ['diatrofi-epiloges', 'fysikes-syntages'], // "Διατροφή & Επιλογές" includes recipes
    'diatrofi-and-epiloges': ['diatrofi-epiloges', 'fysikes-syntages'], // Handle URL format with "and"
    'texnes-xirotexnies': ['texnes-xirotexnies', 'idees-paixnidiou'], // "Τέχνες & Χειροτεχνίες" includes play ideas
  };

  // Filter content based on search params
  let filteredContent = allContent;
  
  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredContent = filteredContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        (item._contentType === 'article' && (item.excerpt?.toLowerCase().includes(searchLower) || item.body?.toString().toLowerCase().includes(searchLower))) ||
        (item._contentType === 'recipe' && item.summary?.toLowerCase().includes(searchLower)) ||
        (item._contentType === 'activity' && item.summary?.toLowerCase().includes(searchLower))
    );
  }
  
  // Age filter
  if (params.age) {
    filteredContent = filteredContent.filter((item) =>
      item.ageGroups?.some((ag) => ag.slug === params.age)
    );
  }
  
  // Category filter with mapping
  if (params.category) {
    // Normalize category slug (handle both "diatrofi-epiloges" and "diatrofi-and-epiloges")
    const normalizedCategory = params.category.replace(/-and-/g, '-');
    const mappedCategories = categoryMapping[normalizedCategory] || categoryMapping[params.category] || [normalizedCategory];
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Category filter debug:', {
        originalCategory: params.category,
        normalizedCategory,
        mappedCategories,
        totalRecipes: allRecipes.length,
        recipesWithCategories: allRecipes.filter((r: any) => r.category).map((r: any) => ({
          title: r.title,
          categorySlug: r.category?.slug
        })),
        filteredCount: filteredContent.filter((item: any) => {
          if (!item.category) return false;
          return mappedCategories.includes(item.category.slug);
        }).length
      });
    }
    
    filteredContent = filteredContent.filter((item) => {
      if (!item.category) return false;
      return mappedCategories.includes(item.category.slug);
    });
  }

  // Pre-generate image URLs for all content to avoid hydration mismatches
  const pregenerateImageUrl = <T extends { coverImage?: unknown }>(item: T): T & { imageUrl: string | null } => {
    return {
      ...item,
      imageUrl: item.coverImage ? urlFor(item.coverImage as any).width(400).height(250).url() : null,
    };
  };

  // Show mixed content when no filters/search, otherwise show filtered results
  const contentToShow = 
    params.age || params.category || params.search
      ? filteredContent.map(pregenerateImageUrl)
      : (() => {
          // Mix of content: 5 articles, 5 recipes, 5 activities (or available amounts)
          const articlesToShow = allArticles.slice(0, 5).map(pregenerateImageUrl);
          const recipesToShow = allRecipes.slice(0, 5).map(pregenerateImageUrl);
          const activitiesToShow = allActivities.slice(0, 5).map(pregenerateImageUrl);
          
          return [
            ...articlesToShow.map((article) => ({ ...article, _contentType: 'article' as const })),
            ...recipesToShow.map((recipe) => ({ ...recipe, _contentType: 'recipe' as const })),
            ...activitiesToShow.map((activity) => ({ ...activity, _contentType: 'activity' as const })),
          ];
        })();
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
          <ContentFilters ageGroups={ageGroups} categories={categories} />
        </div>

        {/* Content grid (Articles & Recipes) */}
        <ContentList
          items={contentToShow}
          title={
            params.age || params.category || params.search
              ? `Αποτελέσματα (${contentToShow.length})`
              : featuredArticles.length > 0
              ? "Προτεινόμενο περιεχόμενο"
              : "Τελευταίο περιεχόμενο"
          }
        />

        {/* Quick Tips list */}
        {quickTips ? (
          (() => {
            const validItems = quickTips.items?.filter((item: any) => item && item.slug && item.title) || [];
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
                  {validItems.map((item, idx) => {
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
                      <div className={`relative w-full h-48 bg-gradient-to-br ${colorClass} overflow-hidden`}>
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
                                {item._type === "recipe" ? "🍳" : item._type === "activity" ? "🎨" : "📄"}
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
                    ⚠️ Collection found but no valid items to display. Make sure all items are published and have slugs.
                  </p>
                </div>
              </section>
            );
          })()
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Γρήγορες λύσεις (5')</h2>
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
                  <span className="text-lg font-semibold text-primary-pink flex-shrink-0">{idx + 1}.</span>
                  <p className="text-text-dark">{tip}</p>
                </div>
              ))}
            </div>
            <div className="bg-background-light rounded-card p-6 border border-border/50">
              <p className="text-sm text-text-medium text-center">
                <strong className="text-text-dark">Δημιουργήστε μια Curated Collection στο Sanity Studio:</strong>
                <br />
                <span className="text-text-light mt-2 block">
                  • Placement: <code className="bg-background-white px-2 py-1 rounded text-xs">"quick-tips"</code> ή <code className="bg-background-white px-2 py-1 rounded text-xs">"parentsPageQuickTips"</code>
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
              <p className="text-text-medium">Όλα θα συνδεθούν με την υποβολή στο CMS/Supabase.</p>
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
    </PageWrapper>
  );
}

