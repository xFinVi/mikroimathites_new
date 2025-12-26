import { defineField, defineType } from "sanity";

export const featuredContentSection = defineType({
  name: "featuredContentSection",
  title: "Featured Content Section",
  type: "document",
  // Singleton pattern - only one featured content section
  __experimental_actions: ["create", "update", "publish", "delete"],
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Προτεινόμενο",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      initialValue: "Συμβουλές για γονείς, ιδέες για παιδιά και πρακτικό περιεχόμενο",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentItems",
      title: "Featured Content Items",
      type: "array",
      description: "Select and order content to feature. Maximum 6 items. Drag to reorder.",
      validation: (Rule) => Rule.max(6).warning("Maximum 6 items recommended"),
      of: [
        {
          type: "object",
          name: "featuredItem",
          title: "Featured Item",
          fields: [
            defineField({
              name: "contentType",
              title: "Content Type",
              type: "string",
              options: {
                list: [
                  { title: "Article", value: "article" },
                  { title: "Activity", value: "activity" },
                  { title: "Printable", value: "printable" },
                  { title: "Recipe", value: "recipe" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "article",
              title: "Article",
              type: "reference",
              to: [{ type: "article" }],
              hidden: ({ parent }) => parent?.contentType !== "article",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { contentType?: string };
                  if (parent?.contentType === "article" && !value) {
                    return "Article is required when content type is Article";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "activity",
              title: "Activity",
              type: "reference",
              to: [{ type: "activity" }],
              hidden: ({ parent }) => parent?.contentType !== "activity",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { contentType?: string };
                  if (parent?.contentType === "activity" && !value) {
                    return "Activity is required when content type is Activity";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "printable",
              title: "Printable",
              type: "reference",
              to: [{ type: "printable" }],
              hidden: ({ parent }) => parent?.contentType !== "printable",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { contentType?: string };
                  if (parent?.contentType === "printable" && !value) {
                    return "Printable is required when content type is Printable";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "recipe",
              title: "Recipe",
              type: "reference",
              to: [{ type: "recipe" }],
              hidden: ({ parent }) => parent?.contentType !== "recipe",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { contentType?: string };
                  if (parent?.contentType === "recipe" && !value) {
                    return "Recipe is required when content type is Recipe";
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              contentType: "contentType",
              articleTitle: "article.title",
              activityTitle: "activity.title",
              printableTitle: "printable.title",
              recipeTitle: "recipe.title",
            },
            prepare({ contentType, articleTitle, activityTitle, printableTitle, recipeTitle }) {
              const titles = {
                article: articleTitle,
                activity: activityTitle,
                printable: printableTitle,
                recipe: recipeTitle,
              };
              return {
                title: titles[contentType as keyof typeof titles] || "No title",
                subtitle: contentType ? `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` : "No type",
              };
            },
          },
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
        title: title || "Featured Content Section",
        subtitle: subtitle || "Manage featured content for home page",
      };
    },
  },
});

