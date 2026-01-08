import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";

interface NextArticleProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: any;
    publishedAt: string;
  };
  isNewer?: boolean; // true if this is actually newer, false if it's a fallback
}

/**
 * NextArticle component
 * Displays a featured card for the next article to read
 * 
 * Logic:
 * - Shows the next newer article (published after current)
 * - If no newer article exists, shows the most recent article
 * - Provides visual context with image, title, and excerpt
 */
export function NextArticle({ article, isNewer = true }: NextArticleProps) {
  const imageUrl = generateImageUrl(
    article.coverImage,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.width,
    GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.height
  );

  return (
    <div className="rounded-2xl border-2 border-border/50 bg-gradient-to-br from-primary-pink/5 via-white to-accent-yellow/5 p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-2 text-primary-pink text-sm font-bold mb-4">
        <ArrowRight className="w-5 h-5" />
        <span>{isNewer ? "Επόμενο Άρθρο" : "Προτεινόμενο Άρθρο"}</span>
      </div>

      <Link
        href={`/gia-goneis/${article.slug}`}
        className="group block"
      >
        <div className="space-y-4">
          {/* Image */}
          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-text-dark group-hover:text-primary-pink transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-text-medium text-sm md:text-base line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary-pink font-semibold group-hover:gap-3 transition-all">
            <span>Διαβάστε το άρθρο</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}


