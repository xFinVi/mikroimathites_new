import { defineField, defineType } from "sanity";

export const activitiesPrintablesSection = defineType({
  name: "activitiesPrintablesSection",
  title: "Activities & Printables Section",
  type: "document",
  // Singleton pattern - only one activities & printables section
  __experimental_actions: ["create", "update", "publish", "delete"],
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Δραστηριότητες & Εκτυπώσιμα",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      initialValue: "Διασκεδαστικές δραστηριότητες και δωρεάν εκτυπώσιμα",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "viewAllText",
      title: "View All Link Text",
      type: "string",
      initialValue: "Δείτε όλες",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "viewAllLink",
      title: "View All Link URL",
      type: "string",
      initialValue: "/drastiriotites",
      description: "URL for the 'View All' link (e.g., /drastiriotites)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentItems",
      title: "Featured Activities & Printables",
      type: "array",
      description: "Select and order activities or printables to feature. Maximum 6 items. Drag to reorder.",
      validation: (Rule) => Rule.max(6).warning("Maximum 6 items recommended"),
      of: [
        {
          type: "object",
          name: "contentItem",
          title: "Content Item",
          fields: [
            defineField({
              name: "contentType",
              title: "Content Type",
              type: "string",
              options: {
                list: [
                  { title: "Activity", value: "activity" },
                  { title: "Printable", value: "printable" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "activity",
              title: "Activity",
              type: "reference",
              to: [{ type: "activity" }],
              weak: true, // Weak reference: allows deletion even if referenced
              hidden: ({ parent }) => parent?.contentType !== "activity",
              options: {
                filter: '!(_id in path("drafts.**")) && defined(slug.current)',
              },
              // Broken references will be filtered out in queries
            }),
            defineField({
              name: "printable",
              title: "Printable",
              type: "reference",
              to: [{ type: "printable" }],
              weak: true, // Weak reference: allows deletion even if referenced
              hidden: ({ parent }) => parent?.contentType !== "printable",
              options: {
                filter: '!(_id in path("drafts.**")) && defined(slug.current)',
              },
              // Broken references will be filtered out in queries
            }),
          ],
          preview: {
            select: {
              contentType: "contentType",
              activityTitle: "activity.title",
              printableTitle: "printable.title",
            },
            prepare({ contentType, activityTitle, printableTitle }) {
              const titles = {
                activity: activityTitle,
                printable: printableTitle,
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
        title: title || "Activities & Printables Section",
        subtitle: subtitle || "Manage activities and printables section",
      };
    },
  },
});


