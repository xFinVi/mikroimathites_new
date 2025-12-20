import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { HomePage } from "@/components/home/home-page";
import { getFeaturedArticles, getFeaturedActivities, getFeaturedPrintables } from "@/lib/content";

export const metadata = generateMetadataFor("home");

export default async function Home() {
  const [featuredArticles, featuredActivities, featuredPrintables] = await Promise.all([
    getFeaturedArticles(),
    getFeaturedActivities(),
    getFeaturedPrintables(),
  ]);

  return (
    <HomePage
      featuredArticles={featuredArticles.slice(0, 3)}
      featuredActivities={featuredActivities.slice(0, 4)}
      featuredPrintables={featuredPrintables.slice(0, 4)}
    />
  );
}
