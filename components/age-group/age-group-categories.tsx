import { Category } from "@/lib/content";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface AgeGroupCategoriesProps {
  ageGroupSlug: string;
  categoriesWithContent: string[];
  allCategories: Category[];
}

export function AgeGroupCategories({
  ageGroupSlug,
  categoriesWithContent,
  allCategories,
}: AgeGroupCategoriesProps) {
  const relevantCategories = allCategories.filter((cat) =>
    categoriesWithContent.includes(cat.slug)
  );

  if (relevantCategories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">Κατηγορίες</h3>
        <p className="text-text-medium text-sm">
          Περιεχόμενο οργανωμένο ανά θέμα για αυτή την ηλικιακή ομάδα
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevantCategories.map((category) => (
          <Link
            key={category._id}
            href={`/age/${ageGroupSlug}?category=${category.slug}`}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-text-dark mb-2">
                  {category.title}
                </h4>
                {category.description && (
                  <p className="text-text-medium text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

