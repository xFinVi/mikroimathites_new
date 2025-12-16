import { groq } from "next-sanity";

export const articleFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  readingTime,
  coverImage,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  "category": category-> { _id, title, "slug": slug.current },
  seo
`;

export const activityFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  duration,
  goals,
  materials,
  steps,
  coverImage,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  "category": category-> { _id, title, "slug": slug.current },
  seo
`;

export const printableFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  file,
  previewImages,
  coverImage,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  seo
`;

export const QAItemFields = `
  _id,
  question,
  answer,
  publishedAt,
  "ageGroups": ageGroups[]-> { _id, title, "slug": slug.current },
  "category": category-> { _id, title, "slug": slug.current }
`;

export const articlesQuery = groq`*[_type == "article" && defined(slug.current)]|order(publishedAt desc)[0...10]{${articleFields}}`;
export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0]{${articleFields}}`;

export const activitiesQuery = groq`*[_type == "activity" && defined(slug.current)]|order(publishedAt desc)[0...10]{${activityFields}}`;
export const activityBySlugQuery = groq`*[_type == "activity" && slug.current == $slug][0]{${activityFields}}`;

export const printablesQuery = groq`*[_type == "printable" && defined(slug.current)]|order(publishedAt desc)[0...10]{${printableFields}}`;
export const printableBySlugQuery = groq`*[_type == "printable" && slug.current == $slug][0]{${printableFields}}`;

export const qaItemsQuery = groq`*[_type == "qaItem" && defined(publishedAt)]|order(publishedAt desc)[0...10]{${QAItemFields}}`;

