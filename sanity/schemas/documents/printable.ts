import { defineField, defineType } from "sanity";
import { seo } from "../objects/seo";

export const printable = defineType({
  name: "printable",
  title: "Printable",
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
      description: "An additional image for the printable (optional)",
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
    // Printable-specific fields
    defineField({
      name: "file",
      title: "File (PDF)",
      type: "file",
      options: {
        storeOriginalFilename: true,
        accept: ".pdf",
      },
      description: "Upload a PDF file",
    }),
    defineField({
      name: "previewImages",
      title: "Preview Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
});



