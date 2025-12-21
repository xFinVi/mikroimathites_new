/**
 * Test Curated Collection Script
 * 
 * This script tests if a curated collection can be fetched and shows what items it contains.
 * 
 * Run with: npx tsx scripts/test-curated-collection.ts
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

if (!projectId || !dataset) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

async function testCuratedCollection() {
  console.log("🔍 Testing Curated Collection...\n");

  try {
    // Test both placement values
    const placements = ["quick-tips", "parentsPageQuickTips"];
    
    for (const placement of placements) {
      console.log(`\n📋 Testing placement: "${placement}"`);
      
      const query = `*[_type == "curatedCollection" && placement == $placement && !(_id in path("drafts.**"))]|order(order asc, publishedAt desc)[0]{
        _id,
        title,
        placement,
        "slug": slug.current,
        description,
        "items": items[]-> {
          _type,
          _id,
          title,
          "slug": slug.current,
          "isDraft": _id in path("drafts.**"),
          "hasSlug": defined(slug.current)
        }
      }`;
      
      const collection = await client.fetch(query, { placement });
      
      if (collection) {
        console.log(`✅ Found collection: "${collection.title}"`);
        console.log(`   ID: ${collection._id}`);
        console.log(`   Placement: ${collection.placement}`);
        console.log(`   Total items: ${collection.items?.length || 0}`);
        
        if (collection.items && collection.items.length > 0) {
          console.log(`\n   Items:`);
          collection.items.forEach((item: any, idx: number) => {
            console.log(`   ${idx + 1}. ${item.title || 'NO TITLE'}`);
            console.log(`      Type: ${item._type}`);
            console.log(`      ID: ${item._id}`);
            console.log(`      Slug: ${item.slug || 'NO SLUG ❌'}`);
            console.log(`      Is Draft: ${item.isDraft ? 'YES ❌' : 'NO ✅'}`);
            console.log(`      Has Slug: ${item.hasSlug ? 'YES ✅' : 'NO ❌'}`);
            console.log(`      Will be shown: ${!item.isDraft && item.hasSlug ? 'YES ✅' : 'NO ❌'}`);
            console.log(``);
          });
          
          const validItems = collection.items.filter((item: any) => !item.isDraft && item.hasSlug);
          console.log(`   Valid items (will be shown): ${validItems.length}`);
        } else {
          console.log(`   ⚠️  No items found in collection`);
        }
      } else {
        console.log(`   ❌ No collection found with placement "${placement}"`);
      }
    }
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testCuratedCollection();

