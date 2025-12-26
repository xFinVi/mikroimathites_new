import { NextRequest, NextResponse } from "next/server";
import { getParentsHubContent } from "@/lib/content";
import { getMappedCategories } from "@/lib/utils/category-mapping";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants/gia-goneis";
import { ContentType } from "@/lib/utils/content-url";
import { logger } from "@/lib/utils/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Validate and sanitize page number (1-100 range)
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = Math.max(1, Math.min(100, isNaN(rawPage) ? 1 : rawPage));
    const search = searchParams.get("search") || undefined;
    const age = searchParams.get("age") || undefined;
    const category = searchParams.get("category") || undefined;

    // Get mapped categories if category filter is active
    const mappedCategories = category ? getMappedCategories(category) : undefined;

    // Fetch more content
    const result = await getParentsHubContent({
      search,
      age,
      categories: mappedCategories,
      page,
      pageSize: GIA_GONEIS_CONSTANTS.LOAD_MORE_SIZE,
    });

    // Helper to determine content type
    const getContentType = (item: { _type: string }): ContentType => {
      if (item._type === "article") return "article";
      if (item._type === "recipe") return "recipe";
      if (item._type === "activity") return "activity";
      if (item._type === "printable") return "printable";
      return "article";
    };

    // Pre-generate image URLs for all items
    const itemsWithImageUrls = result.items.map((item) => {
      const contentType = getContentType(item);
      return {
        ...item,
        _contentType: contentType,
        imageUrl: generateImageUrl(
          item.coverImage,
          GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.width,
          GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.height
        ),
      };
    });

    // Calculate if there are more items to load
    // Initial load is page 1 (9 items), so when we fetch page 2, total loaded = 18
    // hasMore = (page * LOAD_MORE_SIZE) < total
    const totalLoaded = page * GIA_GONEIS_CONSTANTS.LOAD_MORE_SIZE;
    const hasMore = totalLoaded < result.total;

    return NextResponse.json({
      items: itemsWithImageUrls,
      total: result.total,
      hasMore,
    });
  } catch (error) {
    logger.error("Error loading more content:", error);
    return NextResponse.json(
      { error: "Failed to load more content" },
      { status: 500 }
    );
  }
}

