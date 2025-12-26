import { defineField, defineType } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home Hero",
  type: "document",
  // Singleton pattern - only one hero image
  __experimental_actions: ["create", "update", "publish", "delete"],
  fields: [
    defineField({
      name: "image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "The main hero image displayed at the top of the home page",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Home Hero",
        subtitle: "Hero image for the home page",
        media,
      };
    },
  },
});

