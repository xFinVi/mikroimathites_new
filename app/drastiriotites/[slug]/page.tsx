import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getActivityBySlug, getActivities } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import { ActivityContent } from "@/components/activities/activity-content";
import { ActivityMeta } from "@/components/activities/activity-meta";
import { ShareButtons } from "@/components/articles/share-buttons";
import { RelatedArticles } from "@/components/articles/related-articles";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const activities = await getActivities();
  return activities.map((activity) => ({
    slug: activity.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    return {
      title: "Δραστηριότητα δεν βρέθηκε",
    };
  }

  const seo = activity.seo;
  const ogImage = activity.coverImage
    ? urlFor(activity.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title: seo?.title || activity.title,
    description: seo?.description || activity.summary || undefined,
    openGraph: {
      title: seo?.title || activity.title,
      description: seo?.description || activity.summary || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || activity.title,
      description: seo?.description || activity.summary || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo?.noIndex ? "noindex, nofollow" : undefined,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
  };
}

export default async function ActivityPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const coverImageUrl = activity.coverImage
    ? urlFor(activity.coverImage).width(1200).height(600).url()
    : null;

  return (
    <PageWrapper>
      <article className="bg-background-light">
        {/* Hero Section */}
        {coverImageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={activity.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light" />
          </div>
        )}

        <Container className="py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/drastiriotites"
              className="inline-flex items-center gap-2 text-text-medium hover:text-primary-pink transition mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Επιστροφή στις δραστηριότητες
            </Link>

            {/* Activity Header */}
            <header className="mb-8 space-y-4">
              {activity.category && (
                <Link
                  href={`/drastiriotites?category=${activity.category.slug}`}
                  className="inline-block px-4 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm font-semibold hover:bg-primary-pink/20 transition"
                >
                  {activity.category.title}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark">
                {activity.title}
              </h1>

              {activity.summary && (
                <p className="text-xl text-text-medium leading-relaxed">
                  {activity.summary}
                </p>
              )}

              <ActivityMeta activity={activity} />
            </header>

            {/* Activity Content */}
            <ActivityContent activity={activity} />

            {/* Share Buttons */}
            <ShareButtons
              title={activity.title}
              url={`/drastiriotites/${activity.slug}`}
            />

            {/* Related Content */}
            {activity.relatedContent && activity.relatedContent.length > 0 && (
              <RelatedArticles relatedContent={activity.relatedContent} />
            )}
          </div>
        </Container>
      </article>
    </PageWrapper>
  );
}

