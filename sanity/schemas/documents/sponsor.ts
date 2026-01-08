import { defineField, defineType } from "sanity";

/**
 * Sponsor Document Schema
 * 
 * IMPORTANT: Only includes safe, public fields
 * DO NOT include sensitive fields like contact_email, payment info
 * 
 * This schema is synced from the database (Supabase) via the sync API
 * The databaseId field is used for idempotent syncs
 */
export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    // DO NOT include contactEmail - sensitive field, keep in DB only
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Education", value: "education" },
          { title: "Health", value: "health" },
          { title: "Local", value: "local" },
          { title: "Tech", value: "tech" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: {
        list: [
          { title: "Premium", value: "premium" },
          { title: "Standard", value: "standard" },
          { title: "Community", value: "community" },
        ],
      },
      initialValue: "standard",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "databaseId",
      title: "Database ID",
      type: "string",
      readOnly: true,
      description: "Reference to Supabase sponsor record (for sync)",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      media: "logo",
      active: "isActive",
    },
    prepare({ title, media, active }) {
      return {
        title: title || "Untitled Sponsor",
        subtitle: active ? "Active" : "Inactive",
        media,
      };
    },
  },
});

