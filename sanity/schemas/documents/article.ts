import { defineField, defineType } from "sanity";
import { seo } from "../objects/seo";
import { countWordsInBody, countImagesInBody, getImageRecommendation, getRecommendationMessage } from "../utils/image-recommendations";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    // Standardized fields
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error("Cover image is required for featured content"),
    }),
    defineField({
      name: "secondaryImage",
      title: "Secondary Image (Optional)",
      type: "image",
      options: { hotspot: true },
      description: "An additional image for the article (optional)",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "ageGroups",
      title: "Age Groups",
      type: "array",
      of: [{ type: "reference", to: [{ type: "ageGroup" }] }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "relatedContent",
      title: "Related Content",
      type: "array",
      of: [
        { type: "reference", name: "relatedArticle", to: [{ type: "article" }], weak: true },
        { type: "reference", name: "relatedRecipe", to: [{ type: "recipe" }], weak: true },
        { type: "reference", name: "relatedActivity", to: [{ type: "activity" }], weak: true },
      ],
    }),
    // Article-specific fields
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [
        { type: "block" },
        { 
          type: "image", 
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Important for accessibility and SEO",
              validation: (Rule) => Rule.required().error("Alt text is required for images"),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption that appears below the image",
            },
          ],
        },
      ],
      description: `
📝 Image Guidelines for Best Readability (Cover image always counts as 1):

• 0-300 words: 1 image recommended (cover image)
• 300-600 words: 2 images recommended (1 cover + 1 in content)
• 600-1000 words: 3-4 images recommended (1 cover + 2-3 in content)
• 1000-1500 words: 5-6 images recommended (1 cover + 4-5 in content)
• 1500-2000 words: 7-8 images recommended (1 cover + 6-7 in content)
• 2000+ words: ~1 image per 200-250 words

💡 Tips:
• You can always add MORE images than recommended for better visual appeal!
• Add images using the "+" button in the editor
• Images break up long text and improve readability
• Remember: The cover image counts toward your total image count

✅ These are recommendations, not requirements - you can publish with any number of images!
      `,
      validation: (Rule) => 
        Rule.custom((body) => {
          // Only validate structure, not blocking on image count
          if (!body || !Array.isArray(body)) {
            return "Body content is required";
          }
          
          // Always allow publishing - recommendations are shown in description
          return true;
        }),
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
  ],
});



