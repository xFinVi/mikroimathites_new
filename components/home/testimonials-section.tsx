/**
 * TestimonialsSection - Parent reviews on the homepage
 *
 * Presentational. Fed by approved reviews from Supabase (see lib/testimonials).
 * Renders nothing when there are no testimonials, so the section only appears
 * once reviews are approved in the admin panel.
 */

import { Container } from "@/components/ui/container";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/testimonials";

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} από 5 αστέρια`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={
            index < rating
              ? "w-4 h-4 fill-amber-400 text-amber-400"
              : "w-4 h-4 text-amber-200"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  title = "Τι λένε οι γονείς",
  subtitle = "Μηνύματα αγάπης από την κοινότητά μας",
  testimonials = [],
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative bg-[#F0FDFA] py-16 md:py-20 overflow-hidden">
      {/* Playful Header Section */}
      <div className="bg-teal-400 py-12 md:py-16 mb-12">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
          {testimonials.map((testimonial, index) => (
            <li
              key={`${testimonial.firstName}-${index}`}
              className="flex flex-col gap-4 bg-white rounded-[20px] border-2 border-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-6"
            >
              {typeof testimonial.rating === "number" && (
                <StarRating rating={testimonial.rating} />
              )}

              <blockquote className="text-text-dark text-base leading-relaxed flex-1">
                <span aria-hidden="true" className="text-teal-400 text-2xl font-bold mr-1">
                  “
                </span>
                {testimonial.quote}
              </blockquote>

              <footer className="flex items-center gap-3 pt-2 border-t border-border/20">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-teal-600">
                    {testimonial.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-dark truncate">
                    {testimonial.firstName}
                  </p>
                  {testimonial.context && (
                    <p className="text-xs text-text-medium truncate">
                      {testimonial.context}
                    </p>
                  )}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
