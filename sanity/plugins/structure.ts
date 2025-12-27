import type { StructureResolver } from "sanity/structure";

/**
 * Singleton document configurations
 * These documents should only have one instance and use S.editor() instead of S.documentTypeList()
 */
const SINGLETONS = [
  { title: "Home Hero", type: "homeHero", id: "homeHero" },
  { title: "Featured Content Section", type: "featuredContentSection", id: "featuredContentSection" },
  { title: "For Parents Section", type: "forParentsSection", id: "forParentsSection" },
  { title: "Activities & Printables Section", type: "activitiesPrintablesSection", id: "activitiesPrintablesSection" },
] as const;

/**
 * Document types to exclude from the automatic catch-all list
 * - Singletons are handled explicitly above
 * - pageSettings is intentionally excluded from the sidebar
 * - Regular document types are explicitly listed above, so exclude them from catch-all
 */
const EXCLUDED_FROM_AUTO_LIST = new Set([
  ...SINGLETONS.map((s) => s.type),
  "pageSettings",
  // Regular document types (already explicitly listed in structure)
  "article",
  "activity",
  "printable",
  "recipe",
  "category",
  "ageGroup",
  "tag",
  "author",
  "curatedCollection",
  "qaItem",
]);

/**
 * Custom desk structure for Sanity Studio
 * 
 * This structure:
 * - Organizes content types into logical groups
 * - Uses S.editor() for singleton documents (single document editor)
 * - Uses S.documentTypeList() for multi-document types (list view)
 * - Includes a catch-all to automatically show new document types
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Content Documents
      S.listItem()
        .title("Articles")
        .schemaType("article")
        .child(S.documentTypeList("article").title("Articles")),
      S.listItem()
        .title("Activities")
        .schemaType("activity")
        .child(S.documentTypeList("activity").title("Activities")),
      S.listItem()
        .title("Printables")
        .schemaType("printable")
        .child(S.documentTypeList("printable").title("Printables")),
      S.listItem()
        .title("Recipes")
        .schemaType("recipe")
        .child(S.documentTypeList("recipe").title("Recipes")),

      S.divider(),

      // Taxonomy
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),
      S.listItem()
        .title("Age Groups")
        .schemaType("ageGroup")
        .child(S.documentTypeList("ageGroup").title("Age Groups")),
      S.listItem()
        .title("Tags")
        .schemaType("tag")
        .child(S.documentTypeList("tag").title("Tags")),
      S.listItem()
        .title("Authors")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors")),
      S.listItem()
        .title("Curated Collections")
        .schemaType("curatedCollection")
        .child(S.documentTypeList("curatedCollection").title("Curated Collections")),

      S.divider(),

      // Q&A
      S.listItem()
        .title("Q&A Items")
        .schemaType("qaItem")
        .child(S.documentTypeList("qaItem").title("Q&A Items")),

      S.divider(),

      // Singletons: Use S.editor() for single document editor with fixed documentId
      ...SINGLETONS.map((s) =>
        S.listItem()
          .id(s.id)
          .title(s.title)
          .schemaType(s.type)
          .child(
            S.editor()
              .id(s.id)
              .schemaType(s.type)
              .documentId(s.id)
          )
      ),

      S.divider(),

      // Catch-all: Automatically include any new document types not explicitly listed above
      // This ensures new schema types appear in the sidebar without manual updates
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return id ? !EXCLUDED_FROM_AUTO_LIST.has(id) : true;
      }),
    ]);

