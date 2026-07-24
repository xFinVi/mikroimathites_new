import { defineField, defineType } from "sanity";

export const featuredVideosSection = defineType({
  name: "featuredVideosSection",
  title: "Featured Videos Section",
  type: "document",
  // Singleton pattern - only one featured videos section
  __experimental_actions: ["create", "update", "publish", "delete"],
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Sneak Peek από το κανάλι μας",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
      initialValue:
        "Δείτε τι μπορείτε να δείτε στο YouTube μας — σύντομα βίντεο που δείχνουν το περιεχόμενό μας",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeChannelUrl",
      title: "YouTube Channel URL",
      type: "url",
      initialValue: "https://www.youtube.com/@MikroiMathites",
    }),
    defineField({
      name: "videos",
      title: "Featured Videos",
      type: "array",
      description:
        "Add and reorder the videos shown on the home page. Maximum 6 recommended. Drag to reorder.",
      validation: (Rule) => Rule.max(6).warning("Maximum 6 videos recommended"),
      of: [
        {
          type: "object",
          name: "featuredVideo",
          title: "Video",
          fields: [
            defineField({
              name: "youtubeId",
              title: "YouTube Video ID",
              type: "string",
              description:
                'Only the ID, e.g. "Irrr-yMZADw" from youtube.com/watch?v=Irrr-yMZADw',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "startTime",
              title: "Start Time (seconds)",
              type: "number",
              description: "Optional — where the preview should start, in seconds.",
              validation: (Rule) => Rule.min(0),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "youtubeId" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Video",
                subtitle: subtitle ? `ID: ${subtitle}` : "No video ID",
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Featured Videos Section",
        subtitle: subtitle || "Manage featured YouTube videos on the home page",
      };
    },
  },
});
