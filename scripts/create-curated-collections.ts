/**
 * Create Curated Collections Script
 * 
 * This script creates Curated Collections for the Mikroi Mathites app.
 * It can create collections for different placements like "quick-tips".
 * 
 * Run with: npx tsx scripts/create-curated-collections.ts
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

if (!projectId || !dataset || !token) {
  console.error("❌ Missing required environment variables:");
  console.error("   - SANITY_PROJECT_ID:", projectId ? "✅" : "❌");
  console.error("   - SANITY_DATASET:", dataset ? "✅" : "❌");
  console.error("   - SANITY_TOKEN:", token ? "✅" : "❌");
  console.error("\nPlease set these in your .env.local file");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

// Helper function to create documents
async function createDocument(type: string, doc: any) {
  try {
    const result = await client.create({
      _type: type,
      ...doc,
    });
    console.log(`✅ Created ${type}: ${doc.title || "Untitled"}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Error creating ${type}:`, error.message);
    throw error;
  }
}

// Helper to check if document exists
async function documentExists(type: string, slug: string) {
  const query = `*[_type == "${type}" && slug.current == "${slug}"][0]._id`;
  const id = await client.fetch(query);
  return id;
}

// Helper to find documents by type and optionally by category/age group
async function findDocuments(
  type: "article" | "activity" | "recipe" | "printable",
  limit: number = 10
) {
  const query = `*[_type == "${type}" && defined(slug.current) && !(_id in path("drafts.**"))]|order(publishedAt desc)[0...${limit}]{_id, title, "slug": slug.current}`;
  return await client.fetch(query);
}

// Helper to create reference with key for array items
function createReference(id: string, index: number) {
  return { 
    _type: "reference", 
    _ref: id,
    _key: `item-${index}-${Date.now()}`
  };
}

async function createCuratedCollections() {
  console.log("🎯 Starting to create Curated Collections...\n");

  try {
    // 1. Create Quick Tips Collection
    console.log("📋 Creating Quick Tips Collection...");
    
    // Check if it already exists and delete it first
    const existingQuickTips = await client.fetch(
      `*[_type == "curatedCollection" && (placement == "quick-tips" || placement == "parentsPageQuickTips")][0]`
    );

    if (existingQuickTips) {
      console.log(`🗑️  Found existing Quick Tips collection, deleting it first...`);
      console.log(`   Title: ${existingQuickTips.title}`);
      console.log(`   Items: ${existingQuickTips.items?.length || 0}`);
      try {
        await client.delete(existingQuickTips._id);
        console.log(`   ✅ Deleted existing collection`);
      } catch (error: any) {
        console.log(`   ⚠️  Could not delete: ${error.message}`);
        console.log(`   Continuing anyway...`);
      }
    }

    {
      // Find some existing content to add
      console.log("   Finding existing content to add...");
      
      const [articles, activities, recipes] = await Promise.all([
        findDocuments("article", 4),
        findDocuments("activity", 2),
        findDocuments("recipe", 2),
      ]);

      const allItems = [...articles, ...activities, ...recipes].slice(0, 4);
      
      if (allItems.length === 0) {
        console.log("   ⚠️  No content found. Please create some articles/activities/recipes first.");
        console.log("   You can run: npx tsx scripts/seed-sample-data.ts");
        return;
      }

      console.log(`   Found ${allItems.length} items to add:`);
      allItems.forEach((item: any, idx: number) => {
        console.log(`      ${idx + 1}. ${item.title}`);
      });

      // Verify all referenced documents exist and are published
      console.log("   Verifying referenced documents...");
      const verifiedItems = [];
      for (const item of allItems) {
        const doc = await client.fetch(`*[_id == "${item._id}" && !(_id in path("drafts.**"))][0]{_id, _type, title, "slug": slug.current}`);
        if (doc && doc.slug) {
          verifiedItems.push(doc);
          console.log(`      ✓ ${doc.title} (${doc._type})`);
        } else {
          console.log(`      ✗ ${item.title} - not found or not published, skipping...`);
        }
      }

      if (verifiedItems.length === 0) {
        console.log("   ⚠️  No valid published documents found. Please publish some articles/activities/recipes first.");
        return;
      }

      const quickTipsCollection = await createDocument("curatedCollection", {
        title: "Γρήγορες λύσεις (5')",
        slug: { current: "grhgores-lyseis-5" },
        description: "Γρήγορες και πρακτικές συμβουλές για γονείς - 5 λεπτά για κάθε λύση",
        placement: "quick-tips",
        items: verifiedItems.map((item: any, idx: number) => createReference(item._id, idx)),
        order: 0,
        publishedAt: new Date().toISOString(),
      });

      console.log(`✅ Created Quick Tips collection with ${allItems.length} items`);
    }

    // 2. Optionally create other collections
    console.log("\n📋 You can create more collections manually in Sanity Studio:");
    console.log("   - Home Featured");
    console.log("   - Parents Page Top");
    console.log("   - Activities Page Featured");
    console.log("   - Category-specific Start Here collections");

    console.log("\n✅ Curated Collections setup completed!");
    console.log("\n📝 Next steps:");
    console.log("   1. Visit http://localhost:3000/studio to manage your collections");
    console.log("   2. Edit the Quick Tips collection to add/remove items");
    console.log("   3. Create more collections as needed!");

  } catch (error: any) {
    console.error("\n❌ Error creating curated collections:", error.message);
    if (error.details) {
      console.error("   Details:", error.details);
    }
    process.exit(1);
  }
}

// Run the function
createCuratedCollections();

