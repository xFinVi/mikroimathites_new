"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  label?: string;
}

export function StarRating({ value, onChange, required = false, label }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-base font-semibold text-text-dark block">
          {label}
          {required && <span className="text-primary-pink">*</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-pink focus:ring-offset-2 rounded",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                (hovered !== null ? star <= hovered : star <= value)
                  ? "fill-accent-yellow text-accent-yellow"
                  : "fill-none text-text-light stroke-2"
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-text-medium">
            {value === 1 && "Χαμηλή"}
            {value === 2 && "Μέτρια"}
            {value === 3 && "Καλά"}
            {value === 4 && "Πολύ καλά"}
            {value === 5 && "Εξαιρετικά"}
          </span>
        )}
      </div>
    </div>
  );
}

