import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { logger } from "@/lib/utils/logger";

export async function GET() {
  try {
    // Check both published and draft versions
    const [publishedSection, draftSection, allSections] = await Promise.all([
      sanityClient?.fetch(`*[_type == "activitiesPrintablesSection" && !(_id in path("drafts.**"))][0]{
        _id,
        _rev,
        title,
        subtitle,
        viewAllText,
        viewAllLink,
        "contentItems": contentItems[]{
          contentType,
          "activity": activity-> { 
            _id, 
            title, 
            "slug": slug.current, 
            coverImage,
            _type
          },
          "printable": printable-> { 
            _id, 
            title, 
            "slug": slug.current, 
            coverImage,
            _type
          }
        }
      }`),
      sanityClient?.fetch(`*[_type == "activitiesPrintablesSection" && _id in path("drafts.**")][0]{
        _id,
        _rev,
        title,
        subtitle,
        viewAllText,
        viewAllLink,
        "contentItems": contentItems[]{
          contentType,
          "activity": activity-> { 
            _id, 
            title, 
            "slug": slug.current, 
            coverImage,
            _type
          },
          "printable": printable-> { 
            _id, 
            title, 
            "slug": slug.current, 
            coverImage,
            _type
          }
        }
      }`),
      sanityClient?.fetch(`*[_type == "activitiesPrintablesSection"]{
        _id,
        _rev,
        title
      }`),
    ]);
    
    const publishedItems = publishedSection?.contentItems || [];
    const draftItems = draftSection?.contentItems || [];
    
    return NextResponse.json({
      published: {
        exists: !!publishedSection,
        _id: publishedSection?._id,
        title: publishedSection?.title,
        subtitle: publishedSection?.subtitle,
        contentItemsCount: publishedItems.length,
        contentItems: publishedItems.map((item: any, index: number) => {
          const content = item.activity || item.printable;
          return {
            index,
            contentType: item.contentType,
            content: content ? {
              _id: content._id,
              title: content.title,
              slug: content.slug,
              hasCoverImage: !!content.coverImage,
              isDraft: content._id?.startsWith('drafts.'),
              _type: content._type,
            } : null,
          };
        }),
      },
      draft: {
        exists: !!draftSection,
        _id: draftSection?._id,
        title: draftSection?.title,
        subtitle: draftSection?.subtitle,
        contentItemsCount: draftItems.length,
        contentItems: draftItems.map((item: any, index: number) => {
          const content = item.activity || item.printable;
          return {
            index,
            contentType: item.contentType,
            content: content ? {
              _id: content._id,
              title: content.title,
              slug: content.slug,
              hasCoverImage: !!content.coverImage,
              isDraft: content._id?.startsWith('drafts.'),
              _type: content._type,
            } : null,
          };
        }),
      },
      allDocuments: allSections || [],
      analysis: {
        message: !publishedSection && !draftSection 
          ? "❌ No section document found (neither published nor draft)"
          : !publishedSection && draftSection
          ? "⚠️ Section exists but is NOT PUBLISHED. Click 'Publish' in Sanity Studio."
          : "✅ Section is published",
        publishedItemsWithImages: publishedItems.filter((item: any) => {
          const content = item.activity || item.printable;
          return content && content.coverImage;
        }).length,
        publishedItemsWithSlugs: publishedItems.filter((item: any) => {
          const content = item.activity || item.printable;
          return content && content.slug;
        }).length,
        publishedItemsValid: publishedItems.filter((item: any) => {
          const content = item.activity || item.printable;
          return content && content.slug && content.coverImage && !content._id?.startsWith('drafts.');
        }).length,
      },
    });
  } catch (error) {
    logger.error("Error fetching activities & printables section", error);
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

