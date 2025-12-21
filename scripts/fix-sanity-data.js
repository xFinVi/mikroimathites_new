/**
 * Script to fix common Sanity data issues:
 * 1. Add missing _key properties to array items (ageGroups, tags)
 * 2. Ensure all items have slugs
 * 3. Set featured flags on some items
 * 4. Fix any data type mismatches
 */

const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_API_VERSION || "2024-01-01",
});

async function fixArticleData() {
  console.log("🔍 Fetching articles...");
  const articles = await client.fetch(`*[_type == "article"]`);
  console.log(`Found ${articles.length} articles`);

  for (const article of articles) {
    const updates = {};
    let needsUpdate = false;

    // Fix ageGroups array - add _key if missing
    if (article.ageGroups && Array.isArray(article.ageGroups)) {
      const fixedAgeGroups = article.ageGroups.map((ag, idx) => {
        if (!ag._key && ag._ref) {
          needsUpdate = true;
          return { _key: `ageGroup-${idx}`, _type: "reference", _ref: ag._ref };
        }
        return ag;
      });
      if (needsUpdate) {
        updates.ageGroups = fixedAgeGroups;
      }
    }

    // Fix tags array - add _key if missing
    if (article.tags && Array.isArray(article.tags)) {
      const fixedTags = article.tags.map((tag, idx) => {
        if (!tag._key && tag._ref) {
          needsUpdate = true;
          return { _key: `tag-${idx}`, _type: "reference", _ref: tag._ref };
        }
        return tag;
      });
      if (needsUpdate) {
        updates.tags = fixedTags;
      }
    }

    // Fix slug - convert string to slug object if needed
    if (typeof article.slug === 'string') {
      // Slug is stored as string, need to convert to slug object
      updates.slug = {
        _type: "slug",
        current: article.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${article.title}`);
    } else if (!article.slug || !article.slug.current) {
      console.log(`⚠️  Article "${article.title}" missing slug - skipping`);
      continue;
    }

    // Set featured flag on first 10 articles if not set
    if (article.featured === undefined && articles.indexOf(article) < 10) {
      updates.featured = true;
      needsUpdate = true;
    }

    if (needsUpdate || Object.keys(updates).length > 0) {
      console.log(`📝 Updating article: ${article.title}`);
      await client.patch(article._id).set(updates).commit();
    }
  }

  console.log("✅ Articles fixed!");
}

async function fixActivityData() {
  console.log("🔍 Fetching activities...");
  const activities = await client.fetch(`*[_type == "activity"]`);
  console.log(`Found ${activities.length} activities`);

  for (const activity of activities) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof activity.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: activity.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${activity.title}`);
    } else if (!activity.slug || !activity.slug.current) {
      console.log(`⚠️  Activity "${activity.title}" missing slug - skipping`);
      continue;
    }

    // Fix ageGroups array
    if (activity.ageGroups && Array.isArray(activity.ageGroups)) {
      const fixedAgeGroups = activity.ageGroups.map((ag, idx) => {
        if (!ag._key && ag._ref) {
          needsUpdate = true;
          return { _key: `ageGroup-${idx}`, _type: "reference", _ref: ag._ref };
        }
        return ag;
      });
      if (needsUpdate) {
        updates.ageGroups = fixedAgeGroups;
      }
    }

    // Fix tags array
    if (activity.tags && Array.isArray(activity.tags)) {
      const fixedTags = activity.tags.map((tag, idx) => {
        if (!tag._key && tag._ref) {
          needsUpdate = true;
          return { _key: `tag-${idx}`, _type: "reference", _ref: tag._ref };
        }
        return tag;
      });
      if (needsUpdate) {
        updates.tags = fixedTags;
      }
    }

    // Set featured flag on first 10 activities if not set
    if (activity.featured === undefined && activities.indexOf(activity) < 10) {
      updates.featured = true;
      needsUpdate = true;
    }

    if (needsUpdate || Object.keys(updates).length > 0) {
      console.log(`📝 Updating activity: ${activity.title}`);
      await client.patch(activity._id).set(updates).commit();
    }
  }

  console.log("✅ Activities fixed!");
}

