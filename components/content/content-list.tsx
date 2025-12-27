import { Article, Recipe, Activity } from "@/lib/content";
import { ArticleCard } from "@/components/articles/article-card";
import { ActivityCard } from "@/components/activities/activity-card";
import { ContentType, getContentUrl } from "@/lib/utils/content";
import Link from "next/link";
import Image from "next/image";

type ContentItem = (Article & { _contentType?: ContentType; imageUrl?: string | null }) | (Recipe & { _contentType?: ContentType; imageUrl?: string | null }) | (Activity & { _contentType?: ContentType; imageUrl?: string | null });

interface ContentListProps {
  items: ContentItem[];
  title: string;
}

function RecipeCard({ recipe }: { recipe: Recipe & { imageUrl?: string | null } }) {
  // Use pre-generated image URL from server (no client-side generation)
  const imageUrl = recipe.imageUrl || null;

  return (
    <Link href={getContentUrl("recipe", recipe.slug)}>
      <div className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full">
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
                <div className="text-3xl mb-2">🍳</div>
                <div className="text-xs text-text-medium font-medium">No Image</div>
              </div>
            </div>
          )}
        </div>

        {/* White Text Section Below Image */}
        <div className="p-5 bg-white flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
            {recipe.title}
          </h3>
          
          {/* Recipe Meta */}
          <div className="mt-auto flex items-center gap-2 text-xs text-text-medium">
            <span>🍳 Συνταγή</span>
            {recipe.difficulty && (
              <>
                <span>•</span>
                <span className="capitalize">{recipe.difficulty}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ActivityCardCompact({ activity }: { activity: Activity & { imageUrl?: string | null } }) {
  // Use pre-generated image URL from server (no client-side generation)
  const imageUrl = activity.imageUrl || null;

  return (
    <Link href={getContentUrl("activity", activity.slug)}>
      <div className="bg-background-white rounded-[20px] overflow-hidden border-2 border-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full h-64 bg-background-light overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/20 via-secondary-blue/20 to-accent-yellow/20 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-xs text-text-medium font-medium">No Image</div>
              </div>
            </div>
          )}
        </div>

        {/* White Text Section Below Image */}
        <div className="p-5 bg-white flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-bold text-text-dark line-clamp-2 mb-2 group-hover:text-primary-pink transition-colors flex-shrink-0">
            {activity.title}
          </h3>
          
          {/* Activity Meta */}
          <div className="mt-auto flex items-center gap-2 text-xs text-text-medium">
            <span>🎨 Δραστηριότητα</span>
            {activity.duration && (
              <>
                <span>•</span>
                <span>{activity.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ContentList({ items, title }: ContentListProps) {
  if (items.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">{title}</h2>
        <div className="bg-background-white rounded-card p-12 text-center shadow-subtle border border-border/50">
          <p className="text-text-medium mb-4">Δεν βρέθηκαν αποτελέσματα με τα επιλεγμένα φίλτρα.</p>
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
        {items.map((item) => {
          // Use _contentType field if available, otherwise fall back to type detection
          if (item._contentType === 'recipe' || (!item._contentType && 'ingredients' in item && !('steps' in item))) {
            return <RecipeCard key={item._id} recipe={item as Recipe & { imageUrl?: string | null }} />;
          }
          if (item._contentType === 'activity' || (!item._contentType && 'steps' in item && 'materials' in item)) {
            return <ActivityCardCompact key={item._id} activity={item as Activity & { imageUrl?: string | null }} />;
          }
          return <ArticleCard key={item._id} article={item as Article} compact />;
        })}
      </div>
    </section>
  );
}

