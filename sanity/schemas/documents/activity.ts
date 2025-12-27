import { defineField, defineType } from "sanity";
import { seo } from "../objects/seo";
import { activityStep } from "../objects/activity-step";

export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  fields: [
    // Standardized fields
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error("Cover image is required for featured content"),
    }),
    defineField({
      name: "secondaryImage",
      title: "Secondary Image (Optional)",
      type: "image",
      options: { hotspot: true },
      description: "An additional image for the activity (optional)",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "ageGroups",
      title: "Age Groups",
      type: "array",
      of: [{ type: "reference", to: [{ type: "ageGroup" }] }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "relatedContent",
      title: "Related Content",
      type: "array",
      of: [
        { type: "reference", name: "relatedArticle", to: [{ type: "article" }], weak: true },
        { type: "reference", name: "relatedRecipe", to: [{ type: "recipe" }], weak: true },
        { type: "reference", name: "relatedActivity", to: [{ type: "activity" }], weak: true },
      ],
    }),
    // Activity-specific fields
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g., "5 minutes", "10-15 minutes"',
    }),
    defineField({
      name: "goals",
      title: "Goals",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "steps",
      title: "Steps / Instructions",
      type: "array",
      description: "Add steps for the activity. Each step can have an optional title, content, and image.",
      of: [
        { type: "activityStep" },
        // Keep legacy support for old PortableText format
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "videoEmbed",
          title: "Video Embed",
          fields: [
            defineField({
              name: "url",
              title: "Video URL (YouTube/Vimeo)",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error("At least one step is required"),
    }),
    defineField({
      name: "safetyNotes",
      title: "Safety Notes",
      type: "text",
    }),
    defineField({
      name: "enableCarousel",
      title: "Enable Image Carousel",
      type: "boolean",
      initialValue: false,
      description: "If enabled, display a carousel of images at the bottom of the activity page",
    }),
    defineField({
      name: "carouselImages",
      title: "Carousel Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Important for accessibility",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.custom((images, context) => {
          const parent = context.parent as { enableCarousel?: boolean };
          if (parent?.enableCarousel && (!images || images.length < 3)) {
            return "At least 3 images are required when carousel is enabled";
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.enableCarousel,
    }),
  ],
});



