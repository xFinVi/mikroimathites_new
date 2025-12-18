import { defineField, defineType } from "sanity";
import { seo } from "../objects/seo";

export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  fields: [
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
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
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
      title: "Steps",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});


