import { sanityClient } from "@/lib/sanity/client";
import {
  articlesQuery,
  articleBySlugQuery,
  activitiesQuery,
  activityBySlugQuery,
  printablesQuery,
  printableBySlugQuery,
  qaItemsQuery,
} from "@/lib/sanity/queries";

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown;
  coverImage?: unknown;
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
  category?: { _id: string; title: string; slug: string };
}

export interface Activity {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: unknown;
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
  category?: { _id: string; title: string; slug: string };
}

export interface Printable {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  file?: unknown;
  previewImages?: unknown[];
  coverImage?: unknown;
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
}

export interface QAItem {
  _id: string;
  question: string;
  answer: string;
  publishedAt?: string;
  ageGroups?: Array<{ _id: string; title: string; slug: string }>;
  category?: { _id: string; title: string; slug: string };
}

const safeClient = sanityClient;

export async function getArticles(): Promise<Article[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Article[]>(articlesQuery);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Article | null>(articleBySlugQuery, { slug });
}

export async function getActivities(): Promise<Activity[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Activity[]>(activitiesQuery);
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Activity | null>(activityBySlugQuery, { slug });
}

export async function getPrintables(): Promise<Printable[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Printable[]>(printablesQuery);
}

export async function getPrintableBySlug(slug: string): Promise<Printable | null> {
  if (!safeClient) return null;
  return safeClient.fetch<Printable | null>(printableBySlugQuery, { slug });
}

export async function getQAItems(): Promise<QAItem[]> {
  if (!safeClient) return [];
  return safeClient.fetch<QAItem[]>(qaItemsQuery);
}

