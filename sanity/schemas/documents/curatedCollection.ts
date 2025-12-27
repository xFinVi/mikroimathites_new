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
      description: "Add articles, activities, recipes, or printables. Only published documents with slugs will work.",
      of: [
        { 
          type: "reference", 
          name: "collectionArticle", 
          title: "Article",
          to: [{ type: "article" }],
          weak: true, // Weak reference: allows deletion even if referenced
          options: {
            filter: '!(_id in path("drafts.**")) && defined(slug.current)',
          },
        },
        { 
          type: "reference", 
          name: "collectionRecipe",
          title: "Recipe",
          to: [{ type: "recipe" }],
          weak: true, // Weak reference: allows deletion even if referenced
          options: {
            filter: '!(_id in path("drafts.**")) && defined(slug.current)',
          },
        },
        { 
          type: "reference", 
          name: "collectionActivity",
          title: "Activity",
          to: [{ type: "activity" }],
          weak: true, // Weak reference: allows deletion even if referenced
          options: {
            filter: '!(_id in path("drafts.**")) && defined(slug.current)',
          },
        },
        { 
          type: "reference", 
          name: "collectionPrintable",
          title: "Printable",
          to: [{ type: "printable" }],
          weak: true, // Weak reference: allows deletion even if referenced
          options: {
            filter: '!(_id in path("drafts.**")) && defined(slug.current)',
          },
        },
      ],
      // Allow empty collections - broken references will be filtered out
      // Minimum validation removed to allow cascading deletion
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
          { title: "Quick Tips (Parents Page)", value: "quick-tips" },
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

