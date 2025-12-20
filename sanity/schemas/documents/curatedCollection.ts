import { defineField, defineType } from "sanity";

export const curatedCollection = defineType({
  name: "curatedCollection",
  title: "Curated Collection",
  type: "document",
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
      name: "items",
      title: "Items",
      type: "array",
      of: [
        { type: "reference", name: "collectionArticle", to: [{ type: "article" }] },
        { type: "reference", name: "collectionRecipe", to: [{ type: "recipe" }] },
        { type: "reference", name: "collectionActivity", to: [{ type: "activity" }] },
        { type: "reference", name: "collectionPrintable", to: [{ type: "printable" }] },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "placement",
      title: "Placement",
      type: "string",
      options: {
        list: [
          { title: "Home Featured", value: "homeFeatured" },
          { title: "Parents Page Top", value: "parentsPageTop" },
          { title: "Parents Page Quick Tips", value: "parentsPageQuickTips" },
          { title: "Activities Page Featured", value: "activitiesPageFeatured" },
          { title: "Sleep Start Here", value: "sleepStartHere" },
          { title: "Speech Start Here", value: "speechStartHere" },
          { title: "Nutrition Start Here", value: "nutritionStartHere" },
          { title: "Arts & Crafts Start Here", value: "artsCraftsStartHere" },
          { title: "Recipes Start Here", value: "recipesStartHere" },
          { title: "Development Start Here", value: "developmentStartHere" },
          { title: "Greek Abroad Start Here", value: "greekAbroadStartHere" },
          { title: "Play Ideas Start Here", value: "playIdeasStartHere" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ageGroup",
      title: "Age Group (Filter)",
      type: "reference",
      to: [{ type: "ageGroup" }],
      description: "Optional: Filter by age group",
    }),
    defineField({
      name: "category",
      title: "Category (Filter)",
      type: "reference",
      to: [{ type: "category" }],
      description: "Optional: Filter by category",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "For sorting multiple collections in the same placement",
      initialValue: 0,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      placement: "placement",
      itemCount: "items",
    },
    prepare({ title, placement, itemCount }) {
      const count = Array.isArray(itemCount) ? itemCount.length : 0;
      return {
        title,
        subtitle: `${placement} • ${count} item${count !== 1 ? "s" : ""}`,
      };
    },
  },
});

