"use client";

import { AgeGroup, Article, Activity, Printable, Recipe } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/content/search-bar";

interface AgeGroupContentGridProps {
  ageGroup: AgeGroup;
  articles: Article[];
  activities: Activity[];
  printables: Printable[];
  recipes: Recipe[];
  activeType: string;
  searchParams: { type?: string; category?: string; search?: string };
}

export function AgeGroupContentGrid({
  ageGroup,
  articles,
  activities,
  printables,
  recipes,
  activeType,
  searchParams,
}: AgeGroupContentGridProps) {
  const router = useRouter();
  const currentParams = useSearchParams();

  const updateTypeFilter = (type: string) => {
    const params = new URLSearchParams(currentParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`/age/${ageGroup.slug}?${params.toString()}`);
  };

  // Get content to display based on active type
  const getContentToShow = () => {
    switch (activeType) {
      case "articles":
        return { items: articles, type: "article" as const };
      case "activities":
        return { items: activities, type: "activity" as const };
      case "printables":
        return { items: printables, type: "printable" as const };
      case "recipes":
        return { items: recipes, type: "recipe" as const };
      default:
        // Show all mixed together
        const allItems = [
          ...articles.map((a) => ({ ...a, _contentType: "article" as const })),
          ...activities.map((a) => ({ ...a, _contentType: "activity" as const })),
          ...printables.map((p) => ({ ...p, _contentType: "printable" as const })),
          ...recipes.map((r) => ({ ...r, _contentType: "recipe" as const })),
        ];
        return { items: allItems, type: "all" as const };
    }
  };

  const { items, type } = getContentToShow();
  const totalCount = articles.length + activities.length + printables.length + recipes.length;

  return (
    <section className="space-y-6">
      {/* Header with Type Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
            Όλο το περιεχόμενο ({totalCount})
          </h2>
          <p className="text-text-medium text-sm mt-1">
            Άρθρα, δραστηριότητες, εκτυπώσιμα και συνταγές για {ageGroup.title.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
        <Button
          variant={activeType === "all" ? "default" : "ghost"}
          onClick={() => updateTypeFilter("all")}
          className={activeType === "all" ? "bg-primary-pink hover:bg-primary-pink/90 text-white" : ""}
        >
          Όλα ({totalCount})
        </Button>
        <Button
          variant={activeType === "articles" ? "default" : "ghost"}
          onClick={() => updateTypeFilter("articles")}
          className={activeType === "articles" ? "bg-primary-pink hover:bg-primary-pink/90 text-white" : ""}
        >
          Άρθρα ({articles.length})
        </Button>
        <Button
          variant={activeType === "activities" ? "default" : "ghost"}
          onClick={() => updateTypeFilter("activities")}
          className={activeType === "activities" ? "bg-primary-pink hover:bg-primary-pink/90 text-white" : ""}
        >
          Δραστηριότητες ({activities.length})
        </Button>
        <Button
          variant={activeType === "printables" ? "default" : "ghost"}
          onClick={() => updateTypeFilter("printables")}
          className={activeType === "printables" ? "bg-primary-pink hover:bg-primary-pink/90 text-white" : ""}
        >
          Εκτυπώσιμα ({printables.length})
        </Button>
        <Button
          variant={activeType === "recipes" ? "default" : "ghost"}
          onClick={() => updateTypeFilter("recipes")}
          className={activeType === "recipes" ? "bg-primary-pink hover:bg-primary-pink/90 text-white" : ""}
        >
          Συνταγές ({recipes.length})
        </Button>
      </div>

      {/* Content Grid */}
      {items.length === 0 ? (
        <div className="bg-background-white rounded-card p-12 text-center shadow-subtle border border-border/50">
          <p className="text-text-medium mb-4">
            Δεν βρέθηκε περιεχόμενο για {ageGroup.title.toLowerCase()} με τα επιλεγμένα φίλτρα.
          </p>
          <p className="text-sm text-text-light">
            Δοκιμάστε να αλλάξετε τα φίλτρα ή{" "}
            <a href="/studio" className="text-secondary-blue hover:underline">
              προσθέστε περιεχόμενο στο Studio
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const contentType = type === "all" ? (item as any)._contentType : type;

            if (contentType === "article") {
              return <ArticleCard key={item._id} article={item as Article} />;
            }

            if (contentType === "activity") {
              return <ActivityCard key={item._id} activity={item as Activity} />;
            }

            if (contentType === "printable") {
              const printable = item as Printable;
              const imageUrl = printable.coverImage
                ? urlFor(printable.coverImage).width(400).height(250).url()
                : null;
              return (
                <Link
                  key={printable._id}
                  href={`/drastiriotites/printables/${printable.slug}`}
                  className="bg-background-white rounded-card overflow-hidden shadow-subtle border border-border/50 hover:shadow-lg transition-shadow"
                >
                  {imageUrl && (
                    <div className="relative w-full h-48 bg-background-light">
                      <Image
                        src={imageUrl}
                        alt={printable.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="text-xs font-semibold text-primary-pink">Εκτυπώσιμο</div>
                    <h3 className="text-xl font-semibold text-text-dark line-clamp-2">
                      {printable.title}
                    </h3>
                    {printable.summary && (
                      <p className="text-text-medium text-sm line-clamp-2">
                        {printable.summary}
                      </p>
                    )}
                  </div>
                </Link>
              );
            }

            if (contentType === "recipe") {
              const recipe = item as Recipe;
              const imageUrl = recipe.coverImage
                ? urlFor(recipe.coverImage).width(600).height(400).url()
                : null;
              return (
                <Link
                  key={recipe._id}
                  href={`/gia-goneis/recipes/${recipe.slug}`}
                  className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={recipe.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">🍳</div>
                          <div className="text-xs text-text-medium font-medium">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* White Text Section Below Image */}
                  <div className="p-5 bg-white flex-1 flex flex-col">
                    {/* Recipe Label */}
                    <div className="text-xs font-semibold text-primary-pink mb-2 flex-shrink-0">
                      Συνταγή
                    </div>
                    {/* Title */}
                    <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
                      {recipe.title}
                    </h3>
                    {/* Summary */}
                    {recipe.summary && (
                      <p className="text-xs text-text-medium line-clamp-2 mt-auto">
                        {recipe.summary}
                      </p>
                    )}
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>
      )}
    </section>
  );
}