async function fixPrintableData() {
  console.log("🔍 Fetching printables...");
  const printables = await client.fetch(`*[_type == "printable"]`);
  console.log(`Found ${printables.length} printables`);

  for (const printable of printables) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof printable.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: printable.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${printable.title}`);
    } else if (!printable.slug || !printable.slug.current) {
      console.log(`⚠️  Printable "${printable.title}" missing slug - skipping`);
      continue;
    }

    // Fix ageGroups array
    if (printable.ageGroups && Array.isArray(printable.ageGroups)) {
      const fixedAgeGroups = printable.ageGroups.map((ag, idx) => {
        if (!ag._key && ag._ref) {
          needsUpdate = true;
          return { _key: `ageGroup-${idx}`, _type: "reference", _ref: ag._ref };
        }
        return ag;
      });
      if (needsUpdate) {
        updates.ageGroups = fixedAgeGroups;
      }
    }

    // Set featured flag on first 10 printables if not set
    if (printable.featured === undefined && printables.indexOf(printable) < 10) {
      updates.featured = true;
      needsUpdate = true;
    }

    if (needsUpdate || Object.keys(updates).length > 0) {
      console.log(`📝 Updating printable: ${printable.title}`);
      await client.patch(printable._id).set(updates).commit();
    }
  }

  console.log("✅ Printables fixed!");
}

async function fixRecipeData() {
  console.log("🔍 Fetching recipes...");
  const recipes = await client.fetch(`*[_type == "recipe"]`);
  console.log(`Found ${recipes.length} recipes`);

  for (const recipe of recipes) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof recipe.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: recipe.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${recipe.title}`);
    } else if (!recipe.slug || !recipe.slug.current) {
      console.log(`⚠️  Recipe "${recipe.title}" missing slug - skipping`);
      continue;
    }

    // Fix ageGroups array
    if (recipe.ageGroups && Array.isArray(recipe.ageGroups)) {
      const fixedAgeGroups = recipe.ageGroups.map((ag, idx) => {
        if (!ag._key && ag._ref) {
          needsUpdate = true;
          return { _key: `ageGroup-${idx}`, _type: "reference", _ref: ag._ref };
        }
        return ag;
      });
      if (needsUpdate) {
        updates.ageGroups = fixedAgeGroups;
      }
    }

    // Set featured flag on first 10 recipes if not set
    if (recipe.featured === undefined && recipes.indexOf(recipe) < 10) {
      updates.featured = true;
      needsUpdate = true;
    }

    if (needsUpdate || Object.keys(updates).length > 0) {
      console.log(`📝 Updating recipe: ${recipe.title}`);
      await client.patch(recipe._id).set(updates).commit();
    }
  }

  console.log("✅ Recipes fixed!");
}

async function fixCategoryData() {
  console.log("🔍 Fetching categories...");
  const categories = await client.fetch(`*[_type == "category"]`);
  console.log(`Found ${categories.length} categories`);

  for (const category of categories) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof category.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: category.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${category.title}`);
    }

    if (needsUpdate) {
      console.log(`📝 Updating category: ${category.title}`);
      await client.patch(category._id).set(updates).commit();
    }
  }

  console.log("✅ Categories fixed!");
}

async function fixAgeGroupData() {
  console.log("🔍 Fetching age groups...");
  const ageGroups = await client.fetch(`*[_type == "ageGroup"]`);
  console.log(`Found ${ageGroups.length} age groups`);

  for (const ageGroup of ageGroups) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof ageGroup.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: ageGroup.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${ageGroup.title}`);
    }

    if (needsUpdate) {
      console.log(`📝 Updating age group: ${ageGroup.title}`);
      await client.patch(ageGroup._id).set(updates).commit();
    }
  }

  console.log("✅ Age groups fixed!");
}

async function fixTagData() {
  console.log("🔍 Fetching tags...");
  const tags = await client.fetch(`*[_type == "tag"]`);
  console.log(`Found ${tags.length} tags`);

  for (const tag of tags) {
    const updates = {};
    let needsUpdate = false;

    // Fix slug - convert string to slug object if needed
    if (typeof tag.slug === 'string') {
      updates.slug = {
        _type: "slug",
        current: tag.slug
      };
      needsUpdate = true;
      console.log(`🔧 Converting slug from string to object for: ${tag.title}`);
    }

    if (needsUpdate) {
      console.log(`📝 Updating tag: ${tag.title}`);
      await client.patch(tag._id).set(updates).commit();
    }
  }

  console.log("✅ Tags fixed!");
}

async function main() {
  console.log("🚀 Starting Sanity data fix...\n");

  try {
    await fixArticleData();
    console.log("");
    await fixActivityData();
    console.log("");
    await fixPrintableData();
    console.log("");
    await fixRecipeData();
    console.log("");
    await fixCategoryData();
    console.log("");
    await fixAgeGroupData();
    console.log("");
    await fixTagData();
    console.log("\n✅ All data fixed successfully!");
  } catch (error) {
    console.error("❌ Error fixing data:", error);
    process.exit(1);
  }
}

main();

