import { NextResponse } from "next/server";
import { getActivitiesPrintablesSection, getForParentsSection } from "@/lib/content";
import { urlFor } from "@/lib/sanity/image-url";
import { HOME_PAGE_LIMITS, HOME_PAGE_IMAGE_SIZES } from "@/lib/constants/home-page";

export async function GET() {
  try {
    const activitiesPrintablesSection = await getActivitiesPrintablesSection();
    const forParentsSection = await getForParentsSection();

    // Transform Activities & Printables Section items (same logic as app/page.tsx)
    const activitiesPrintablesItems = activitiesPrintablesSection?.contentItems
      ?.map((item) => {
        const content = item.activity || item.printable;
        // Filter out null content or items without slugs (unpublished)
        if (!content || !content.slug) return null;
        
        return {
          ...content,
          _contentType: (item.contentType || content._type) as 'activity' | 'printable',
          imageUrl: content.coverImage 
            ? urlFor(content.coverImage)
                .width(HOME_PAGE_IMAGE_SIZES.CARD.width)
                .height(HOME_PAGE_IMAGE_SIZES.CARD.height)
                .url() 
            : null,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, HOME_PAGE_LIMITS.FEATURED_PRINTABLES) || [];

    // Transform For Parents Section articles (same logic as app/page.tsx)
    const forParentsArticles = forParentsSection?.articles
      ?.slice(0, HOME_PAGE_LIMITS.FEATURED_ARTICLES)
      .map((article) => ({
        ...article,
        imageUrl: article.coverImage 
          ? urlFor(article.coverImage)
              .width(HOME_PAGE_IMAGE_SIZES.CARD.width)
              .height(HOME_PAGE_IMAGE_SIZES.CARD.height)
              .url() 
          : null,
      })) || [];

    return NextResponse.json({
      activitiesPrintablesSection: {
        raw: activitiesPrintablesSection,
        contentItemsCount: activitiesPrintablesSection?.contentItems?.length || 0,
        transformedItemsCount: activitiesPrintablesItems.length,
        transformedItems: activitiesPrintablesItems.map((item, index) => ({
          index,
          _id: item._id,
          title: item.title,
          slug: item.slug,
          _contentType: item._contentType,
          hasImageUrl: !!item.imageUrl,
          _type: item._type,
        })),
        rawContentItems: activitiesPrintablesSection?.contentItems?.map((item, index) => ({
          index,
          contentType: item.contentType,
          hasActivity: !!item.activity,
          hasPrintable: !!item.printable,
          activity: item.activity ? {
            _id: item.activity._id,
            title: item.activity.title,
            slug: item.activity.slug,
            hasCoverImage: !!item.activity.coverImage,
          } : null,
          printable: item.printable ? {
            _id: item.printable._id,
            title: item.printable.title,
            slug: item.printable.slug,
            hasCoverImage: !!item.printable.coverImage,
          } : null,
        })) || [],
      },
      forParentsSection: {
        raw: forParentsSection,
        articlesCount: forParentsSection?.articles?.length || 0,
        transformedArticlesCount: forParentsArticles.length,
        transformedArticles: forParentsArticles.map((article, index) => ({
          index,
          _id: article._id,
          title: article.title,
          slug: article.slug,
          hasImageUrl: !!article.imageUrl,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to fetch homepage data",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

