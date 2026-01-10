import { defineType, defineField } from "sanity";

/**
 * Testimonial Document Schema
 * 
 * Stores user testimonials/feedback for social proof section
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
      description: "The testimonial quote (max 500 characters)",
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
      description: "First name only for privacy (e.g., 'Μαρία')",
    }),
    defineField({
      name: "childAge",
      title: "Child Age",
      type: "string",
      options: {
        list: [
          { title: "0-2 ετών", value: "0-2" },
          { title: "2-4 ετών", value: "2-4" },
          { title: "4-6 ετών", value: "4-6" },
        ],
      },
      description: "Age group of the child (optional, for context)",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
      description: "Star rating (1-5, optional)",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this testimonial in the homepage section",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
      description: "Display order (lower numbers appear first)",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      authorName: "authorName",
      featured: "featured",
      rating: "rating",
    },
    prepare({ quote, authorName, featured, rating }) {
      const title = authorName ? `${authorName}${rating ? ` (${rating}⭐)` : ""}` : "Anonymous";
      const subtitle = quote ? (quote.length > 60 ? `${quote.substring(0, 60)}...` : quote) : "No quote";
      return {
        title,
        subtitle,
        media: featured ? "⭐" : undefined,
      };
    },
  },
  orderings: [
    {
      title: "Featured First",
      name: "featuredDesc",
      by: [{ field: "featured", direction: "desc" }, { field: "order", direction: "asc" }],
    },
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Published Date",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
