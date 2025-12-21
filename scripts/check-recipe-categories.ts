import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2024-03-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function checkRecipes() {
  const recipes = await client.fetch(`*[_type == 'recipe' && !(_id in path('drafts.**'))]{
    _id,
    title,
    "category": category-> { _id, title, "slug": slug.current }
  }`);

  console.log('Recipes and their categories:');
  recipes.forEach((r: any) => {
    console.log(`- ${r.title}: ${r.category?.title || 'NO CATEGORY'} (${r.category?.slug || 'none'})`);
  });
}

checkRecipes();

