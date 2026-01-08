import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Category",
        subtitle: subtitle ? `/${subtitle}` : "No slug",
      };
    },
  },
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
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Emoji or icon name",
    }),
    defineField({
      name: "color",
      title: "Color (hex)",
      type: "string",
      description: "Hex color code for UI",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "For sorting",
      initialValue: 0,
    }),
  ],
});

