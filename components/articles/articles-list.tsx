import { Article } from "@/lib/content";
import { ArticleCard } from "./article-card";

interface ArticlesListProps {
  articles: Article[];
  title: string;
}

export function ArticlesList({ articles, title }: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">{title}</h2>
        <div className="bg-background-white rounded-card p-12 text-center shadow-subtle border border-border/50">
          <p className="text-text-medium mb-4">Δεν βρέθηκαν άρθρα με τα επιλεγμένα φίλτρα.</p>
          <p className="text-sm text-text-light">
            Δοκιμάστε να αλλάξετε τα φίλτρα ή{" "}
            <a href="/studio" className="text-secondary-blue hover:underline">
              προσθέστε περιεχόμενο στο Studio
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}

