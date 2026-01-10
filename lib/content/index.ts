import { sanityClient } from "@/lib/sanity/client";
import { type Sponsor } from "@/components/sponsors";
import { logger } from "@/lib/utils/logger";
import {
  articlesQuery,
  articleBySlugQuery,
  featuredArticlesQuery,
  nextArticleQuery,
  mostRecentArticleQuery,
  recipesQuery,
  recipeBySlugQuery,
  featuredRecipesQuery,
  activitiesQuery,
  activityBySlugQuery,
  featuredActivitiesQuery,
  printablesQuery,
  printableBySlugQuery,
  featuredPrintablesQuery,
  qaItemsQuery,
  curatedCollectionsQuery,
  curatedCollectionByPlacementQuery,
  curatedCollectionsByPlacementQuery,
  pageSettingsQuery,
  relatedContentQuery,
  categoriesQuery,
  ageGroupsQuery,
  authorsQuery,
  parentsHubContentQuery,
  parentsHubContentCountQuery,
  activitiesHubContentQuery,
  activitiesHubContentCountQuery,
  sponsorsQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";

// Common types
export interface Tag {
  _id: string;
  title: string;
  slug: string;
}

export interface AgeGroup {
  _id: string;
  title: string;
  slug: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface SEO {
  title?: string;
  description?: string;
  ogImage?: unknown;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export interface RelatedContentItem {
  _type: string;
  _id: string;
  title: string;
  slug: string;
  coverImage?: unknown;
  summary?: string;
  excerpt?: string;
}

// Content type interfaces
export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown;
  readingTime?: number;
  coverImage?: unknown;
  secondaryImage?: unknown;
  ageGroups?: AgeGroup[];
  tags?: Tag[];
  category?: Category;
  author?: {
    _id: string;
    name: string;
    slug: string;
    profilePicture?: unknown;
  };
  publishedAt?: string;
  featured?: boolean;
  seo?: SEO;
  relatedContent?: RelatedContentItem[];
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: unknown;
  secondaryImage?: unknown;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Array<{
    name: string;
    amount: string;
    notes?: string;
  }>;
  instructions?: unknown;
  tips?: string[];
  nutritionNotes?: string;
  ageGroups?: AgeGroup[];
  tags?: Tag[];
  category?: Category;
  publishedAt?: string;
  featured?: boolean;
  seo?: SEO;
  relatedContent?: RelatedContentItem[];
}

/**
 * Activity Step - New structured format
 * Each step can have an optional title, content (PortableText), and image
 */
export interface ActivityStep {
  _type: "activityStep";
  _key?: string;
  title?: string;
  content?: unknown; // PortableText blocks
  image?: unknown; // Sanity image
}

/**
 * Activity - Supports both new structured steps and legacy PortableText format
 */
export interface Activity {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  duration?: string;
  goals?: string[];
  materials?: string[];
  steps?: unknown; // Can be ActivityStep[] (new) or PortableText blocks (legacy)
  safetyNotes?: string;
  coverImage?: unknown;
  secondaryImage?: unknown;
  enableCarousel?: boolean;
  carouselImages?: Array<{
    asset?: unknown;
    alt?: string;
    caption?: string;
  }>;
  ageGroups?: AgeGroup[];
  tags?: Tag[];
  category?: Category;
  publishedAt?: string;
  featured?: boolean;
  seo?: SEO;
  relatedContent?: RelatedContentItem[];
}

export interface Printable {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  file?: unknown;
  previewImages?: unknown[];
  coverImage?: unknown;
  secondaryImage?: unknown;
  ageGroups?: AgeGroup[];
  tags?: Tag[];
  publishedAt?: string;
  featured?: boolean;
  seo?: SEO;
  relatedContent?: RelatedContentItem[];
}

export interface QAItem {
  _id: string;
  question: string;
  answer?: unknown; // PortableText content
  publishedAt?: string;
  ageGroups?: AgeGroup[];
  category?: Category;
}

export interface CuratedCollection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  placement: string;
  order?: number;
  items?: RelatedContentItem[];
  publishedAt?: string;
}

export interface FeaturedBanner {
  enabled?: boolean;
  type?: "youtube" | "article" | "activity" | "recipe" | "custom";
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text?: string;
    link?: string;
  };
  secondaryCta?: {
    text?: string;
    link?: string;
  };
  contentRef?: {
    _type: string;
    _id: string;
    title: string;
    slug: string;
    coverImage?: unknown;
    excerpt?: string;
    summary?: string;
  };
  youtubeVideo?: {
    videoId?: string;
    thumbnail?: unknown;
  };
  customImage?: unknown;
  backgroundColor?: string;
  customBackgroundColor?: string;
}

