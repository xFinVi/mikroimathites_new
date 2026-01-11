/**
 * Sanity GROQ Queries - Defines all queries for fetching content from Sanity CMS
 * 
 * Contains GROQ (Graph-Relational Object Queries) definitions for articles, recipes,
 * activities, printables, and other content types. These queries are used by
 * lib/content/index.ts to fetch data from Sanity.
 */

import { groq } from "next-sanity";

// Standardized fields for all content types
const commonFields = `
  _id,
  title,
  "slug": slug.current,
  coverImage,
  secondaryImage,
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
  steps[] {
    // Handle both structured steps and legacy PortableText blocks
    _type,
    _key,
    // Structured step fields (only present if _type == "activityStep")
    title,
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    image {
      asset,
      alt,
      caption
    },
    // Legacy PortableText fields (blocks have these directly)
    ...,
    asset->
  },
  safetyNotes,
  enableCarousel,
  carouselImages[] {
    asset,
    alt,
    caption
  },
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
export const articlesQuery = groq`*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]|order(publishedAt desc){${articleFields}}`;
export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${articleFields}}`;
export const featuredArticlesQuery = groq`*[_type == "article" && featured == true && defined(slug.current) && defined(coverImage) && !(_id in path("drafts.**"))]|order(publishedAt desc)[0...10]{${articleFields}}`;

// Next Article Query
// Gets the next newer article (published after $currentDate), or falls back to the most recent article
export const nextArticleQuery = groq`
  *[
    _type == "article" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    _id != $currentId &&
    publishedAt > $currentDate
  ]|order(publishedAt asc)[0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt
  }
`;

// Fallback to most recent article (for when no newer article exists)
export const mostRecentArticleQuery = groq`
  *[
    _type == "article" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    _id != $currentId
  ]|order(publishedAt desc)[0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt
  }
`;

// Recipe queries
export const recipesQuery = groq`*[_type == "recipe" && defined(slug.current) && !(_id in path("drafts.**"))]|order(publishedAt desc){${recipeFields}}`;
export const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${recipeFields}}`;
export const featuredRecipesQuery = groq`*[_type == "recipe" && featured == true && defined(slug.current) && defined(coverImage) && !(_id in path("drafts.**"))]|order(publishedAt desc)[0...10]{${recipeFields}}`;

// Activity queries
export const activitiesQuery = groq`*[_type == "activity" && defined(slug.current) && !(_id in path("drafts.**"))]|order(publishedAt desc){${activityFields}}`;
export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${activityFields}}`;
export const featuredActivitiesQuery = groq`*[_type == "activity" && featured == true && defined(slug.current) && defined(coverImage) && !(_id in path("drafts.**"))]|order(publishedAt desc)[0...10]{${activityFields}}`;

// Printable queries
export const printablesQuery = groq`*[_type == "printable" && defined(slug.current) && !(_id in path("drafts.**"))]|order(publishedAt desc){${printableFields}}`;
export const printableBySlugQuery = groq`*[_type == "printable" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${printableFields}}`;
export const featuredPrintablesQuery = groq`*[_type == "printable" && featured == true && defined(slug.current) && defined(coverImage) && !(_id in path("drafts.**"))]|order(publishedAt desc)[0...10]{${printableFields}}`;

// QA Item queries
// Show published items (not in drafts path)
// Note: publishedAt is optional - if not set, we use _updatedAt for ordering
export const qaItemsQuery = groq`*[_type == "qaItem" && !(_id in path("drafts.**"))]|order(coalesce(publishedAt, _updatedAt) desc)[0...10]{${QAItemFields}}`;

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
  publishedAt
`;

export const curatedCollectionsQuery = groq`*[_type == "curatedCollection" && defined(placement)]|order(order asc, publishedAt desc){${curatedCollectionFields}}`;
export const curatedCollectionByPlacementQuery = groq`*[_type == "curatedCollection" && placement == $placement && !(_id in path("drafts.**"))]|order(order asc, publishedAt desc)[0]{${curatedCollectionFields}}`;

// Sponsor queries
export const sponsorFields = `
  _id,
  companyName,
  logo,
  website,
  category,
  tier,
  isActive,
  isFeatured,
  databaseId
`;

// Fetch active sponsors (synced from database)
// Only show sponsors that are active and synced to Sanity
// Note: isActive might be null/undefined, so we check for != false
export const sponsorsQuery = groq`*[_type == "sponsor" && (isActive == true || isActive == null) && !(_id in path("drafts.**"))]|order(isFeatured desc, tier asc, companyName asc){${sponsorFields}}`;
export const curatedCollectionsByPlacementQuery = groq`*[_type == "curatedCollection" && placement == $placement]|order(order asc, publishedAt desc){${curatedCollectionFields}}`;

// Page Settings query (singleton)
export const pageSettingsFields = `
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

