import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getRecipeBySlug, getRecipes } from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ContentTracker } from "@/components/analytics/content-tracker";
import { ViewCount } from "@/components/analytics/view-count";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Limit to first 20 recipes for faster builds (remaining generated on-demand).
  // Tolerate the CMS being unreachable (e.g. CI builds with dummy Sanity creds);
  // pages are still generated on-demand at runtime.
  try {
    const recipes = await getRecipes();
    return recipes.slice(0, 20).map((recipe) => ({
      slug: recipe.slug,
    }));
  } catch (error) {
    console.error("generateStaticParams (recipes) failed; generating on-demand:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Συνταγή δεν βρέθηκε",
    };
  }

  const seo = recipe.seo;
  const ogImage = generateImageUrl(
    recipe.coverImage,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.OG_IMAGE.width,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.OG_IMAGE.height
  ) || undefined;

  return {
    title: seo?.title || recipe.title,
    description: seo?.description || recipe.summary || undefined,
    openGraph: {
      title: seo?.title || recipe.title,
      description: seo?.description || recipe.summary || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
      publishedTime: recipe.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || recipe.title,
      description: seo?.description || recipe.summary || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo?.noIndex ? "noindex, nofollow" : undefined,
    alternates: { canonical: seo?.canonicalUrl || `/gia-goneis/recipes/${slug}` },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const coverImageUrl = generateImageUrl(
    recipe.coverImage,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.HERO.width,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.HERO.height
  );

  return (
    <PageWrapper>
      <ContentTracker
        content_type="recipe"
        content_slug={slug}
      />
      <article className="bg-background-light">
        {/* Hero Section */}
        {coverImageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              style={{ objectPosition: 'center top' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light" />
          </div>
        )}

        <Container className={`py-8 sm:py-12 md:py-16 ${!coverImageUrl ? 'pt-16 sm:pt-20 md:pt-24' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/gia-goneis"
              className="inline-flex items-center gap-2 text-text-medium hover:text-primary-pink transition mb-6 relative z-10 cursor-pointer py-2 -ml-2 pl-2 pr-4 rounded-md hover:bg-background-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Επιστροφή στις συνταγές
            </Link>

            {/* Recipe Header */}
            <header className="mb-8 space-y-4">
              {recipe.category && (
                <Link
                  href={`/gia-goneis?category=${recipe.category.slug}`}
                  className="inline-block px-4 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm font-semibold hover:bg-primary-pink/20 transition"
                >
                  {recipe.category.title}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark">
                {recipe.title}
              </h1>

              {recipe.summary && (
                <p className="text-xl text-text-medium leading-relaxed">
                  {recipe.summary}
                </p>
              )}

              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-text-medium">
                {recipe.difficulty && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Δυσκολία:</span>
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                )}
                {recipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Προετοιμασία:</span>
                    <span>{recipe.prepTime} λεπτά</span>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Μαγείρεμα:</span>
                    <span>{recipe.cookTime} λεπτά</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Μερίδες:</span>
                    <span>{recipe.servings}</span>
                  </div>
                )}
                <ViewCount
                  content_type="recipe"
                  content_slug={slug}
                  showIcon={true}
                />
              </div>
            </header>

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-text-dark mb-4">Υλικά</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-pink mt-1">•</span>
                      <span className="text-text-dark">
                        {ingredient.amount && <strong>{ingredient.amount}</strong>}{" "}
                        {ingredient.name}
                        {ingredient.notes && (
                          <span className="text-text-medium text-sm"> ({ingredient.notes})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {recipe.instructions && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-dark mb-4">Οδηγίες</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={recipe.instructions} />
                </div>
              </div>
            )}

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-text-dark mb-3">💡 Συμβουλές</h2>
                <ul className="space-y-2">
                  {recipe.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="text-text-dark">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition Notes */}
            {recipe.nutritionNotes && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-text-dark mb-3">🥗 Σημειώσεις Διατροφής</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={recipe.nutritionNotes} />
                </div>
              </div>
            )}
          </div>
        </Container>
      </article>
    </PageWrapper>
  );
}


