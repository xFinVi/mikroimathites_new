import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { HomePage } from "@/components/home/home-page";
import { 
  getFeaturedArticles, 
  getFeaturedActivities, 
  getFeaturedPrintables, 
  getArticles,
  getActivities,
  getPrintables,
  getHomeHero,
  getFeaturedContentSection,
  getForParentsSection,
  getActivitiesPrintablesSection,
} from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { HOME_PAGE_LIMITS, HOME_PAGE_IMAGE_SIZES } from "@/lib/constants/home-page";
import { logger } from "@/lib/utils/logger";

export const metadata = generateMetadataFor("home");

// Add time-based revalidation as fallback (revalidates every hour)
export const revalidate = 3600;

// Helper function to get featured content with fallback logic
function getFeaturedContentWithFallback(
  featuredContentSection: Awaited<ReturnType<typeof getFeaturedContentSection>> | null,
  articlesToShow: Awaited<ReturnType<typeof getFeaturedArticles>>
): Array<{
  _id: string;
  _contentType: 'article' | 'activity' | 'recipe' | 'printable';
  title: string;
  slug: string;
  coverImage?: unknown;
  secondaryImage?: unknown;
  imageUrl: string | null;
  summary?: string;
  excerpt?: string;
  author?: {
    _id: string;
    name: string;
    slug?: string;
  };
  category?: {
    _id: string;
    title: string;
    slug: string;
  };
}> {
  // Priority 1: Manually curated from Featured Content Section
  if (featuredContentSection?.contentItems && featuredContentSection.contentItems.length > 0) {
    return featuredContentSection.contentItems
      .map((item) => {
        const content = item.article || item.activity || item.printable || item.recipe;
        if (!content || !content.slug) return null;
        
        return {
          _id: content._id,
          _contentType: (item.contentType || content._type) as 'article' | 'activity' | 'recipe' | 'printable',
          title: content.title,
          slug: content.slug,
          coverImage: content.coverImage,
          secondaryImage: content.secondaryImage,
          excerpt: content.excerpt,
          summary: content.summary,
          author: content.author,
          category: content.category,
          imageUrl: generateImageUrl(
            content.coverImage,
            HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.width,
            HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.height
          ),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, HOME_PAGE_LIMITS.FEATURED_CONTENT);
  }
  
  // Priority 2: Fallback to featured articles
  return articlesToShow.slice(0, HOME_PAGE_LIMITS.FEATURED_CONTENT).map(article => ({ 
    ...article, 
    _contentType: 'article' as const,
    imageUrl: generateImageUrl(
      article.coverImage,
      HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.width,
      HOME_PAGE_IMAGE_SIZES.FEATURED_CONTENT.height
    ),
  }));
}

export default async function Home() {
  // Fetch featured content and curated sections first (these are always needed)
  let featuredArticles: Awaited<ReturnType<typeof getFeaturedArticles>> = [];
  let featuredActivities: Awaited<ReturnType<typeof getFeaturedActivities>> = [];
  let featuredPrintables: Awaited<ReturnType<typeof getFeaturedPrintables>> = [];
  let allArticles: Awaited<ReturnType<typeof getArticles>> = [];
  let allActivities: Awaited<ReturnType<typeof getActivities>> = [];
  let allPrintables: Awaited<ReturnType<typeof getPrintables>> = [];
  let homeHero: Awaited<ReturnType<typeof getHomeHero>> = null;
  let featuredContentSection: Awaited<ReturnType<typeof getFeaturedContentSection>> = null;
  let forParentsSection: Awaited<ReturnType<typeof getForParentsSection>> = null;
  let activitiesPrintablesSection: Awaited<ReturnType<typeof getActivitiesPrintablesSection>> = null;

  try {
    // Fetch all required data in parallel with timeout protection
    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled([
      getFeaturedArticles(),
      getFeaturedActivities(),
      getFeaturedPrintables(),
      getHomeHero(),
      getFeaturedContentSection(),
      getForParentsSection(),
      getActivitiesPrintablesSection(),
    ]);

    // Extract results, handling both fulfilled and rejected promises
    [
      featuredArticles,
      featuredActivities,
      featuredPrintables,
      homeHero,
      featuredContentSection,
      forParentsSection,
      activitiesPrintablesSection,
    ] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        logger.warn(`Failed to fetch content item ${index}:`, result.reason);
        // Return appropriate default based on expected type
        return index < 3 ? [] : null; // First 3 are arrays, rest are objects/null
      }
    }) as [
      typeof featuredArticles,
      typeof featuredActivities,
      typeof featuredPrintables,
      typeof homeHero,
      typeof featuredContentSection,
      typeof forParentsSection,
      typeof activitiesPrintablesSection,
    ];

    // Only fetch all content if we need it for fallbacks
    // We need fallback content if:
    // 1. Featured content is empty, OR
    // 2. Curated sections don't provide enough content
    const needsArticleFallback = featuredArticles.length === 0 || 
      (featuredArticles.length < HOME_PAGE_LIMITS.FEATURED_ARTICLES && (!forParentsSection?.articles || forParentsSection.articles.length === 0));
    const needsActivityFallback = featuredActivities.length === 0 || 
      (featuredActivities.length < HOME_PAGE_LIMITS.FEATURED_ACTIVITIES && (!activitiesPrintablesSection?.contentItems || activitiesPrintablesSection.contentItems.length === 0));
    const needsPrintableFallback = featuredPrintables.length === 0 || 
      (featuredPrintables.length < HOME_PAGE_LIMITS.FEATURED_PRINTABLES && (!activitiesPrintablesSection?.contentItems || activitiesPrintablesSection.contentItems.length === 0));

    // Fetch fallback content only if needed
    if (needsArticleFallback || needsActivityFallback || needsPrintableFallback) {
      const fallbackPromises: Promise<unknown>[] = [];
      if (needsArticleFallback) fallbackPromises.push(getArticles().then(r => { allArticles = r; }));
      if (needsActivityFallback) fallbackPromises.push(getActivities().then(r => { allActivities = r; }));
      if (needsPrintableFallback) fallbackPromises.push(getPrintables().then(r => { allPrintables = r; }));
      
      if (fallbackPromises.length > 0) {
        await Promise.all(fallbackPromises);
      }
    }
  } catch (error) {
    // Log error but don't crash the page - use empty arrays as fallback
    logger.error('Failed to fetch content for home page:', error);
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

  // Get featured content using helper function
  const featuredContent = getFeaturedContentWithFallback(featuredContentSection, articlesToShow);

  // Transform For Parents Section articles
  // Note: We don't filter by coverImage - components handle missing images with placeholders
  const forParentsArticles = forParentsSection?.articles
    ?.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES)
    .map((article) => ({
      ...article,
      imageUrl: generateImageUrl(
        article.coverImage,
        HOME_PAGE_IMAGE_SIZES.CARD.width,
        HOME_PAGE_IMAGE_SIZES.CARD.height
      ),
    })) || [];

  // Transform Activities & Printables Section items
  // Note: We only filter out null content and items without slugs (unpublished)
  // Missing cover images are handled by components with placeholders
  const activitiesPrintablesItems = activitiesPrintablesSection?.contentItems
    ?.map((item) => {
      const content = item.activity || item.printable;
      // Filter out null content or items without slugs (unpublished)
      if (!content || !content.slug) return null;
      
      return {
        ...content,
        _contentType: (item.contentType || content._type) as 'activity' | 'printable',
        imageUrl: generateImageUrl(
          content.coverImage,
          HOME_PAGE_IMAGE_SIZES.CARD.width,
          HOME_PAGE_IMAGE_SIZES.CARD.height
        ),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES) || [];

  // Pre-generate image URL for home hero to avoid hydration mismatches
  const homeHeroImageUrl = generateImageUrl(
    homeHero?.image,
    HOME_PAGE_IMAGE_SIZES.HERO.width,
    HOME_PAGE_IMAGE_SIZES.HERO.height
  );

  return (
    <HomePage
      homeHeroImage={homeHeroImageUrl}
      featuredContent={featuredContent}
      featuredContentSection={featuredContentSection ? {
        title: featuredContentSection.title,
        subtitle: featuredContentSection.subtitle,
      } : undefined}
      forParentsSection={forParentsSection ? {
        title: forParentsSection.title,
        subtitle: forParentsSection.subtitle,
        viewAllText: forParentsSection.viewAllText,
        viewAllLink: forParentsSection.viewAllLink,
        articles: forParentsArticles,
      } : undefined}
      activitiesPrintablesSection={activitiesPrintablesSection ? {
        title: activitiesPrintablesSection.title,
        subtitle: activitiesPrintablesSection.subtitle,
        viewAllText: activitiesPrintablesSection.viewAllText,
        viewAllLink: activitiesPrintablesSection.viewAllLink,
        items: activitiesPrintablesItems,
      } : undefined}
    />
  );
}
