import { MetadataRoute } from "next";
import {
  getArticles,
  getActivities,
  getPrintables,
  getRecipes,
  getAgeGroups,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr";

  // Static routes — no lastModified: these pages have no meaningful change date,
  // and stamping new Date() on every request tells Google everything changed daily.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/gia-goneis`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/drastiriotites`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/epikoinonia`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sxetika`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/support`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/donate`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/gine-xorigos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic routes from CMS
  // Note: Sitemap includes all items for SEO, but pages are generated on-demand
  const [articles, activities, printables, recipes, ageGroups] = await Promise.all([
    getArticles(),
    getActivities(),
    getPrintables(),
    getRecipes(),
    getAgeGroups(),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/gia-goneis/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/gia-goneis/recipes/${recipe.slug}`,
    lastModified: recipe.publishedAt ? new Date(recipe.publishedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${baseUrl}/drastiriotites/${activity.slug}`,
    lastModified: activity.publishedAt ? new Date(activity.publishedAt) : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const printableRoutes: MetadataRoute.Sitemap = printables.map((printable) => ({
    url: `${baseUrl}/drastiriotites/printables/${printable.slug}`,
    lastModified: printable.publishedAt ? new Date(printable.publishedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const ageGroupRoutes: MetadataRoute.Sitemap = ageGroups.map((ageGroup) => ({
    url: `${baseUrl}/age/${ageGroup.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...recipeRoutes,
    ...activityRoutes,
    ...printableRoutes,
    ...ageGroupRoutes,
  ];
}
