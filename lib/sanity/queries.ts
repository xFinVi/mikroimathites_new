import { groq } from "next-sanity";

// Standardized fields for all content types
const commonFields = `
  _id,
  title,
  "slug": slug.current,
  coverImage,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  "tags": tags[]-> { _id, title, "slug": slug.current },
  publishedAt,
  featured,
  seo {
    title,
    description,
    ogImage,
    noIndex,
    canonicalUrl
  }
`;

export const articleFields = `
  ${commonFields},
  excerpt,
  body,
  readingTime,
  "category": category-> { _id, title, "slug": slug.current },
  "author": author-> { _id, name, "slug": slug.current, profilePicture },
  "relatedContent": relatedContent[]-> {
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;

export const recipeFields = `
  ${commonFields},
  summary,
  difficulty,
  prepTime,
  cookTime,
  servings,
  ingredients[] {
    name,
    amount,
    notes
  },
  instructions,
  tips,
  nutritionNotes,
  "category": category-> { _id, title, "slug": slug.current },
  "relatedContent": relatedContent[]-> {
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;

export const activityFields = `
  ${commonFields},
  summary,
  duration,
  goals,
  materials,
  steps,
  safetyNotes,
  "category": category-> { _id, title, "slug": slug.current },
  "relatedContent": relatedContent[]-> {
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;

export const printableFields = `
  ${commonFields},
  summary,
  file,
  previewImages,
  "relatedContent": relatedContent[]-> {
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;

export const QAItemFields = `
  _id,
  question,
  answer,
  publishedAt,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  "category": category-> { _id, title, "slug": slug.current }
`;

// Article queries
export const articlesQuery = groq`*[_type == "article" && defined(slug.current)]|order(publishedAt desc)[0...10]{${articleFields}}`;
export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0]{${articleFields}}`;
export const featuredArticlesQuery = groq`*[_type == "article" && featured == true && defined(slug.current)]|order(publishedAt desc)[0...10]{${articleFields}}`;

// Recipe queries
export const recipesQuery = groq`*[_type == "recipe" && defined(slug.current)]|order(publishedAt desc)[0...10]{${recipeFields}}`;
export const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0]{${recipeFields}}`;
export const featuredRecipesQuery = groq`*[_type == "recipe" && featured == true && defined(slug.current)]|order(publishedAt desc)[0...10]{${recipeFields}}`;

// Activity queries
export const activitiesQuery = groq`*[_type == "activity" && defined(slug.current)]|order(publishedAt desc)[0...10]{${activityFields}}`;
export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0]{${activityFields}}`;
export const featuredActivitiesQuery = groq`*[_type == "activity" && featured == true && defined(slug.current)]|order(publishedAt desc)[0...10]{${activityFields}}`;

// Printable queries
export const printablesQuery = groq`*[_type == "printable" && defined(slug.current)]|order(publishedAt desc)[0...10]{${printableFields}}`;
export const printableBySlugQuery = groq`*[_type == "printable" && slug.current == $slug][0]{${printableFields}}`;
export const featuredPrintablesQuery = groq`*[_type == "printable" && featured == true && defined(slug.current)]|order(publishedAt desc)[0...10]{${printableFields}}`;

// QA Item queries
export const qaItemsQuery = groq`*[_type == "qaItem" && defined(publishedAt)]|order(publishedAt desc)[0...10]{${QAItemFields}}`;

// Curated Collection queries
export const curatedCollectionFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  placement,
  order,
  "items": items[]-> {
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage,
    summary,
    excerpt
  },
  "ageGroup": ageGroup-> { _id, title, "slug": slug.current },
  "category": category-> { _id, title, "slug": slug.current },
  publishedAt
`;

export const curatedCollectionsQuery = groq`*[_type == "curatedCollection" && defined(placement)]|order(order asc, publishedAt desc){${curatedCollectionFields}}`;
export const curatedCollectionByPlacementQuery = groq`*[_type == "curatedCollection" && placement == $placement]|order(order asc, publishedAt desc)[0]{${curatedCollectionFields}}`;
export const curatedCollectionsByPlacementQuery = groq`*[_type == "curatedCollection" && placement == $placement]|order(order asc, publishedAt desc){${curatedCollectionFields}}`;

// Page Settings query (singleton)
export const pageSettingsFields = `
  home {
    hero {
      type,
      image,
      video {
        url,
        thumbnail,
        autoplay,
        loop
      },
      overlay {
        enabled,
        opacity,
        color
      },
      content {
        title,
        subtitle,
        ctaText,
        ctaLink,
        alignment
      }
    },
    seasonalBanner {
      enabled,
      title,
      subtitle,
      image,
      startDate,
      endDate
    }
  },
  forParents {
    hero {
      type,
      image,
      video {
        url,
        thumbnail,
        autoplay,
        loop
      },
      overlay {
        enabled,
        opacity,
        color
      },
      content {
        title,
        subtitle,
        ctaText,
        ctaLink,
        alignment
      }
    },
    "featuredCategoryRefs": featuredCategoryRefs[]-> { _id, title, "slug": slug.current },
    "featuredContentRefs": featuredContentRefs[]-> {
      _type,
      _id,
      title,
      "slug": slug.current,
      coverImage
    }
  },
  site {
    defaultOgImage,
    logo,
    navLinks[] {
      label,
      url
    }
  }
`;

export const pageSettingsQuery = groq`*[_type == "pageSettings"][0]{${pageSettingsFields}}`;

// Category queries
export const categoryFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  icon,
  color,
  order
`;

export const categoriesQuery = groq`*[_type == "category" && defined(slug.current)]|order(order asc, title asc){${categoryFields}}`;

// Age Group queries
export const ageGroupFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  order
`;

export const ageGroupsQuery = groq`*[_type == "ageGroup" && defined(slug.current)]|order(order asc, title asc){${ageGroupFields}}`;

// Author queries
export const authorFields = `
  _id,
  name,
  "slug": slug.current,
  bio,
  profilePicture,
  role,
  socialLinks {
    twitter,
    instagram,
    youtube,
    website
  }
`;

export const authorsQuery = groq`*[_type == "author" && defined(slug.current)]|order(name asc){${authorFields}}`;

// Related content query (for auto-related content logic)
export const relatedContentQuery = groq`
  *[
    _type in ["article", "recipe", "activity"] &&
    defined(slug.current) &&
    slug.current != $currentSlug &&
    (
      count(category._ref == $categoryId) > 0 ||
      count(ageGroups[]._ref in $ageGroupIds) > 0 ||
      count(tags[]._ref in $tagIds) > 0
    )
  ]|order(publishedAt desc)[0...5]{
    _type,
    _id,
    title,
    "slug": slug.current,
    coverImage,
    summary,
    excerpt
  }
`;

