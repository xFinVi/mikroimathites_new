import { defineField, defineType } from "sanity";
import { seo } from "../objects/seo";
import { ingredient } from "../objects/ingredient";

export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
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
      description: "An additional image for the recipe (optional)",
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
        { type: "reference", name: "relatedArticle", to: [{ type: "article" }] },
        { type: "reference", name: "relatedRecipe", to: [{ type: "recipe" }] },
        { type: "reference", name: "relatedActivity", to: [{ type: "activity" }] },
      ],
    }),
    // Recipe-specific fields
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Easy", value: "easy" },
          { title: "Medium", value: "medium" },
          { title: "Hard", value: "hard" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prepTime",
      title: "Prep Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "cookTime",
      title: "Cook Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "servings",
      title: "Servings",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [{ type: "ingredient" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tips",
      title: "Tips",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "nutritionNotes",
      title: "Nutrition Notes",
      type: "text",
    }),
  ],
});

