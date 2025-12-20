import { defineField, defineType } from "sanity";

export const ageGroup = defineType({
  name: "ageGroup",
  title: "Age Group",
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
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "For sorting",
      initialValue: 0,
    }),
    defineField({
      name: "color",
      title: "Color (hex)",
      type: "string",
      description: "Hex color code for UI",
    }),
  ],
});

