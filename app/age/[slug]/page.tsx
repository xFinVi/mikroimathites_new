import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getAgeGroups, getArticles, getActivities, getPrintables, getRecipes, getCuratedCollectionByPlacement, getCategories } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import { AgeGroupHero } from "@/components/age-group/age-group-hero";
import { AgeGroupContentGrid } from "@/components/age-group/age-group-content-grid";
import { AgeGroupCategories } from "@/components/age-group/age-group-categories";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; category?: string; search?: string }>;
}

export async function generateStaticParams() {
  const ageGroups = await getAgeGroups();
  return ageGroups.map((ageGroup) => ({
    slug: ageGroup.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ageGroups = await getAgeGroups();
  const ageGroup = ageGroups.find((ag) => ag.slug === slug);

  if (!ageGroup) {
    return {
      title: "Ηλικιακή ομάδα δεν βρέθηκε",
    };
  }

  return {
    title: `${ageGroup.title} | Μικροί Μαθητές`,
    description: `Περιεχόμενο, δραστηριότητες και συμβουλές για παιδιά ${ageGroup.title.toLowerCase()}`,
    openGraph: {
      title: `${ageGroup.title} | Μικροί Μαθητές`,
      description: `Περιεχόμενο, δραστηριότητες και συμβουλές για παιδιά ${ageGroup.title.toLowerCase()}`,
    },
  };
}

export default async function AgeGroupPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  
  const [ageGroups, allArticles, allActivities, allPrintables, allRecipes, featuredCollection, allCategories] = await Promise.all([
    getAgeGroups(),
    getArticles(),
    getActivities(),
    getPrintables(),
    getRecipes(),
    getCuratedCollectionByPlacement(`age-${slug}`),
    getCategories(),
  ]);

  // Normalize slug (handle both "0-2" and "0_2" formats)
  const normalizeSlug = (s: string) => s.replace(/_/g, "-");
  const normalizedSlug = normalizeSlug(slug);
  
  const ageGroup = ageGroups.find((ag) => {
    const agSlug = normalizeSlug(ag.slug);
    return agSlug === normalizedSlug || ag.slug === slug;
  });
  
  if (!ageGroup) {
    notFound();
  }

  // Filter all content by age group (check both slug formats)
  const articles = allArticles.filter((article) =>
    article.ageGroups?.some((ag) => {
      const agSlug = normalizeSlug(ag.slug);
      return agSlug === normalizedSlug || ag.slug === slug;
    })
  );
  const activities = allActivities.filter((activity) =>
    activity.ageGroups?.some((ag) => {
      const agSlug = normalizeSlug(ag.slug);
      return agSlug === normalizedSlug || ag.slug === slug;
    })
  );
  const printables = allPrintables.filter((printable) =>
    printable.ageGroups?.some((ag) => {
      const agSlug = normalizeSlug(ag.slug);
      return agSlug === normalizedSlug || ag.slug === slug;
    })
  );
  const recipes = allRecipes.filter((recipe) =>
    recipe.ageGroups?.some((ag) => {
      const agSlug = normalizeSlug(ag.slug);
      return agSlug === normalizedSlug || ag.slug === slug;
    })
  );

  // Get categories that have content for this age group
  const categoriesWithContent = new Set<string>();
  [...articles, ...activities, ...printables, ...recipes].forEach((item) => {
    if (item.category) {
      categoriesWithContent.add(item.category.slug);
    }
  });

  // Apply additional filters from search params
  let filteredArticles = articles;
  let filteredActivities = activities;
  let filteredPrintables = printables;
  let filteredRecipes = recipes;

  if (searchParamsResolved.category) {
    filteredArticles = filteredArticles.filter(
      (item) => item.category?.slug === searchParamsResolved.category
    );
    filteredActivities = filteredActivities.filter(
      (item) => item.category?.slug === searchParamsResolved.category
    );
    filteredPrintables = filteredPrintables.filter(
      (item) => item.category?.slug === searchParamsResolved.category
    );
    filteredRecipes = filteredRecipes.filter(
      (item) => item.category?.slug === searchParamsResolved.category
    );
  }

  if (searchParamsResolved.search) {
    const searchLower = searchParamsResolved.search.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt?.toLowerCase().includes(searchLower)
    );
    filteredActivities = filteredActivities.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower)
    );
    filteredPrintables = filteredPrintables.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower)
    );
    filteredRecipes = filteredRecipes.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower)
    );
  }

  // Determine which content type to show based on filter
  const activeType = searchParamsResolved.type || "all";

  return (
    <PageWrapper>
      <div className="bg-background-light">
        {/* Hero Section - Dynamic styling based on age group */}
        <AgeGroupHero ageGroup={ageGroup} />

        <Container className="py-10 sm:py-14 md:py-16 space-y-12">
          {/* Featured Content (if curated collection exists) */}
          {featuredCollection && featuredCollection.items && featuredCollection.items.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                Προτεινόμενο περιεχόμενο
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCollection.items.map((item) => {
                  const imageUrl = item.coverImage
                    ? urlFor(item.coverImage).width(400).height(250).url()
                    : null;
                  const itemUrl =
                    item._type === "article"
                      ? `/gia-goneis/${item.slug}`
                      : item._type === "activity"
                      ? `/drastiriotites/${item.slug}`
                      : item._type === "printable"
                      ? `/drastiriotites/printables/${item.slug}`
                      : item._type === "recipe"
                      ? `/gia-goneis/recipes/${item.slug}`
                      : "#";

                  return (
                    <Link
                      key={item._id}
                      href={itemUrl}
                      className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-lg transition-shadow"
                    >
                      {imageUrl && (
                        <div className="relative w-full h-48 bg-background-light">
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5 space-y-3">
                        <div className="text-xs font-semibold text-primary-pink">
                          {item._type === "article"
                            ? "Άρθρο"
                            : item._type === "activity"
                            ? "Δραστηριότητα"
                            : item._type === "printable"
                            ? "Εκτυπώσιμο"
                            : "Συνταγή"}
                        </div>
                        <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-text-medium text-sm line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Content Grid with Type Filter */}
          <AgeGroupContentGrid
            ageGroup={ageGroup}
            articles={filteredArticles}
            activities={filteredActivities}
            printables={filteredPrintables}
            recipes={filteredRecipes}
            activeType={activeType}
            searchParams={searchParamsResolved}
          />

          {/* Category Navigation */}
          {categoriesWithContent.size > 0 && (
            <AgeGroupCategories
              ageGroupSlug={slug}
              categoriesWithContent={Array.from(categoriesWithContent)}
              allCategories={allCategories}
            />
          )}
        </Container>
      </div>
    </PageWrapper>
  );
}