export interface PageSettings {
  home?: {
    hero?: {
      type: "image" | "video" | "none";
      image?: unknown;
      video?: {
        url: string;
        thumbnail?: unknown;
        autoplay?: boolean;
        loop?: boolean;
      };
      overlay?: {
        enabled?: boolean;
        opacity?: number;
        color?: string;
      };
      content?: {
        title?: string;
        subtitle?: string;
        ctaText?: string;
        ctaLink?: string;
        alignment?: "left" | "center" | "right";
      };
    };
    featuredBanner?: FeaturedBanner;
    seasonalBanner?: {
      enabled?: boolean;
      title?: string;
      subtitle?: string;
      image?: unknown;
      startDate?: string;
      endDate?: string;
    };
    featuredContent?: Array<{
      _type: "article" | "recipe" | "activity" | "printable";
      _id: string;
      title: string;
      slug: string;
      coverImage?: unknown;
      secondaryImage?: unknown;
      excerpt?: string;
      summary?: string;
      author?: {
        _id: string;
        name: string;
        slug?: string;
        profilePicture?: unknown;
      };
      category?: {
        _id: string;
        title: string;
        slug: string;
      };
    }>;
  };
  forParents?: {
    hero?: {
      type: "image" | "video" | "none";
      image?: unknown;
      video?: {
        url: string;
        thumbnail?: unknown;
        autoplay?: boolean;
        loop?: boolean;
      };
      overlay?: {
        enabled?: boolean;
        opacity?: number;
        color?: string;
      };
      content?: {
        title?: string;
        subtitle?: string;
        ctaText?: string;
        ctaLink?: string;
        alignment?: "left" | "center" | "right";
      };
    };
    featuredCategoryRefs?: Category[];
    featuredContentRefs?: RelatedContentItem[];
  };
  site?: {
    defaultOgImage?: unknown;
    logo?: unknown;
    navLinks?: Array<{
      label: string;
      url: string;
    }>;
  };
}

const safeClient = sanityClient;

// Article functions
export async function getArticles(): Promise<Article[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Article[]>(articlesQuery);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Article | null>(articleBySlugQuery, { slug });
}

/**
 * Get the next article to read
 * Returns the next newer article (published after the current one)
 * If no newer article exists, returns the most recent article as a fallback
 */
export async function getNextArticle(
  currentId: string,
  currentDate: string
): Promise<{ article: Article | null; isNewer: boolean }> {
  if (!safeClient) return { article: null, isNewer: false };

  try {
    // First, try to get the next newer article (published after current)
    const newerArticle = await safeClient.fetch<Article | null>(nextArticleQuery, {
      currentId,
      currentDate,
    });

    if (newerArticle) {
      return { article: newerArticle, isNewer: true };
    }

    // If no newer article, fallback to the most recent article
    const mostRecent = await safeClient.fetch<Article | null>(mostRecentArticleQuery, {
      currentId,
    });

    return { article: mostRecent, isNewer: false };
  } catch (error) {
    return { article: null, isNewer: false };
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Article[]>(featuredArticlesQuery);
}

// Recipe functions
export async function getRecipes(): Promise<Recipe[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Recipe[]>(recipesQuery);
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Recipe | null>(recipeBySlugQuery, { slug });
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Recipe[]>(featuredRecipesQuery);
}

// Activity functions
export async function getActivities(): Promise<Activity[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Activity[]>(activitiesQuery);
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Activity | null>(activityBySlugQuery, { slug });
}

export async function getFeaturedActivities(): Promise<Activity[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Activity[]>(featuredActivitiesQuery);
}

// Printable functions
export async function getPrintables(): Promise<Printable[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Printable[]>(printablesQuery);
}

export async function getPrintableBySlug(slug: string): Promise<Printable | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Printable | null>(printableBySlugQuery, { slug });
}

export async function getFeaturedPrintables(): Promise<Printable[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Printable[]>(featuredPrintablesQuery);
}

// QA Item functions
export async function getQAItems(): Promise<QAItem[]> {
  if (!safeClient) return [];
  return safeClient.fetch<QAItem[]>(qaItemsQuery);
}

