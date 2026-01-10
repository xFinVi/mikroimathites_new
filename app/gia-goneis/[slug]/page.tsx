import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getArticleBySlug, getArticles, getNextArticle, type Category } from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleStats } from "@/components/articles/article-stats";
import { ShareButtons } from "@/components/articles/share-buttons";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ArticleTags } from "@/components/articles/article-tags";
import { NextArticle } from "@/components/articles/next-article";
import { ContentTracker } from "@/components/analytics/content-tracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Limit to first 30 articles for faster builds (remaining generated on-demand)
  const articles = await getArticles();
  return articles.slice(0, 30).map((article) => ({
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
  const ogImage = generateImageUrl(
    article.coverImage,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.OG_IMAGE.width,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.OG_IMAGE.height
  ) || undefined;

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

// Helper function to get excerpt styling based on length
function getExcerptClasses(excerpt: string | undefined) {
  if (!excerpt) return "text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl";

  const wordCount = excerpt.split(' ').length;
  const charCount = excerpt.length;

  // If longer than 14 words or 200 characters, use smaller text
  if (wordCount > 14 || charCount > 200) {
    return "text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl";
  }

  // If longer than 10 words or 150 characters, use medium text
  if (wordCount > 10 || charCount > 150) {
    return "text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl";
  }

  // Default size for shorter excerpts
  return "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl";
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const coverImageUrl = generateImageUrl(
    article.coverImage,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.HERO.width,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.HERO.height
  );

  // Fetch the next article (newer first, or most recent as fallback)
  const { article: nextArticleData, isNewer } = article.publishedAt && article._id
    ? await getNextArticle(article._id, article.publishedAt)
    : { article: null, isNewer: false };

  // Extract category - TypeScript inference issue with Sanity fetch results
  // The category is properly typed in the Article interface, but TypeScript
  // sometimes infers it as unknown from Sanity fetch. We'll handle this in the component.

  return (
    <PageWrapper>
      <ContentTracker
        content_type="article"
        content_slug={slug}
      />
      <article className="bg-gradient-to-b from-background-light via-white to-background-light">
        {/* Magazine-Style Hero Section */}
        {coverImageUrl && (
          <div className="relative h-[65vh] sm:h-[60vh] md:h-[55vh] lg:h-[60vh] min-h-[500px] sm:min-h-[600px] max-h-[700px] sm:max-h-[800px] overflow-hidden group">
            <Image
              src={coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: 'center center' }}
              priority
            />

            {/* Sophisticated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full max-w-4xl xl:max-w-none mx-auto xl:mx-4 px-4 sm:px-6 lg:px-8 xl:px-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10">
                {/* Category badge */}
                {/* {article.category && (
                  <div className="mb-4 animate-fade-in-up">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-primary-pink text-sm font-bold shadow-lg border border-white/20">
                      {article.category.title}
                    </span>
                  </div>
                )} */}

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-black text-white leading-tight tracking-tight mb-2 sm:mb-3 md:mb-4 animate-fade-in-up animation-delay-200 drop-shadow-2xl">
                  {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className={`${getExcerptClasses(article.excerpt)} text-white/90 leading-relaxed max-w-2xl xl:max-w-none mb-3 sm:mb-4 md:mb-6 ${(article.excerpt.split(' ').length > 20 || article.excerpt.length > 300) ? 'line-clamp-4 sm:line-clamp-5' : (article.excerpt.split(' ').length > 15 || article.excerpt.length > 250) ? 'line-clamp-3 sm:line-clamp-4' : 'line-clamp-2 sm:line-clamp-3'} animate-fade-in-up animation-delay-400 drop-shadow-lg`}>
                    {article.excerpt}
                  </p>
                )}

                {/* Meta information bar */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-white/80 animate-fade-in-up animation-delay-600">
                  {/* Author */}
                  {article.author && (
                    <div className="flex items-center gap-2">
                      {article.author.profilePicture ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 backdrop-blur-sm">
                          <Image
                            src={generateImageUrl(article.author.profilePicture, 32, 32) || ""}
                            alt={article.author.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="text-xs font-bold text-white">
                            {article.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm sm:text-base font-medium">{article.author.name}</span>
                    </div>
                  )}

                  {/* Reading time */}
                  {article.readingTime && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <polyline points="12,6 12,12 16,14" strokeWidth="2" />
                      </svg>
                      <span className="text-sm sm:text-base">{article.readingTime} λεπτά ανάγνωση</span>
                    </div>
                  )}

                  {/* Publication date */}
                  {article.publishedAt && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                      </svg>
                      <span className="text-sm sm:text-base">
                        {new Date(article.publishedAt).toLocaleDateString('el-GR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social sharing preview */}
                <div className="mt-3 sm:mt-4 md:mt-6 animate-fade-in-up animation-delay-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-white/60 text-xs sm:text-sm font-medium">Μοιραστείτε:</span>
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all duration-200 cursor-pointer">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all duration-200 cursor-pointer">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle scroll indicator */}
            <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40 rounded-full flex justify-center">
                <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        <Container className={`py-12 sm:py-16 md:py-20 ${!coverImageUrl ? 'pt-20 sm:pt-24 md:pt-28' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Back Link - Enhanced */}
            <Link
              href="/gia-goneis"
              className="inline-flex items-center gap-2 text-text-medium hover:text-primary-pink transition-all mb-8 relative z-10 cursor-pointer py-2 px-3 -ml-3 rounded-lg hover:bg-primary-pink/5 group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
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
              <span className="font-medium">Επιστροφή στα άρθρα</span>
            </Link>


            {/* Article Stats - Enhanced */}
            <div className="mb-12">
              <ArticleStats article={article} />
            </div>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-12">
                {/* Category badge */}
                {article.category && typeof article.category === 'object' && 'slug' in article.category && 'title' in article.category && (
                  <div className="mb-4">
                    <Link
                      href={`/gia-goneis?category=${article.category.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-pink/10 to-accent-yellow/10 text-primary-pink text-sm font-bold hover:from-primary-pink/20 hover:to-accent-yellow/20 transition-all shadow-sm border border-primary-pink/20"
                    >
                      {article.category.title}
                    </Link>
                  </div>
                )}
                <ArticleTags tags={article.tags || []} />
              </div>
            )}

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-primary-pink to-accent-yellow rounded-full mb-12"></div>

            {/* Article Content - Professional Layout */}
            {article.body && (
              <div className="mb-16">
                <ArticleContent content={article.body} />
              </div>
            )}

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-primary-pink to-accent-yellow rounded-full my-12"></div>

            {/* Share Buttons */}
            <div className="mb-16">
              <ShareButtons
                title={article.title}
                url={`/gia-goneis/${article.slug}`}
              />
            </div>

            {/* Next Article */}
            {nextArticleData && (
              <div className="mb-16">
                <NextArticle article={nextArticleData} isNewer={isNewer} />
              </div>
            )}

            {/* Related Articles */}
            {article.relatedContent && article.relatedContent.length > 0 && (
              <div className="mt-16 pt-16 border-t border-border/30">
                <RelatedArticles relatedContent={article.relatedContent} />
              </div>
            )}
          </div>
        </Container>
      </article>
    </PageWrapper>
  );
}

