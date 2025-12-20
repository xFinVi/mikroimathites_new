import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { PageHeader } from "@/components/pages/page-header";
import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { getFeaturedArticles, getArticles, getCategories, getAgeGroups, getCuratedCollectionByPlacement } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ContentFilters } from "@/components/content/content-filters";
import { SearchBar } from "@/components/content/search-bar";
import { ArticlesList } from "@/components/articles/articles-list";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadataFor("gia-goneis");

interface PageProps {
  searchParams: Promise<{ age?: string; category?: string; search?: string }>;
}

export default async function GiaGoneisPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [featuredArticles, allArticles, categories, ageGroups, quickTips] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
    getCategories(),
    getAgeGroups(),
    getCuratedCollectionByPlacement("quick-tips"),
  ]);

  // Filter articles based on search params
  let filteredArticles = allArticles;
  
  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt?.toLowerCase().includes(searchLower) ||
        article.body?.toString().toLowerCase().includes(searchLower)
    );
  }
  
  // Age filter
  if (params.age) {
    filteredArticles = filteredArticles.filter((article) =>
      article.ageGroups?.some((ag) => ag.slug === params.age)
    );
  }
  
  // Category filter
  if (params.category) {
    filteredArticles = filteredArticles.filter(
      (article) => article.category?.slug === params.category
    );
  }

  // Show featured articles if no filters/search, otherwise show filtered results
  const articlesToShow = 
    params.age || params.category || params.search
      ? filteredArticles
      : featuredArticles.length > 0
      ? featuredArticles
      : allArticles.slice(0, 6);
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
              eyebrow="Parent Hub"
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

        {/* Featured Categories */}
        {categories && categories.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Κύριες ενότητες</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category._id}
                  href={`/gia-goneis?category=${category.slug}`}
                  className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="text-2xl font-semibold text-text-dark mb-2">
                    {category.title}
                  </div>
                  {category.description && (
                    <p className="text-text-medium text-sm">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Articles grid */}
        <ArticlesList
          articles={articlesToShow}
          title={
            params.age || params.category || params.search
              ? `Αποτελέσματα (${articlesToShow.length})`
              : featuredArticles.length > 0
              ? "Προτεινόμενα άρθρα"
              : "Τελευταία άρθρα"
          }
        />

        {/* Quick Tips list */}
        {quickTips && quickTips.items && quickTips.items.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                {quickTips.title || "Γρήγορες λύσεις (5')"}
              </h2>
            </div>
            {quickTips.description && (
              <p className="text-text-medium">{quickTips.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.items.map((item, idx) => (
                <Link
                  key={item._id}
                  href={
                    item._type === "article"
                      ? `/gia-goneis/${item.slug}`
                      : item._type === "activity"
                      ? `/drastiriotites/${item.slug}`
                      : item._type === "printable"
                      ? `/drastiriotites/printables/${item.slug}`
                      : "#"
                  }
                  className="bg-background-white rounded-card p-4 shadow-subtle border border-border/50 hover:shadow-md transition-all flex items-center gap-3"
                >
                  <span className="text-lg font-semibold text-primary-pink">{idx + 1}.</span>
                  <p className="text-text-dark">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
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
                  className="bg-background-white rounded-card p-4 shadow-subtle border border-border/50 flex items-center gap-3"
                >
                  <span className="text-lg font-semibold text-primary-pink">{idx + 1}.</span>
                  <p className="text-text-dark">{tip}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-text-light text-center">
              Προσθέστε μια Curated Collection με placement "quick-tips" στο Sanity Studio για να εμφανίζονται εδώ
            </p>
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

