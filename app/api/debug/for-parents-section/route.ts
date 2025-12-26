import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { logger } from "@/lib/utils/logger";

export async function GET() {
  try {
    // Check both published and draft versions
    const [publishedSection, draftSection, allSections] = await Promise.all([
      sanityClient?.fetch(`*[_type == "forParentsSection" && !(_id in path("drafts.**"))][0]{
        _id,
        _rev,
        title,
        subtitle,
        viewAllText,
        viewAllLink,
        "articles": articles[]-> { 
          _id, 
          title, 
          "slug": slug.current, 
          coverImage,
          _type
        }
      }`),
      sanityClient?.fetch(`*[_type == "forParentsSection" && _id in path("drafts.**")][0]{
        _id,
        _rev,
        title,
        subtitle,
        viewAllText,
        viewAllLink,
        "articles": articles[]-> { 
          _id, 
          title, 
          "slug": slug.current, 
          coverImage,
          _type
        }
      }`),
      sanityClient?.fetch(`*[_type == "forParentsSection"]{
        _id,
        _rev,
        title
      }`),
    ]);
    
    const publishedArticles = publishedSection?.articles || [];
    const draftArticles = draftSection?.articles || [];
    
    return NextResponse.json({
      published: {
        exists: !!publishedSection,
        _id: publishedSection?._id,
        title: publishedSection?.title,
        subtitle: publishedSection?.subtitle,
        articlesCount: publishedArticles.length,
        articles: publishedArticles.map((article: any, index: number) => ({
          index,
          _id: article._id,
          title: article.title,
          slug: article.slug,
          hasCoverImage: !!article.coverImage,
          isDraft: article._id?.startsWith('drafts.'),
          _type: article._type,
        })),
      },
      draft: {
        exists: !!draftSection,
        _id: draftSection?._id,
        title: draftSection?.title,
        subtitle: draftSection?.subtitle,
        articlesCount: draftArticles.length,
        articles: draftArticles.map((article: any, index: number) => ({
          index,
          _id: article._id,
          title: article.title,
          slug: article.slug,
          hasCoverImage: !!article.coverImage,
          isDraft: article._id?.startsWith('drafts.'),
          _type: article._type,
        })),
      },
      allDocuments: allSections || [],
      analysis: {
        message: !publishedSection && !draftSection 
          ? "❌ No section document found (neither published nor draft)"
          : !publishedSection && draftSection
          ? "⚠️ Section exists but is NOT PUBLISHED. Click 'Publish' in Sanity Studio."
          : "✅ Section is published",
        publishedArticlesWithImages: publishedArticles.filter((article: any) => article.coverImage).length,
        publishedArticlesWithSlugs: publishedArticles.filter((article: any) => article.slug).length,
        publishedArticlesValid: publishedArticles.filter((article: any) => 
          article.slug && article.coverImage && !article._id?.startsWith('drafts.')
        ).length,
        articlesFilteredOut: publishedArticles.length - publishedArticles.filter((article: any) => 
          article.slug && article.coverImage && !article._id?.startsWith('drafts.')
        ).length,
      },
    });
  } catch (error) {
    logger.error("Error fetching for parents section", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch section",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

