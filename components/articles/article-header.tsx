import Link from "next/link";
import type { Article, Category } from "@/lib/content";
import { ArticleMeta } from "./article-meta";

interface ArticleHeaderProps {
  article: Article;
  category?: Category;
}

export function ArticleHeader({ article, category }: ArticleHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {category && (
        <Link
          href={`/gia-goneis?category=${category.slug}`}
          className="inline-block px-4 py-2 rounded-full bg-primary-pink/10 text-primary-pink text-sm font-semibold hover:bg-primary-pink/20 transition"
        >
          {category.title}
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
    </div>
  );
}

