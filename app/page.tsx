import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { HomePage } from "@/components/home/home-page";
import { 
  getFeaturedArticles, 
  getFeaturedActivities, 
  getFeaturedPrintables, 
  getAgeGroups,
  getArticles,
  getActivities,
  getPrintables,
  getRecipes,
  getFeaturedRecipes,
  getPageSettings,
} from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";

export const metadata = generateMetadataFor("home");

export default async function Home() {
  // Fetch both featured and all content for fallbacks
  const [
    featuredArticles,
    allArticles,
    featuredActivities,
    allActivities,
    featuredPrintables,
    allPrintables,
    ageGroups,
    featuredRecipes,
    allRecipes,
    pageSettings,
  ] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
    getFeaturedActivities(),
    getActivities(),
    getFeaturedPrintables(),
    getPrintables(),
    getAgeGroups(),
    getFeaturedRecipes(),
    getRecipes(),
    getPageSettings(),
  ]);

  // Filter to only include items with coverImage
  const filterWithImages = <T extends { coverImage?: unknown }>(items: T[]): T[] => {
    return items.filter(item => item.coverImage);
  };

  // Use featured if available, otherwise use latest from all content
  // Only include items with coverImage
  const articlesToShow = filterWithImages(
    featuredArticles.length > 0 
      ? featuredArticles.slice(0, 6)
      : allArticles.slice(0, 6)
  );
  
  const activitiesToShow = filterWithImages(
    featuredActivities.length > 0
      ? featuredActivities.slice(0, 4)
      : allActivities.slice(0, 4)
  );
  
  const printablesToShow = filterWithImages(
    featuredPrintables.length > 0
      ? featuredPrintables.slice(0, 4)
      : allPrintables.slice(0, 4)
  );

  const recipesToShow = filterWithImages(
    featuredRecipes.length > 0
      ? featuredRecipes.slice(0, 2)
      : allRecipes.slice(0, 2)
  );

  // Featured content for the new section - Only articles from Sanity
  // Only include items with coverImage
  // Pre-generate image URLs on server to avoid hydration mismatches
  const featuredContent = articlesToShow.slice(0, 6).map(article => ({ 
    ...article, 
    _contentType: 'article' as const,
    imageUrl: article.coverImage ? urlFor(article.coverImage).width(600).height(400).url() : null,
  }));

  // Pre-generate image URLs for articles to avoid hydration mismatches
  const articlesWithImageUrls = articlesToShow.slice(0, 3).map(article => ({
    ...article,
    imageUrl: article.coverImage ? urlFor(article.coverImage).width(400).height(250).url() : null,
  }));

  return (
    <HomePage
      featuredBanner={pageSettings?.home?.featuredBanner}
      featuredContent={featuredContent}
      featuredArticles={articlesWithImageUrls}
      featuredActivities={activitiesToShow}
      featuredPrintables={printablesToShow}
      ageGroups={ageGroups}
    />
  );
}