// Home Hero Query
export const homeHeroQuery = groq`*[_type == "homeHero" && !(_id in path("drafts.**"))][0]{
  image
}`;

// Featured Content Section Query
export const featuredContentSectionQuery = groq`*[_type == "featuredContentSection" && !(_id in path("drafts.**"))][0]{
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
}`;

// For Parents Section Query
export const forParentsSectionQuery = groq`*[_type == "forParentsSection" && !(_id in path("drafts.**"))][0]{
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
}`;

// Activities & Printables Section Query
export const activitiesPrintablesSectionQuery = groq`*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]{
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
  }
}`;

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

export const categoriesQuery = groq`*[_type == "category" && defined(slug.current) && slug.current != "elliniko-exoteriko"]|order(order asc, title asc){${categoryFields}}`;

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
    facebook,
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

// Parents Hub Content Query (server-side search + pagination)
// Note: All params ($search, $age, $categories, $tag) must be provided (can be null)
// IMPORTANT: Count query below must use EXACT same filter logic
export const parentsHubContentQuery = groq`
  *[
    _type in ["article","recipe","activity"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(excerpt) && lower(excerpt) match $search) ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(body) && lower(pt::text(body)) match $search) ||
      (defined(instructions) && lower(pt::text(instructions)) match $search) ||
      (defined(steps) && lower(pt::text(steps)) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $categories == null ||
      count($categories) == 0 ||
      (defined(category) && category->slug.current in $categories)
    ) &&
    (
      $tag == null ||
      $tag == "" ||
      count(tags[]->slug.current[slug.current == $tag]) > 0
    )
  ]
  | order(publishedAt desc)
  [$start...$end]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    summary,
    body,
    coverImage,
    secondaryImage,
    publishedAt,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;

// Parents Hub Content Count Query
// CRITICAL: Must use EXACT same filter as parentsHubContentQuery above
// Any difference will cause pagination to break (wrong total count)
export const parentsHubContentCountQuery = groq`
  count(*[
    _type in ["article","recipe","activity"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(excerpt) && lower(excerpt) match $search) ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(body) && lower(pt::text(body)) match $search) ||
      (defined(instructions) && lower(pt::text(instructions)) match $search) ||
      (defined(steps) && lower(pt::text(steps)) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $categories == null ||
      count($categories) == 0 ||
      (defined(category) && category->slug.current in $categories)
    ) &&
    (
      $tag == null ||
      $tag == "" ||
      count(tags[]->slug.current[slug.current == $tag]) > 0
    )
  ])
`;

// Activities Hub Content Query (server-side search + pagination for activities/printables)
// Note: All params ($search, $age, $type) must be provided (can be null)
// IMPORTANT: Count query below must use EXACT same filter logic
export const activitiesHubContentQuery = groq`
  *[
    _type in ["activity","printable"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(goals) && count(goals[lower(@) match $search]) > 0) ||
      (defined(materials) && count(materials[lower(@) match $search]) > 0) ||
      (defined(steps) && lower(pt::text(steps)) match $search) ||
      (defined(safetyNotes) && lower(safetyNotes) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $type == null ||
      $type == "" ||
      _type == $type
    )
  ]
  | order(publishedAt desc)
  [$start...$end]
  {
    _id,
    _type,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    secondaryImage,
    publishedAt,
    duration,
    goals,
    materials,
    steps,
    safetyNotes,
    file,
    previewImages,
    "category": category->{_id, title, "slug": slug.current},
    "ageGroups": ageGroups[]->{_id, title, "slug": slug.current},
    "tags": tags[]->{_id, title, "slug": slug.current},
    featured
  }
`;

// Activities Hub Content Count Query
// CRITICAL: Must use EXACT same filter as activitiesHubContentQuery above
// Any difference will cause pagination to break (wrong total count)
export const activitiesHubContentCountQuery = groq`
  count(*[
    _type in ["activity","printable"] &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (
      $search == null ||
      $search == "" ||
      lower(title) match $search ||
      (defined(summary) && lower(summary) match $search) ||
      (defined(goals) && count(goals[lower(@) match $search]) > 0) ||
      (defined(materials) && count(materials[lower(@) match $search]) > 0) ||
      (defined(steps) && lower(pt::text(steps)) match $search) ||
      (defined(safetyNotes) && lower(safetyNotes) match $search)
    ) &&
    (
      $age == null ||
      $age == "" ||
      count(ageGroups[]->slug.current[slug.current == $age]) > 0
    ) &&
    (
      $type == null ||
      $type == "" ||
      _type == $type
    )
  ])
`;

