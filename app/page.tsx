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
  getPageSettings,
} from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import { HOME_PAGE_LIMITS, HOME_PAGE_IMAGE_SIZES } from "@/lib/constants/home-page";

export const metadata = generateMetadataFor("home");

// Add time-based revalidation as fallback (revalidates every hour)
export const revalidate = 3600;

export default async function Home() {
  // Fetch both featured and all content for fallbacks with error handling
  let featuredArticles: Awaited<ReturnType<typeof getFeaturedArticles>> = [];
  let allArticles: Awaited<ReturnType<typeof getArticles>> = [];
  let featuredActivities: Awaited<ReturnType<typeof getFeaturedActivities>> = [];
  let allActivities: Awaited<ReturnType<typeof getActivities>> = [];
  let featuredPrintables: Awaited<ReturnType<typeof getFeaturedPrintables>> = [];
  let allPrintables: Awaited<ReturnType<typeof getPrintables>> = [];
  let ageGroups: Awaited<ReturnType<typeof getAgeGroups>> = [];
  let pageSettings: Awaited<ReturnType<typeof getPageSettings>> = null;

  try {
    [
      featuredArticles,
      allArticles,
      featuredActivities,
      allActivities,
      featuredPrintables,
      allPrintables,
      ageGroups,
      pageSettings,
    ] = await Promise.all([
      getFeaturedArticles(),
      getArticles(),
      getFeaturedActivities(),
      getActivities(),
      getFeaturedPrintables(),
      getPrintables(),
      getAgeGroups(),
      getPageSettings(),
    ]);
  } catch (error) {
    // Log error but don't crash the page - use empty arrays as fallback
    console.error('Failed to fetch content for home page:', error);
    // All variables already initialized to empty arrays/null
  }

  // Filter to only include items with coverImage
  const filterWithImages = <T extends { coverImage?: unknown }>(items: T[]): T[] => {
    return items.filter(item => item.coverImage);
  };

  // Use featured if available, otherwise use latest from all content
  // Only include items with coverImage
  const articlesToShow = filterWithImages(
    featuredArticles.length > 0 
      ? featuredArticles.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES)
      : allArticles.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES)
  );
  
  const activitiesToShow = filterWithImages(
    featuredActivities.length > 0
      ? featuredActivities.slice(0, HOME_PAGE_LIMITS.FEATURED_ACTIVITIES)
      : allActivities.slice(0, HOME_PAGE_LIMITS.FEATURED_ACTIVITIES)
  );
  
  const printablesToShow = filterWithImages(
    featuredPrintables.length > 0
      ? featuredPrintables.slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES)
      : allPrintables.slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES)
  );

  // Pre-generate image URLs for printables to avoid hydration mismatches
  const printablesWithImageUrls = printablesToShow.map(printable => ({
    ...printable,
    imageUrl: printable.coverImage 
      ? urlFor(printable.coverImage)
          .width(HOME_PAGE_IMAGE_SIZES.CARD.width)
          .height(HOME_PAGE_IMAGE_SIZES.CARD.height)
          .url() 
      : null,
  }));

  // Featured content for the new section - Only articles from Sanity
  // Only include items with coverImage
  // Pre-generate image URLs on server to avoid hydration mismatches
  const featuredContent = articlesToShow.slice(0, HOME_PAGE_LIMITS.FEATURED_CONTENT).map(article => ({ 
    ...article, 
    _contentType: 'article' as const,
    imageUrl: article.coverImage 
      ? urlFor(article.coverImage)
          .width(HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.width)
          .height(HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.height)
          .url() 
      : null,
  }));

  // Pre-generate image URLs for articles to avoid hydration mismatches
  const articlesWithImageUrls = articlesToShow.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES_GRID).map(article => ({
    ...article,
    imageUrl: article.coverImage 
      ? urlFor(article.coverImage)
          .width(HOME_PAGE_IMAGE_SIZES.CARD.width)
          .height(HOME_PAGE_IMAGE_SIZES.CARD.height)
          .url() 
      : null,
  }));

  // Pre-generate image URLs for activities to avoid hydration mismatches
  const activitiesWithImageUrls = activitiesToShow.map(activity => ({
    ...activity,
    imageUrl: activity.coverImage 
      ? urlFor(activity.coverImage)
          .width(HOME_PAGE_IMAGE_SIZES.CARD.width)
          .height(HOME_PAGE_IMAGE_SIZES.CARD.height)
          .url() 
      : null,
  }));

  // Pre-generate image URL for featured banner to avoid hydration mismatches
  let featuredBannerWithImageUrl = pageSettings?.home?.featuredBanner;
  if (featuredBannerWithImageUrl) {
    let bannerImageUrl: string | null = null;
    
    if (featuredBannerWithImageUrl.type === "youtube" && featuredBannerWithImageUrl.youtubeVideo?.thumbnail) {
      bannerImageUrl = urlFor(featuredBannerWithImageUrl.youtubeVideo.thumbnail)
        .width(HOME_PAGE_IMAGE_SIZES.BANNER.width)
        .height(HOME_PAGE_IMAGE_SIZES.BANNER.height)
        .url();
    } else if (featuredBannerWithImageUrl.type === "article" && featuredBannerWithImageUrl.contentRef?.coverImage) {
      bannerImageUrl = urlFor(featuredBannerWithImageUrl.contentRef.coverImage)
        .width(HOME_PAGE_IMAGE_SIZES.BANNER.width)
        .height(HOME_PAGE_IMAGE_SIZES.BANNER.height)
        .url();
    } else if (featuredBannerWithImageUrl.type === "activity" && featuredBannerWithImageUrl.contentRef?.coverImage) {
      bannerImageUrl = urlFor(featuredBannerWithImageUrl.contentRef.coverImage)
        .width(HOME_PAGE_IMAGE_SIZES.BANNER.width)
        .height(HOME_PAGE_IMAGE_SIZES.BANNER.height)
        .url();
    } else if (featuredBannerWithImageUrl.type === "recipe" && featuredBannerWithImageUrl.contentRef?.coverImage) {
      bannerImageUrl = urlFor(featuredBannerWithImageUrl.contentRef.coverImage)
        .width(HOME_PAGE_IMAGE_SIZES.BANNER.width)
        .height(HOME_PAGE_IMAGE_SIZES.BANNER.height)
        .url();
    } else if (featuredBannerWithImageUrl.type === "custom" && featuredBannerWithImageUrl.customImage) {
      bannerImageUrl = urlFor(featuredBannerWithImageUrl.customImage)
        .width(HOME_PAGE_IMAGE_SIZES.BANNER.width)
        .height(HOME_PAGE_IMAGE_SIZES.BANNER.height)
        .url();
    }
    
    featuredBannerWithImageUrl = {
      ...featuredBannerWithImageUrl,
      imageUrl: bannerImageUrl,
    };
  }

  return (
    <HomePage
      featuredBanner={featuredBannerWithImageUrl}
      featuredContent={featuredContent}
      featuredArticles={articlesWithImageUrls}
      featuredActivities={activitiesWithImageUrls}
      featuredPrintables={printablesWithImageUrls}
      ageGroups={ageGroups}
    />
  );
}
