import { MetadataRoute } from "next";
import { getArticles, getActivities, getPrintables } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/gia-goneis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/drastiriotites`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/epikoinonia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sxetika`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic routes from CMS
  // Note: Sitemap includes all items for SEO, but pages are generated on-demand
  const [articles, activities, printables] = await Promise.all([
    getArticles(),
    getActivities(),
    getPrintables(),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/gia-goneis/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${baseUrl}/drastiriotites/${activity.slug}`,
    lastModified: activity.publishedAt ? new Date(activity.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const printableRoutes: MetadataRoute.Sitemap = printables.map((printable) => ({
    url: `${baseUrl}/drastiriotites/printables/${printable.slug}`,
    lastModified: printable.publishedAt ? new Date(printable.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...activityRoutes, ...printableRoutes];
}

