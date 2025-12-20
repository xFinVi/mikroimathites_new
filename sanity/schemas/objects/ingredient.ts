import { defineField, defineType } from "sanity";

export const ingredient = defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "string",
      description: 'e.g., "1 cup", "2 tablespoons"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "string",
      description: 'e.g., "chopped", "at room temperature"',
    }),
  ],
  preview: {
    select: {
      name: "name",
      amount: "amount",
      notes: "notes",
    },
    prepare({ name, amount, notes }) {
      return {
        title: name,
        subtitle: `${amount}${notes ? ` (${notes})` : ""}`,
      };
    },
  },
});

