/**
 * Seed Sample Data Script
 * 
 * This script creates sample content for the Mikroi Mathites app:
 * - Age Groups
 * - Categories
 * - Tags
 * - Authors
 * - Activities
 * - Recipes
 * - Articles
 * - Printables
 * - Page Settings
 * - Q&A Items
 * 
 * Run with: npx tsx scripts/seed-sample-data.ts
 */

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
    console.log(`✅ Created ${type}: ${doc.title || doc.name || doc.question || "Untitled"}`);
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

async function seedData() {
  console.log("🌱 Starting to seed sample data...\n");

  try {
    // 1. Create Age Groups
    console.log("📋 Creating Age Groups...");
    const ageGroups = [
      { title: "0-2 έτη", slug: "0-2-eti", order: 1, description: "Βρέφη και νήπια" },
      { title: "2-4 έτη", slug: "2-4-eti", order: 2, description: "Προσχολική ηλικία" },
      { title: "4-6 έτη", slug: "4-6-eti", order: 3, description: "Πρώτα σχολικά χρόνια" },
      { title: "Εξωτερικό", slug: "exoteriko", order: 4, description: "Ελληνόπουλα στο εξωτερικό" },
    ];

    const ageGroupRefs: any[] = [];
    for (const ag of ageGroups) {
      const exists = await documentExists("ageGroup", ag.slug);
      if (exists) {
        console.log(`⏭️  Age Group "${ag.title}" already exists, skipping...`);
        const existing = await client.fetch(`*[_type == "ageGroup" && slug.current == "${ag.slug}"][0]`);
        ageGroupRefs.push({ _type: "reference", _ref: existing._id });
      } else {
        const created = await createDocument("ageGroup", {
          title: ag.title,
          slug: { current: ag.slug },
          order: ag.order,
          description: ag.description,
        });
        ageGroupRefs.push({ _type: "reference", _ref: created._id });
      }
    }

    // 2. Create Categories
    console.log("\n📚 Creating Categories...");
    const categories = [
      { title: "Ύπνος & Ρουτίνες", slug: "ypnos-routimes", order: 1, description: "Συμβουλές για ύπνο και καθημερινές ρουτίνες" },
      { title: "Ομιλία & Λεξιλόγιο", slug: "omilia-lexilogo", order: 2, description: "Ανάπτυξη γλώσσας και λεξιλογίου" },
      { title: "Διατροφή & Επιλογές", slug: "diatrofi-epiloges", order: 3, description: "Υγιεινή διατροφή και επιλογές" },
      { title: "Φυσικές Συνταγές", slug: "fysikes-syntages", order: 4, description: "Φυσικές και υγιεινές συνταγές" },
      { title: "Τέχνες & Χειροτεχνίες", slug: "texnes-xirotexnies", order: 5, description: "Δημιουργικές δραστηριότητες" },
      { title: "Ανάπτυξη", slug: "anaptyxi", order: 6, description: "Ανάπτυξη και μάθηση" },
      { title: "Ελληνικό Εξωτερικό", slug: "elliniko-exoteriko", order: 7, description: "Για ελληνικά παιδιά στο εξωτερικό" },
      { title: "Ιδέες Παιχνιδιού", slug: "idees-paixnidiou", order: 8, description: "Παιχνίδια και διασκέδαση" },
    ];

    const categoryRefs: any = {};
    for (const cat of categories) {
      const exists = await documentExists("category", cat.slug);
      if (exists) {
        console.log(`⏭️  Category "${cat.title}" already exists, skipping...`);
        const existing = await client.fetch(`*[_type == "category" && slug.current == "${cat.slug}"][0]`);
        categoryRefs[cat.slug] = { _type: "reference", _ref: existing._id };
      } else {
        const created = await createDocument("category", {
          title: cat.title,
          slug: { current: cat.slug },
          order: cat.order,
          description: cat.description,
        });
        categoryRefs[cat.slug] = { _type: "reference", _ref: created._id };
      }
    }

    // 3. Create Tags
    console.log("\n🏷️  Creating Tags...");
    const tags = [
      { title: "αισθητηριακό παιχνίδι", slug: "aisthitiriako-paixnidi" },
      { title: "γρήγορη δραστηριότητα", slug: "grigori-drastiriotita" },
      { title: "εκτός σπιτιού", slug: "ektos-spitiou" },
      { title: "χειροποίητο", slug: "xiropoiito" },
      { title: "μαγειρική", slug: "mageiriki" },
      { title: "φυσικό", slug: "fysiko" },
      { title: "εύκολο", slug: "efkolo" },
    ];

    const tagRefs: any[] = [];
    for (const tag of tags) {
      const exists = await documentExists("tag", tag.slug);
      if (exists) {
        console.log(`⏭️  Tag "${tag.title}" already exists, skipping...`);
        const existing = await client.fetch(`*[_type == "tag" && slug.current == "${tag.slug}"][0]`);
        tagRefs.push({ _type: "reference", _ref: existing._id });
      } else {
        const created = await createDocument("tag", {
          title: tag.title,
          slug: { current: tag.slug },
        });
        tagRefs.push({ _type: "reference", _ref: created._id });
      }
    }

    // 4. Create Author
    console.log("\n👤 Creating Author...");
    let authorRef;
    const authorExists = await documentExists("author", "mikroi-mathites-team");
    if (authorExists) {
      console.log(`⏭️  Author already exists, skipping...`);
      const existing = await client.fetch(`*[_type == "author" && slug.current == "mikroi-mathites-team"][0]`);
      authorRef = { _type: "reference", _ref: existing._id };
    } else {
      const author = await createDocument("author", {
        name: "Ομάδα Μικροί Μαθητές",
        slug: { current: "mikroi-mathites-team" },
        bio: "Η ομάδα των Μικρών Μαθητών - Ειδικοί στην ανάπτυξη και ανατροφή παιδιών 0-6 ετών",
        role: "expert",
      });
      authorRef = { _type: "reference", _ref: author._id };
    }

    // 5. Create Activities
    console.log("\n🎨 Creating Activities...");
    const activities = [
      {
        title: "Χρωματιστό Παιχνίδι με Ρύζι",
        slug: "xromatisto-paixnidi-me-ryzi",
        summary: "Διασκεδαστικό αισθητηριακό παιχνίδι με χρωματιστό ρύζι για μικρά παιδιά",
        duration: "10-15 λεπτά",
        materials: ["Ρύζι", "Χρώματα τροφίμων", "Πλαστικό δοχείο", "Κουτάλια"],
        goals: ["Αισθητηριακή εξερεύνηση", "Χρωματική αναγνώριση", "Λεπτή κινητικότητα"],
        steps: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βάλτε ρύζι σε ένα δοχείο.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Προσθέστε λίγο χρώμα τροφίμων και ανακατέψτε.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Αφήστε το παιδί να εξερευνήσει το χρωματιστό ρύζι με τα χέρια του.",
              },
            ],
          },
        ],
        category: categoryRefs["texnes-xirotexnies"],
        ageGroups: [ageGroupRefs[1]], // 2-4 έτη
        tags: [tagRefs[0], tagRefs[1]], // αισθητηριακό, γρήγορη
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Παιχνίδι με Νερό",
        slug: "paixnidi-me-nero",
        summary: "Απλό και διασκεδαστικό παιχνίδι με νερό για καλοκαιρινές μέρες",
        duration: "15-20 λεπτά",
        materials: ["Νερό", "Πλαστικά μπολ", "Κουτάλια", "Σφουγγάρια"],
        goals: ["Αισθητηριακή εξερεύνηση", "Συντονισμός"],
        steps: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Γεμίστε μπολ με νερό.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Αφήστε το παιδί να παίξει με το νερό, να μεταφέρει νερό από το ένα μπολ στο άλλο.",
              },
            ],
          },
        ],
        category: categoryRefs["idees-paixnidiou"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[1], tagRefs[2]], // γρήγορη, εκτός σπιτιού
        publishedAt: new Date().toISOString(),
        featured: false,
      },
    ];

    for (const activity of activities) {
      const exists = await documentExists("activity", activity.slug);
      if (!exists) {
        await createDocument("activity", activity);
      } else {
        console.log(`⏭️  Activity "${activity.title}" already exists, skipping...`);
      }
    }

    // 6. Create Recipes
    console.log("\n🍳 Creating Recipes...");
    const recipes = [
      {
        title: "Μπανάνα με Μέλι",
        slug: "mpanana-me-meli",
        summary: "Απλή και υγιεινή συνταγή για μικρά παιδιά",
        difficulty: "easy",
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        ingredients: [
          { name: "Μπανάνα", amount: "1", notes: "ώριμη" },
          { name: "Μέλι", amount: "1 κουταλιά", notes: "φυσικό" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Κόψτε τη μπανάνα σε φέτες.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Προσθέστε το μέλι πάνω.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Σερβίρετε αμέσως.",
              },
            ],
          },
        ],
        tips: ["Χρησιμοποιήστε ώριμη μπανάνα για καλύτερη γεύση"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[0]], // 0-2 έτη
        tags: [tagRefs[4], tagRefs[5], tagRefs[6]], // μαγειρική, φυσικό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: true,
      },
    ];

    for (const recipe of recipes) {
      const exists = await documentExists("recipe", recipe.slug);
      if (!exists) {
        await createDocument("recipe", recipe);
      } else {
        console.log(`⏭️  Recipe "${recipe.title}" already exists, skipping...`);
      }
    }

    // 7. Create Articles
    console.log("\n📄 Creating Articles...");
    const articles = [
      {
        title: "10 Συμβουλές για Ήρεμο Ύπνο",
        slug: "10-symvoules-gia-iremo-ypno",
        excerpt: "Πρακτικές συμβουλές για να βοηθήσετε το παιδί σας να κοιμηθεί ήρεμα και βαθιά",
        body: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Η ρουτίνα ύπνου είναι σημαντική για την ανάπτυξη του παιδιού. Εδώ είναι 10 συμβουλές:",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "1. Δημιουργήστε μια συνεπή ρουτίνα πριν τον ύπνο",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "2. Κρατήστε το δωμάτιο σκοτεινό και ήσυχο",
              },
            ],
          },
        ],
        readingTime: 5,
        category: categoryRefs["ypnos-routimes"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[6]], // εύκολο
        author: authorRef,
        publishedAt: new Date().toISOString(),
        featured: true,
      },
    ];

    for (const article of articles) {
      const exists = await documentExists("article", article.slug);
      if (!exists) {
        await createDocument("article", article);
      } else {
        console.log(`⏭️  Article "${article.title}" already exists, skipping...`);
      }
    }

    // 8. Create Page Settings (Singleton)
    console.log("\n⚙️  Creating Page Settings...");
    const pageSettingsExists = await client.fetch(`*[_type == "pageSettings"][0]._id`);
    if (!pageSettingsExists) {
      await createDocument("pageSettings", {
        home: {
          hero: {
            type: "image",
            content: {
              title: "Καλώς ήρθατε στους Μικρούς Μαθητές",
              subtitle: "Parent Hub για παιδιά 0-6 ετών",
              alignment: "left",
            },
          },
          seasonalBanner: {
            enabled: false,
          },
        },
        forParents: {
          hero: {
            type: "image",
            content: {
              title: "Για Γονείς",
              subtitle: "Σύντομες συμβουλές & πρακτικές ιδέες",
              alignment: "left",
            },
          },
        },
        site: {
          navLinks: [
            { label: "Αρχική", url: "/" },
            { label: "Για Γονείς", url: "/gia-goneis" },
            { label: "Δραστηριότητες", url: "/drastiriotites" },
          ],
        },
      });
    } else {
      console.log(`⏭️  Page Settings already exists, skipping...`);
    }

    // 9. Create Q&A Items
    console.log("\n❓ Creating Q&A Items...");
    const qaItems = [
      {
        question: "Πόσες ώρες ύπνου χρειάζεται ένα βρέφος;",
        answer: "Τα βρέφη 0-3 μηνών χρειάζονται περίπου 14-17 ώρες ύπνου την ημέρα, ενώ τα 4-11 μηνών περίπου 12-15 ώρες.",
        category: categoryRefs["ypnos-routimes"],
        ageGroups: [ageGroupRefs[0]], // 0-2 έτη
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πότε πρέπει να ξεκινήσω να δίνω στερεά φαγητά;",
        answer: "Συνήθως γύρω στους 6 μήνες, όταν το παιδί μπορεί να κάθεται και να κρατάει το κεφάλι του. Συμβουλευτείτε πάντα τον παιδίατρο σας.",
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[0]], // 0-2 έτη
        publishedAt: new Date().toISOString(),
      },
    ];

    for (const qa of qaItems) {
      const exists = await client.fetch(`*[_type == "qaItem" && question == "${qa.question}"][0]._id`);
      if (!exists) {
        await createDocument("qaItem", qa);
      } else {
        console.log(`⏭️  Q&A "${qa.question.substring(0, 30)}..." already exists, skipping...`);
      }
    }

    console.log("\n✅ Sample data seeding completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Visit http://localhost:3000/studio to see your content");
    console.log("   2. Visit http://localhost:3000/drastiriotites to see activities");
    console.log("   3. Add more content as needed!");

  } catch (error: any) {
    console.error("\n❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

// Run the seed function
seedData();


