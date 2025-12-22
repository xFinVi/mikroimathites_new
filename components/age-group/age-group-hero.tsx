import { AgeGroup } from "@/lib/content";
import { Container } from "@/components/ui/container";

interface AgeGroupHeroProps {
  ageGroup: AgeGroup;
}

// Color mapping for different age groups
const getAgeGroupStyles = (slug: string) => {
  const styles: Record<string, { bg: string; text: string; accent: string }> = {
    "0-2": {
      bg: "bg-primary-pink",
      text: "text-white",
      accent: "bg-primary-pink/20",
    },
    "2-4": {
      bg: "bg-secondary-blue",
      text: "text-white",
      accent: "bg-secondary-blue/20",
    },
    "4-6": {
      bg: "bg-accent-yellow",
      text: "text-text-dark",
      accent: "bg-accent-yellow/20",
    },
  };

  // Try to match slug (could be "0-2", "0_2", etc.)
  const normalizedSlug = slug.replace("_", "-");
  return styles[normalizedSlug] || styles["0-2"];
};

export function AgeGroupHero({ ageGroup }: AgeGroupHeroProps) {
  const styles = getAgeGroupStyles(ageGroup.slug);

  return (
    <div className={`${styles.bg} relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <Container className="relative py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className={`inline-block px-6 py-3 ${styles.accent} ${styles.text} rounded-full text-sm font-semibold`}>
            Ηλικιακή Ομάδα
          </div>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${styles.text} leading-tight`}>
            {ageGroup.title}
          </h1>
          {ageGroup.description && (
            <p className={`text-lg sm:text-xl ${styles.text}/90 max-w-2xl mx-auto`}>
              {ageGroup.description}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

