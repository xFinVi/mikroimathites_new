import Link from "next/link";
import type { Article, Category } from "@/lib/content";
import { ArticleMeta } from "./article-meta";

interface ArticleHeaderProps {
  article: Article;
  category?: Category;
}

export function ArticleHeader({ article, category: propCategory }: ArticleHeaderProps) {
  // Extract category from article if not provided as prop
  // This handles TypeScript inference issues with Sanity fetch results
  const category = propCategory || (article.category && 
    typeof article.category === 'object' && 
    'slug' in article.category && 
    'title' in article.category
      ? article.category as Category
      : undefined);

  return (
    <header className="space-y-6">
      {category && (
        <Link
          href={`/gia-goneis?category=${category.slug}`}
          className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-pink/10 to-accent-yellow/10 text-primary-pink text-sm font-bold hover:from-primary-pink/20 hover:to-accent-yellow/20 transition-all shadow-sm border border-primary-pink/20"
        >
          {category.title}
        </Link>
      )}

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-dark leading-tight tracking-tight">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="text-xl md:text-2xl text-text-medium leading-relaxed max-w-3xl font-light">
          {article.excerpt}
        </p>
      )}

      <div className="pt-4">
        <ArticleMeta article={article} />
      </div>
    </header>
  );
}