// Curated Collection functions
export async function getCuratedCollections(): Promise<CuratedCollection[]> {
  if (!safeClient) return [];
  return safeClient.fetch<CuratedCollection[]>(curatedCollectionsQuery);
}

// Testimonial type
export interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  childAge?: string;
  rating?: number;
  featured?: boolean;
  order?: number;
  publishedAt?: string;
}

// Testimonial functions
export async function getTestimonials(limit = 4): Promise<Testimonial[]> {
  if (!safeClient) {
    logger.warn("Sanity client not available for fetching testimonials");
    return [];
  }
  try {
    const testimonials = await safeClient.fetch<Testimonial[]>(testimonialsQuery);
    logger.info(`Fetched ${testimonials.length} testimonials from Sanity`);
    // Limit results
    return testimonials.slice(0, limit);
  } catch (error) {
    logger.error("Failed to fetch testimonials from Sanity", error);
    return [];
  }
}

// Sponsor functions
export async function getSponsors(): Promise<Sponsor[]> {
  if (!safeClient) {
    logger.warn("Sanity client not available for fetching sponsors");
    return [];
  }
  try {
    const sponsors = await safeClient.fetch<Array<{
      _id: string;
      companyName: string;
      logo?: unknown;
      website?: string;
      category?: string;
      tier?: string;
      isActive?: boolean;
      isFeatured?: boolean;
      databaseId?: string;
    }>>(sponsorsQuery);
    
    logger.info(`Fetched ${sponsors.length} sponsors from Sanity`);
    
    // Map Sanity fields to Sponsor interface
    const mappedSponsors = sponsors.map(sponsor => ({
      _id: sponsor._id,
      name: sponsor.companyName,
      logo: sponsor.logo,
      website: sponsor.website,
      category: sponsor.category as Sponsor['category'],
      tier: sponsor.tier as Sponsor['tier'],
      featured: sponsor.isFeatured || false,
      isActive: sponsor.isActive ?? true,
    }));
    
    logger.info(`Mapped ${mappedSponsors.length} sponsors`);
    return mappedSponsors;
  } catch (error) {
    logger.error("Failed to fetch sponsors from Sanity", error);
    return [];
  }
}

export async function getCuratedCollectionByPlacement(
  placement: string
): Promise<CuratedCollection | null> {
  if (!safeClient) return null;
  const result = await safeClient.fetch<CuratedCollection | null>(curatedCollectionByPlacementQuery, {
    placement,
  });
  // Filter out null items, drafts, and items without required fields
  if (result && result.items) {
    result.items = result.items.filter((item: any) => {
      if (!item || !item._id) return false;
      // Check if it's a draft (draft IDs start with "drafts.")
      if (item._id.startsWith('drafts.')) return false;
      // Check if it has required fields
      if (!item.slug || !item.title) return false;
      return true;
    });
  }
  return result;
}

export async function getCuratedCollectionsByPlacement(
  placement: string
): Promise<CuratedCollection[]> {
  if (!safeClient) return [];
  const results = await safeClient.fetch<CuratedCollection[]>(curatedCollectionsByPlacementQuery, {
    placement,
  });
  
  // Filter out broken references from all collections
  return results.map((collection) => {
    if (collection.items) {
      collection.items = collection.items.filter((item: any) => {
        if (!item || !item._id) return false;
        // Check if it's a draft (draft IDs start with "drafts.")
        if (item._id.startsWith('drafts.')) return false;
        // Check if it has required fields
        if (!item.slug || !item.title) return false;
        return true;
      });
    }
    return collection;
  });
}

// Page Settings function
export async function getPageSettings(): Promise<PageSettings | null> {
  if (!safeClient) return null;
  return safeClient.fetch<PageSettings | null>(pageSettingsQuery);
}

// Home Hero
export interface HomeHero {
  image?: unknown;
}

export async function getHomeHero(): Promise<HomeHero | null> {
  if (!safeClient) return null;
  return safeClient.fetch<HomeHero | null>(
    `*[_type == "homeHero" && !(_id in path("drafts.**"))][0]{image}`
  );
}

// Featured Content Section
export interface FeaturedContentSection {
  title?: string;
  subtitle?: string;
  contentItems?: Array<{
    contentType: "article" | "activity" | "printable" | "recipe";
    article?: Article;
    activity?: Activity;
    printable?: Printable;
    recipe?: Recipe;
  }>;
}

