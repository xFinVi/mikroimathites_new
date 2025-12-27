import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string | ReactNode;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline";
  };
}

/**
 * Reusable empty state component
 * Provides consistent styling and Greek copy for empty states throughout the app
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-8 text-center">
      <h2 className="text-xl font-bold text-text-dark">{title}</h2>
      <div className="mt-2 text-text-medium">
        {typeof description === "string" ? <p>{description}</p> : description}
      </div>
      {action && (
        <Link href={action.href} className="mt-5 inline-block">
          <Button
            variant={action.variant || "default"}
            className={`rounded-button px-5 py-3 transition ${
              action.variant === "outline"
                ? ""
                : "bg-primary-pink text-white hover:bg-primary-pink/90"
            }`}
          >
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}


