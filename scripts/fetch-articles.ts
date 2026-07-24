/**
 * Fetch published content from Sanity for content audits.
 *
 * Usage: npx tsx scripts/fetch-articles.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@sanity/client";

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

type ContentRow = {
  title: string;
  slug: string;
  readingTime?: number;
  excerpt?: string;
  publishedAt?: string;
};

async function fetchArticles(): Promise<void> {
  console.log("📚 Fetching published content from Sanity...\n");

  const articles = await client.fetch<ContentRow[]>(
    `*[_type == "article" && !(_id in path("drafts.**")) && defined(slug.current)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      readingTime
    }`
  );

  const [recipeCount, activityCount, printableCount] = await Promise.all([
    client.fetch<number>(
      `count(*[_type == "recipe" && !(_id in path("drafts.**")) && defined(slug.current)])`
    ),
    client.fetch<number>(
      `count(*[_type == "activity" && !(_id in path("drafts.**")) && defined(slug.current)])`
    ),
    client.fetch<number>(
      `count(*[_type == "printable" && !(_id in path("drafts.**")) && defined(slug.current)])`
    ),
  ]);

  console.log(`📊 Articles: ${articles.length}`);
  console.log(`🍳 Recipes: ${recipeCount}`);
  console.log(`🎨 Activities: ${activityCount}`);
  console.log(`📄 Printables: ${printableCount}\n`);
  console.log("═".repeat(60));

  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Reading time: ${article.readingTime ?? "—"} min`);
    if (article.excerpt) {
      console.log(`   Excerpt: ${article.excerpt.slice(0, 80)}...`);
    }
    console.log("─".repeat(40));
  });
}

fetchArticles().catch((error: unknown) => {
  console.error("Error:", error);
  process.exit(1);
});