export async function getFeaturedContentSection(): Promise<FeaturedContentSection | null> {
  if (!safeClient) return null;
  const result = await safeClient.fetch<FeaturedContentSection | null>(
    `*[_type == "featuredContentSection" && !(_id in path("drafts.**"))][0]{
      title,
      subtitle,
      "contentItems": contentItems[]{
        contentType,
        "article": article-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        },
        "activity": activity-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        },
        "printable": printable-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        },
        "recipe": recipe-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        }
      }
    }`
  );
  
  // Filter out items where the referenced document doesn't exist, is a draft, or doesn't have a slug
  if (result?.contentItems) {
    result.contentItems = result.contentItems.filter((item) => {
      const content = item.article || item.activity || item.printable || item.recipe;
      // Only include items that exist, are published (have slug), and match the content type
      return content && content.slug && content._type && !content._id.includes("drafts");
    });
  }
  
  return result;
}

// For Parents Section
export interface ForParentsSection {
  title?: string;
  subtitle?: string;
  viewAllText?: string;
  viewAllLink?: string;
  articles?: Article[];
}

export async function getForParentsSection(): Promise<ForParentsSection | null> {
  if (!safeClient) return null;
  const result = await safeClient.fetch<ForParentsSection | null>(
    `*[_type == "forParentsSection" && !(_id in path("drafts.**"))][0]{
      title,
      subtitle,
      viewAllText,
      viewAllLink,
      "articles": articles[]-> {
        _type,
        _id,
        title,
        "slug": slug.current,
        coverImage,
        secondaryImage,
        excerpt,
        summary,
        "author": author-> { _id, name, "slug": slug.current, profilePicture },
        "category": category-> { _id, title, "slug": slug.current }
      }
    }`
  );
  
  // Filter out articles where the referenced document doesn't exist, is a draft, or doesn't have a slug
  if (result?.articles) {
    result.articles = result.articles.filter((article) => {
      return article && article.slug && article._type && !article._id.includes("drafts");
    });
  }
  
  return result;
}

// Activities & Printables Section
export interface ActivitiesPrintablesSection {
  title?: string;
  subtitle?: string;
  viewAllText?: string;
  viewAllLink?: string;
  contentItems?: Array<{
    contentType: "activity" | "printable";
    activity?: Activity;
    printable?: Printable;
  }>;
}

export async function getActivitiesPrintablesSection(): Promise<ActivitiesPrintablesSection | null> {
  if (!safeClient) return null;
  const result = await safeClient.fetch<ActivitiesPrintablesSection | null>(
    `*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]{
      title,
      subtitle,
      viewAllText,
      viewAllLink,
      "contentItems": contentItems[]{
        contentType,
        "activity": activity-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        },
        "printable": printable-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          coverImage,
          secondaryImage,
          excerpt,
          summary,
          "author": author-> { _id, name, "slug": slug.current, profilePicture },
          "category": category-> { _id, title, "slug": slug.current }
        }
      }[defined(activity) || defined(printable)]
    }`
  );
  
  // Filter out items where the referenced document doesn't exist, is a draft, or doesn't have a slug
  // Note: We don't filter by coverImage - components handle missing images with placeholders
  if (result?.contentItems) {
    result.contentItems = result.contentItems.filter((item) => {
      const content = item.activity || item.printable;
      // Only include if content exists, has a slug (is published), and is not a draft
      // If content is null, it means the reference is broken or points to a non-existent document
      if (!content) return false;
      if (!content.slug) return false; // No slug means unpublished
      if (content._id?.startsWith('drafts.')) return false; // Draft document
      return true;
    });
  }
  
  return result;
}

// Category functions
export async function getCategories(): Promise<Category[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Category[]>(categoriesQuery);
}

// Age Group functions
export async function getAgeGroups(): Promise<AgeGroup[]> {
  if (!safeClient) return [];
  return safeClient.fetch<AgeGroup[]>(ageGroupsQuery);
}

// Author interface and functions
export interface Author {
  _id: string;
  name: string;
  slug: string;
  bio?: string;
  profilePicture?: unknown;
  role?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    website?: string;
  };
}

export async function getAuthors(): Promise<Author[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Author[]>(authorsQuery);
}

// Auto-related content function
export async function getAutoRelatedContent(
  currentSlug: string,
  categoryId?: string,
  ageGroupIds?: string[],
  tagIds?: string[]
): Promise<RelatedContentItem[]> {
  if (!safeClient) return [];
  if (!categoryId && (!ageGroupIds || ageGroupIds.length === 0) && (!tagIds || tagIds.length === 0)) {
    return [];
  }

  return safeClient.fetch<RelatedContentItem[]>(relatedContentQuery, {
    currentSlug,
    categoryId: categoryId || "",
    ageGroupIds: ageGroupIds || [],
    tagIds: tagIds || [],
  });
}

