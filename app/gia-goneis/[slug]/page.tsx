import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getArticleBySlug, getArticles } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleMeta } from "@/components/articles/article-meta";
import { ShareButtons } from "@/components/articles/share-buttons";
import { RelatedArticles } from "@/components/articles/related-articles";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Άρθρο δεν βρέθηκε",
    };
  }

  const seo = article.seo;
  const ogImage = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title: seo?.title || article.title,
    description: seo?.description || article.excerpt || undefined,
    openGraph: {
      title: seo?.title || article.title,
      description: seo?.description || article.excerpt || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || article.title,
      description: seo?.description || article.excerpt || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo?.noIndex ? "noindex, nofollow" : undefined,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverImageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(600).url()
    : null;

  return (
    <PageWrapper>
      <article className="bg-background-light">
        {/* Hero Section */}
        {coverImageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              style={{ objectPosition: 'center top' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light" />
          </div>
        )}

        <Container className={`py-8 sm:py-12 md:py-16 ${!coverImageUrl ? 'pt-16 sm:pt-20 md:pt-24' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/gia-goneis"
              className="inline-flex items-center gap-2 text-text-medium hover:text-primary-pink transition mb-6 relative z-10 cursor-pointer py-2 -ml-2 pl-2 pr-4 rounded-md hover:bg-background-white"
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
              Επιστροφή στα άρθρα
            </Link>

            {/* Article Header */}
            <header className="mb-8 space-y-4">
              {article.category && (
                <Link
                  href={`/gia-goneis?category=${article.category.slug}`}
                  className="inline-block px-4 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm font-semibold hover:bg-primary-pink/20 transition"
                >
                  {article.category.title}
                </Link>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-text-medium leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              <ArticleMeta article={article} />
            </header>

            {/* Article Content */}
            {article.body && (
              <div className="prose prose-lg max-w-none mb-12">
                <ArticleContent content={article.body} />
              </div>
            )}

            {/* Share Buttons */}
            <ShareButtons
              title={article.title}
              url={`/gia-goneis/${article.slug}`}
            />

            {/* Related Articles */}
            {article.relatedContent && article.relatedContent.length > 0 && (
              <RelatedArticles relatedContent={article.relatedContent} />
            )}
          </div>
        </Container>
      </article>
    </PageWrapper>
  );
}

