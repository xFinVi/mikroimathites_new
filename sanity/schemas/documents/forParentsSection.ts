import { defineField, defineType } from "sanity";

export const forParentsSection = defineType({
  name: "forParentsSection",
  title: "For Parents Section",
  type: "document",
  // Singleton pattern - only one for parents section
  __experimental_actions: ["create", "update", "publish", "delete"],
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Συμβουλές για Γονείς",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      initialValue: "Πρακτικές συμβουλές και ιδέες για την καθημερινότητα",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "viewAllText",
      title: "View All Link Text",
      type: "string",
      initialValue: "Δείτε όλα τα άρθρα",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "viewAllLink",
      title: "View All Link URL",
      type: "string",
      initialValue: "/gia-goneis",
      description: "URL for the 'View All' link (e.g., /gia-goneis)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "articles",
      title: "Featured Articles",
      type: "array",
      description: "Select and order articles to feature. Maximum 6 items. Drag to reorder.",
      validation: (Rule) => Rule.max(6).warning("Maximum 6 articles recommended"),
      of: [
        {
          type: "reference",
          to: [{ type: "article" }],
          weak: true, // Weak reference: allows deletion even if referenced
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "For Parents Section",
        subtitle: subtitle || "Manage articles for parents section",
      };
    },
  },
});


