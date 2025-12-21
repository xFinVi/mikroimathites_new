import { defineField, defineType } from "sanity";

export const featuredBanner = defineType({
  name: "featuredBanner",
  title: "Featured Banner",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: false,
      description: "Show this featured banner on the home page",
    }),
    defineField({
      name: "type",
      title: "Content Type",
      type: "string",
      options: {
        list: [
          { title: "YouTube Video", value: "youtube" },
          { title: "Featured Article", value: "article" },
          { title: "Featured Activity", value: "activity" },
          { title: "Featured Recipe", value: "recipe" },
          { title: "Custom Content", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "custom",
      validation: (Rule) => Rule.required(),
    }),
    // Text content (left side)
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    // CTA buttons
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "link",
          title: "Link",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA (Optional)",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "link",
          title: "Link",
          type: "string",
        }),
      ],
    }),
    // Content reference (for article/activity/recipe)
    defineField({
      name: "contentRef",
      title: "Content Reference",
      type: "reference",
      to: [
        { type: "article" },
        { type: "activity" },
        { type: "recipe" },
      ],
      hidden: ({ parent }) => parent?.type === "youtube" || parent?.type === "custom",
    }),
    // YouTube video
    defineField({
      name: "youtubeVideo",
      title: "YouTube Video",
      type: "object",
      fields: [
        defineField({
          name: "videoId",
          title: "YouTube Video ID",
          type: "string",
          description: "The video ID from the YouTube URL (e.g., 'dQw4w9WgXcQ' from 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "thumbnail",
          title: "Custom Thumbnail (Optional)",
          type: "image",
          options: { hotspot: true },
          description: "If not provided, YouTube thumbnail will be used",
        }),
      ],
      hidden: ({ parent }) => parent?.type !== "youtube",
    }),
    // Custom image (for custom content type)
    defineField({
      name: "customImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== "custom",
    }),
    // Background color
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      options: {
        list: [
          { title: "Dark Blue", value: "#1a1f3a" },
          { title: "Primary Pink", value: "#ec4899" },
          { title: "Secondary Blue", value: "#3b82f6" },
          { title: "Accent Yellow", value: "#fbbf24" },
          { title: "Custom", value: "custom" },
        ],
      },
      initialValue: "#1a1f3a",
    }),
    defineField({
      name: "customBackgroundColor",
      title: "Custom Background Color",
      type: "string",
      description: "Hex color code (e.g., #1a1f3a)",
      hidden: ({ parent }) => parent?.backgroundColor !== "custom",
    }),
  ],
  preview: {
    select: {
      title: "title",
      enabled: "enabled",
      type: "type",
    },
    prepare({ title, enabled, type }) {
      return {
        title: title || "Featured Banner",
        subtitle: `${enabled ? "Enabled" : "Disabled"} • ${type || "custom"}`,
      };
    },
  },
});

