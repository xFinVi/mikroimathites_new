import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "None", value: "none" },
        ],
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "object",
      hidden: ({ parent }) => parent?.type !== "video",
      fields: [
        defineField({
          name: "url",
          title: "Video URL (YouTube/Vimeo)",
          type: "url",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "thumbnail",
          title: "Thumbnail Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "autoplay",
          title: "Autoplay",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "loop",
          title: "Loop",
          type: "boolean",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "overlay",
      title: "Overlay",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enabled",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "opacity",
          title: "Opacity",
          type: "number",
          initialValue: 0.5,
          validation: (Rule) => Rule.min(0).max(1),
        }),
        defineField({
          name: "color",
          title: "Color (hex)",
          type: "string",
          initialValue: "#000000",
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
        }),
        defineField({
          name: "ctaText",
          title: "CTA Text",
          type: "string",
        }),
        defineField({
          name: "ctaLink",
          title: "CTA Link",
          type: "string",
        }),
        defineField({
          name: "alignment",
          title: "Alignment",
          type: "string",
          options: {
            list: [
              { title: "Left", value: "left" },
              { title: "Center", value: "center" },
              { title: "Right", value: "right" },
            ],
          },
          initialValue: "left",
        }),
      ],
    }),
  ],
});

