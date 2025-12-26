import { defineField, defineType } from "sanity";

/**
 * Activity Step Object
 * 
 * Represents a single step in an activity's instructions.
 * Each step can have:
 * - Optional title/heading
 * - Rich text content (PortableText)
 * - Optional image to illustrate the step
 * 
 * This structure makes it easy for content creators to add
 * images for each step, improving visual clarity and user experience.
 */
export const activityStep = defineType({
  name: "activityStep",
  title: "Activity Step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Step Title (Optional)",
      type: "string",
      description: "Optional heading for this step (e.g., 'Step 1: Preparation')",
    }),
    defineField({
      name: "content",
      title: "Step Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Important for accessibility",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error("Step content is required"),
    }),
    defineField({
      name: "image",
      title: "Step Image (Optional)",
      type: "image",
      options: { hotspot: true },
      description: "An image to illustrate this step. This will be displayed prominently with the step content.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Important for accessibility",
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      content: "content",
      image: "image",
    },
    prepare({ title, content, image }) {
      // Get first block of text for preview
      const firstBlock = content?.[0];
      const textPreview =
        firstBlock?.children?.[0]?.text ||
        firstBlock?._type === "image"
          ? "Image"
          : "No content";

      return {
        title: title || `Step: ${textPreview.substring(0, 50)}...`,
        subtitle: title ? textPreview.substring(0, 50) : undefined,
        media: image || undefined,
      };
    },
  },
});

