import { defineField, defineType } from "sanity";
import { hero } from "../objects/hero";
import { featuredBanner } from "../objects/featuredBanner";

export const pageSettings = defineType({
  name: "pageSettings",
  title: "Page Settings",
  type: "document",
  // Singleton pattern - only one document
  // In Sanity Studio, you'll need to create this document once, then it becomes the only one
  fields: [
    defineField({
      name: "home",
      title: "Home Page",
      type: "object",
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "hero",
        }),
        defineField({
          name: "featuredBanner",
          title: "Featured Banner (Section 2)",
          type: "featuredBanner",
          description: "Large featured banner shown after the hero image. Can display YouTube videos, featured articles, or custom content.",
        }),
        defineField({
          name: "seasonalBanner",
          title: "Seasonal Banner",
          type: "object",
          fields: [
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "startDate",
              title: "Start Date",
              type: "date",
              description: "For future date-based scheduling",
            }),
            defineField({
              name: "endDate",
              title: "End Date",
              type: "date",
              description: "For future date-based scheduling",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "forParents",
      title: "For Parents Page",
      type: "object",
      fields: [
        defineField({
          name: "hero",
          title: "Hero",
          type: "hero",
        }),
        defineField({
          name: "featuredCategoryRefs",
          title: "Featured Categories",
          type: "array",
          of: [{ type: "reference", to: [{ type: "category" }] }],
        }),
        defineField({
          name: "featuredContentRefs",
          title: "Featured Content",
          type: "array",
          of: [
            { type: "reference", name: "featuredArticle", to: [{ type: "article" }] },
            { type: "reference", name: "featuredRecipe", to: [{ type: "recipe" }] },
            { type: "reference", name: "featuredActivity", to: [{ type: "activity" }] },
          ],
        }),
      ],
    }),
    defineField({
      name: "site",
      title: "Site Settings",
      type: "object",
      fields: [
        defineField({
          name: "defaultOgImage",
          title: "Default OG Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "navLinks",
          title: "Navigation Links",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
});

