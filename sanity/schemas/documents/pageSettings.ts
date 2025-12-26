import { defineField, defineType } from "sanity";
import { hero } from "../objects/hero";

export const pageSettings = defineType({
  name: "pageSettings",
  title: "Page Settings",
  type: "document",
  // Singleton pattern - only one document
  // In Sanity Studio, you'll need to create this document once, then it becomes the only one
  fields: [
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

