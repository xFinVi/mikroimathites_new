import { sanityClient } from "@/lib/sanity/client";
import {
  articlesQuery,
  articleBySlugQuery,
  featuredArticlesQuery,
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

export interface Activity {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  duration?: string;
  goals?: string[];
  materials?: string[];
  steps?: unknown;
  safetyNotes?: string;
  coverImage?: unknown;
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
  ageGroup?: AgeGroup;
  category?: Category;
  publishedAt?: string;
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
    seasonalBanner?: {
      enabled?: boolean;
      title?: string;
      subtitle?: string;
      image?: unknown;
      startDate?: string;
      endDate?: string;
    };
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

export async function getCuratedCollectionByPlacement(
  placement: string
): Promise<CuratedCollection | null> {
  if (!safeClient) return null;
  return safeClient.fetch<CuratedCollection | null>(curatedCollectionByPlacementQuery, {
    placement,
  });
}

export async function getCuratedCollectionsByPlacement(
  placement: string
): Promise<CuratedCollection[]> {
  if (!safeClient) return [];
  return safeClient.fetch<CuratedCollection[]>(curatedCollectionsByPlacementQuery, {
    placement,
  });
}

// Page Settings function
export async function getPageSettings(): Promise<PageSettings | null> {
  if (!safeClient) return null;
  return safeClient.fetch<PageSettings | null>(pageSettingsQuery);
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
  const categoryId = content.category?._id;
  const ageGroupIds = content.ageGroups?.map((ag) => ag._id) || [];
  const tagIds = content.tags?.map((tag) => tag._id) || [];

  return getAutoRelatedContent(content.slug, categoryId, ageGroupIds, tagIds);
}