// Helper function to get related content (manual or auto)
export async function getRelatedContent(
  content: Article | Recipe | Activity | Printable
): Promise<RelatedContentItem[]> {
  // If manual related content exists, use it
  if (content.relatedContent && content.relatedContent.length > 0) {
    return content.relatedContent;
  }

  // Otherwise, auto-generate based on category, age groups, and tags
  const categoryId = "category" in content ? content.category?._id : undefined;
  const ageGroupIds = content.ageGroups?.map((ag) => ag._id) || [];
  const tagIds = content.tags?.map((tag) => tag._id) || [];

  return getAutoRelatedContent(content.slug, categoryId, ageGroupIds, tagIds);
}

// Parents Hub Content (server-side search + pagination)
export interface ParentsHubContentOptions {
  search?: string;
  age?: string;
  categories?: string[];
  tag?: string;
  page: number;
  pageSize: number;
}

export interface ParentsHubContentResult {
  items: (Article | Recipe | Activity)[];
  total: number;
}

export async function getParentsHubContent(
  opts: ParentsHubContentOptions
): Promise<ParentsHubContentResult> {
  if (!safeClient) return { items: [], total: 0 };

  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.max(1, Math.min(50, opts.pageSize || 18));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Normalize search - GROQ requires all referenced params to be provided
  // Use null for undefined values so GROQ can check !defined()
  // GROQ's match operator supports wildcards: "*term*" for substring matching
  // Sanitize: remove wildcards from user input, cap length, use Greek locale for lowercase
  const raw = opts.search?.trim() ?? "";
  const cleaned = raw.replace(/\*/g, "").slice(0, 80); // Remove wildcards, cap at 80 chars
  const search = cleaned ? `*${cleaned.toLocaleLowerCase("el-GR")}*` : null;
  const age = opts.age?.trim() ? opts.age.trim() : null;
  const categories = opts.categories && opts.categories.length > 0 ? opts.categories : null;
  const tag = opts.tag?.trim() ? opts.tag.trim() : null;

  try {
    const [items, total] = await Promise.all([
      safeClient.fetch<(Article | Recipe | Activity)[]>(parentsHubContentQuery, {
        start,
        end,
        search,
        age,
        categories,
        tag,
      }),
      safeClient.fetch<number>(parentsHubContentCountQuery, {
        search,
        age,
        categories,
        tag,
      }),
    ]);

    return {
      items: items ?? [],
      total: total ?? 0,
    };
  } catch (error) {
    // Silently fail - return empty results
    return { items: [], total: 0 };
  }
}

// Activities Hub Content (for drastiriotites page)
export interface ActivitiesHubContentOptions {
  search?: string;
  age?: string;
  type?: string; // "activity" | "printable" | null
  page: number;
  pageSize: number;
}

export interface ActivitiesHubContentResult {
  items: (Activity | Printable)[];
  total: number;
}

export async function getActivitiesHubContent(
  opts: ActivitiesHubContentOptions
): Promise<ActivitiesHubContentResult> {
  if (!safeClient) return { items: [], total: 0 };

  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.max(1, Math.min(50, opts.pageSize || 18));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Normalize search - GROQ requires all referenced params to be provided
  // Sanitize: remove wildcards from user input, cap length, use Greek locale for lowercase
  const raw = opts.search?.trim() ?? "";
  const cleaned = raw.replace(/\*/g, "").slice(0, 80); // Remove wildcards, cap at 80 chars
  const search = cleaned ? `*${cleaned.toLocaleLowerCase("el-GR")}*` : null;
  const age = opts.age?.trim() ? opts.age.trim() : null;
  const type = opts.type?.trim() ? opts.type.trim() : null;

  try {
    const [items, total] = await Promise.all([
      safeClient.fetch<(Activity | Printable)[]>(activitiesHubContentQuery, {
        start,
        end,
        search,
        age,
        type,
      }),
      safeClient.fetch<number>(activitiesHubContentCountQuery, {
        search,
        age,
        type,
      }),
    ]);

    return {
      items: items ?? [],
      total: total ?? 0,
    };
  } catch (error) {
    // Silently fail - return empty results
    return { items: [], total: 0 };
  }
}

