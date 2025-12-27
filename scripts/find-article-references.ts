/**
 * Script to find all references to a specific content item (article, activity, printable, recipe) in Sanity
 * 
 * Usage: tsx scripts/find-article-references.ts <document-id> [type]
 * 
 * Examples:
 *   tsx scripts/find-article-references.ts 6sR35j6mIdEYpnSKTOp5ia article
 *   tsx scripts/find-article-references.ts abc123 activity
 * 
 * This helps identify where a document is referenced so you can remove
 * or update those references before deletion.
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error("Missing Sanity credentials. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

async function findArticleReferences(documentId: string, docType?: string) {
  const type = docType || "article";
  console.log(`\n🔍 Searching for references to ${type}: ${documentId}\n`);

  const references: Array<{ type: string; id: string; title: string; field: string }> = [];

  // Check Featured Content Section
  const featuredContent = await client.fetch(
    `*[_type == "featuredContentSection" && references($documentId)]{
      _id,
      _type,
      title,
      "references": contentItems[references($documentId)]{
        contentType,
        article,
        activity,
        printable,
        recipe
      }
    }`,
    { documentId }
  );

  if (featuredContent.length > 0) {
    featuredContent.forEach((doc: any) => {
      doc.references?.forEach((ref: any) => {
        const refId = ref.article?._ref || ref.activity?._ref || ref.printable?._ref || ref.recipe?._ref;
        if (refId === documentId) {
          references.push({
            type: "featuredContentSection",
            id: doc._id,
            title: doc.title || "Featured Content Section",
            field: `contentItems[${ref.contentType}]`,
          });
        }
      });
    });
  }

  // Check For Parents Section (only for articles)
  if (type === "article") {
    const forParents = await client.fetch(
      `*[_type == "forParentsSection" && references($documentId)]{
        _id,
        _type,
        title,
        "articleRefs": articles[references($documentId)]
      }`,
      { documentId }
    );

    if (forParents.length > 0) {
      forParents.forEach((doc: any) => {
        references.push({
          type: "forParentsSection",
          id: doc._id,
          title: doc.title || "For Parents Section",
          field: "articles[]",
        });
      });
    }
  }

  // Check Activities & Printables Section (for activities and printables)
  if (type === "activity" || type === "printable") {
    const activitiesPrintables = await client.fetch(
      `*[_type == "activitiesPrintablesSection" && references($documentId)]{
        _id,
        _type,
        title,
        "references": contentItems[references($documentId)]{
          contentType,
          activity,
          printable
        }
      }`,
      { documentId }
    );

    if (activitiesPrintables.length > 0) {
      activitiesPrintables.forEach((doc: any) => {
        doc.references?.forEach((ref: any) => {
          const refId = ref.activity?._ref || ref.printable?._ref;
          if (refId === documentId) {
            references.push({
              type: "activitiesPrintablesSection",
              id: doc._id,
              title: doc.title || "Activities & Printables Section",
              field: `contentItems[${ref.contentType}]`,
            });
          }
        });
      });
    }
  }

  // Check Curated Collections
  const curatedCollections = await client.fetch(
    `*[_type == "curatedCollection" && references($documentId)]{
      _id,
      _type,
      title,
      placement
    }`,
    { documentId }
  );

  if (curatedCollections.length > 0) {
    curatedCollections.forEach((doc: any) => {
      references.push({
        type: "curatedCollection",
        id: doc._id,
        title: `${doc.title} (${doc.placement})`,
        field: "items[]",
      });
    });
  }

  // Check Page Settings (for articles, activities, recipes)
  if (type === "article" || type === "activity" || type === "recipe") {
    const pageSettings = await client.fetch(
      `*[_type == "pageSettings" && references($documentId)]{
        _id,
        _type,
        "hasRef": forParents.featuredContentRefs[references($documentId)]
      }`,
      { documentId }
    );

    if (pageSettings.length > 0) {
      pageSettings.forEach((doc: any) => {
        references.push({
          type: "pageSettings",
          id: doc._id,
          title: "Page Settings",
          field: "forParents.featuredContentRefs[]",
        });
      });
    }
  }

  // Check Related Content in other articles
  const relatedInArticles = await client.fetch(
    `*[_type == "article" && _id != $documentId && references($documentId)]{
      _id,
      _type,
      title,
      "hasRef": relatedContent[references($documentId)]
    }`,
    { documentId }
  );

  if (relatedInArticles.length > 0) {
    relatedInArticles.forEach((doc: any) => {
      references.push({
        type: "article",
        id: doc._id,
        title: doc.title,
        field: "relatedContent[]",
      });
    });
  }

  // Check Related Content in activities
  const relatedInActivities = await client.fetch(
    `*[_type == "activity" && references($documentId)]{
      _id,
      _type,
      title,
      "hasRef": relatedContent[references($documentId)]
    }`,
    { documentId }
  );

  if (relatedInActivities.length > 0) {
    relatedInActivities.forEach((doc: any) => {
      references.push({
        type: "activity",
        id: doc._id,
        title: doc.title,
        field: "relatedContent[]",
      });
    });
  }

  // Check Related Content in recipes
  const relatedInRecipes = await client.fetch(
    `*[_type == "recipe" && references($documentId)]{
      _id,
      _type,
      title,
      "hasRef": relatedContent[references($documentId)]
    }`,
    { documentId }
  );

  if (relatedInRecipes.length > 0) {
    relatedInRecipes.forEach((doc: any) => {
      references.push({
        type: "recipe",
        id: doc._id,
        title: doc.title,
        field: "relatedContent[]",
      });
    });
  }

  // Check Related Content in printables
  const relatedInPrintables = await client.fetch(
    `*[_type == "printable" && references($documentId)]{
      _id,
      _type,
      title,
      "hasRef": relatedContent[references($documentId)]
    }`,
    { documentId }
  );

  if (relatedInPrintables.length > 0) {
    relatedInPrintables.forEach((doc: any) => {
      references.push({
        type: "printable",
        id: doc._id,
        title: doc.title,
        field: "relatedContent[]",
      });
    });
  }

  // Also check drafts
  const allDrafts = await client.fetch(
    `*[(_id in path("drafts.**")) && references($documentId)]{
      _id,
      _type,
      title
    }`,
    { documentId }
  );

  if (allDrafts.length > 0) {
    console.log("⚠️  Found references in DRAFT documents:");
    allDrafts.forEach((doc: any) => {
      console.log(`   - ${doc._type}: ${doc.title || doc._id} (DRAFT)`);
    });
    console.log("\n   You need to delete or publish these drafts first!\n");
  }

  // Display results
  if (references.length === 0 && allDrafts.length === 0) {
    console.log(`✅ No references found! The ${type} should be safe to delete.`);
    console.log("\nIf deletion still fails, try:");
    console.log("1. Restart your Next.js dev server");
    console.log("2. Hard refresh Sanity Studio (Ctrl+Shift+R or Cmd+Shift+R)");
    console.log("3. Check if there are any unpublished changes");
  } else {
    console.log(`❌ Found ${references.length} reference(s):\n`);
    references.forEach((ref, index) => {
      console.log(`${index + 1}. ${ref.type}: "${ref.title}"`);
      console.log(`   Document ID: ${ref.id}`);
      console.log(`   Field: ${ref.field}`);
      console.log(`   Action: Open this document in Studio and remove the reference\n`);
    });

    console.log("\n📝 To fix:");
    console.log("1. Open each document listed above in Sanity Studio");
    console.log(`2. Remove the ${type} from the specified field`);
    console.log("3. Save/Publish the document");
    console.log(`4. Try deleting the ${type} again`);
    console.log("\n💡 Tip: If you see 'Reference strength mismatch' warnings,");
    console.log("   re-save those documents to convert strong references to weak ones.");
  }
}

// Get document ID and type from command line
const documentId = process.argv[2];
const docType = process.argv[3];

if (!documentId) {
  console.error("Usage: tsx scripts/find-article-references.ts <document-id> [type]");
  console.error("\nExamples:");
  console.error("  tsx scripts/find-article-references.ts 6sR35j6mIdEYpnSKTOp5ia article");
  console.error("  tsx scripts/find-article-references.ts abc123 activity");
  console.error("  tsx scripts/find-article-references.ts xyz789 printable");
  process.exit(1);
}

findArticleReferences(documentId, docType).catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

