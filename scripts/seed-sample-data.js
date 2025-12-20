/**
 * Seed Sample Data Script
 * 
 * This script creates sample content for the Mikroi Mathites app
 * Run with: npm run seed
 * 
 * Make sure your .env.local file has:
 * - SANITY_PROJECT_ID
 * - SANITY_DATASET
 * - SANITY_TOKEN (write token)
 */

// Load .env.local manually
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const { createClient } = require("@sanity/client");

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
async function createDocument(type, doc) {
  try {
    const result = await client.create({
      _type: type,
      ...doc,
    });
    console.log(`✅ Created ${type}: ${doc.title || doc.name || doc.question || "Untitled"}`);
    return result;
  } catch (error) {
    console.error(`❌ Error creating ${type}:`, error.message);
    throw error;
  }
}

// Helper to check if document exists
async function documentExists(type, slug) {
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

    const ageGroupRefs = [];
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

    const categoryRefs = {};
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

    const tagRefs = [];
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

    // 4. Create Authors
    console.log("\n👤 Creating Authors...");
    let authorRef;
    let authorViktoriaRef;
    
    // Team author
    const authorExists = await documentExists("author", "mikroi-mathites-team");
    if (authorExists) {
      console.log(`⏭️  Author "Ομάδα Μικροί Μαθητές" already exists, skipping...`);
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
    
    // Κυρία Βικτωρία
    const viktoriaExists = await documentExists("author", "kyria-viktoria");
    if (viktoriaExists) {
      console.log(`⏭️  Author "Κυρία Βικτωρία" already exists, skipping...`);
      const existing = await client.fetch(`*[_type == "author" && slug.current == "kyria-viktoria"][0]`);
      authorViktoriaRef = { _type: "reference", _ref: existing._id };
    } else {
      const viktoria = await createDocument("author", {
        name: "Κυρία Βικτωρία",
        slug: { current: "kyria-viktoria" },
        bio: "Ειδικός στην παιδική διατροφή και ανάπτυξη. Με πάνω από 15 χρόνια εμπειρίας στη συμβουλευτική γονέων.",
        role: "expert",
      });
      authorViktoriaRef = { _type: "reference", _ref: viktoria._id };
    }

    // 5. Create Activities (5 total)
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
      {
        title: "Παιχνίδι με Παζλ και Κουτιά",
        slug: "paixnidi-me-pazl-koutia",
        summary: "Απλό παιχνίδι για την ανάπτυξη της λογικής και της λεπτής κινητικότητας",
        duration: "10-20 λεπτά",
        materials: ["Κουτιά διαφόρων μεγεθών", "Παζλ", "Κύβους"],
        goals: ["Λογική σκέψη", "Λεπτή κινητικότητα", "Αναγνώριση σχημάτων"],
        steps: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βάλτε διάφορα κουτιά και παζλ μπροστά στο παιδί.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ενθαρρύνετε το παιδί να ταξινομήσει τα κουτιά κατά μέγεθος ή να λύσει το παζλ.",
              },
            ],
          },
        ],
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        tags: [tagRefs[0], tagRefs[6]], // αισθητηριακό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Παιχνίδι Ονομασίας Αντικειμένων",
        slug: "paixnidi-onomasias-antikeimenon",
        summary: "Δραστηριότητα για την ανάπτυξη του λεξιλογίου και της ομιλίας",
        duration: "5-10 λεπτά",
        materials: ["Καθημερινά αντικείμενα", "Εικόνες", "Βιβλία"],
        goals: ["Ανάπτυξη λεξιλογίου", "Ομιλία", "Αναγνώριση αντικειμένων"],
        steps: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βάλτε διάφορα αντικείμενα μπροστά στο παιδί (μπάλα, αυτοκίνητο, κούκλα).",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ρωτήστε το παιδί 'Τι είναι αυτό;' και περιμένετε την απάντηση.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Επαναλάβετε με διαφορετικά αντικείμενα.",
              },
            ],
          },
        ],
        category: categoryRefs["omilia-lexilogo"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[1], tagRefs[6]], // γρήγορη, εύκολο
        publishedAt: new Date().toISOString(),
        featured: false,
      },
      {
        title: "Χορός και Κίνηση",
        slug: "xoros-kiniti",
        summary: "Δραστηριότητα για φυσική άσκηση και συντονισμό",
        duration: "15-20 λεπτά",
        materials: ["Μουσική", "Χώρος για κίνηση"],
        goals: ["Φυσική άσκηση", "Συντονισμός", "Ρυθμός"],
        steps: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βάλτε μουσική που αρέσει στο παιδί.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ενθαρρύνετε το παιδί να χορεύει, να πηδάει και να κινείται με τη μουσική.",
              },
            ],
          },
        ],
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        tags: [tagRefs[1], tagRefs[6]], // γρήγορη, εύκολο
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

    // 6. Create Recipes (6 total)
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
      {
        title: "Ομελέτα με Λαχανικά",
        slug: "omeleta-me-laxanika",
        summary: "Πλούσια σε πρωτεΐνη και βιταμίνες ομελέτα για το πρωινό",
        difficulty: "easy",
        prepTime: 5,
        cookTime: 5,
        servings: 2,
        ingredients: [
          { name: "Αυγά", amount: "2", notes: "μεγάλα" },
          { name: "Κολοκύθα", amount: "1/4", notes: "τριμμένη" },
          { name: "Καρότο", amount: "1/4", notes: "τριμμένο" },
          { name: "Ελαιόλαδο", amount: "1 κουταλιά" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Χτυπήστε τα αυγά σε ένα μπολ.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Προσθέστε την κολοκύθα και το καρότο.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Τηγανίστε σε ελαιόλαδο μέχρι να είναι έτοιμο.",
              },
            ],
          },
        ],
        tips: ["Μπορείτε να προσθέσετε τυρί αν το παιδί το προτιμά"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        tags: [tagRefs[4], tagRefs[5], tagRefs[6]], // μαγειρική, φυσικό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Σούπα με Κολοκύθα",
        slug: "soupa-me-kolokytha",
        summary: "Κρεμώδης και θρεπτική σούπα για μικρά παιδιά",
        difficulty: "easy",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [
          { name: "Κολοκύθα", amount: "1", notes: "μεσαία, κομμένη" },
          { name: "Καρότο", amount: "2", notes: "κομμένα" },
          { name: "Κρεμμύδι", amount: "1/2", notes: "ψιλοκομμένο" },
          { name: "Λαχανικό ζωμό", amount: "500ml" },
          { name: "Ελαιόλαδο", amount: "2 κουταλιές" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Σοτάρετε το κρεμμύδι και το καρότο σε ελαιόλαδο.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Προσθέστε την κολοκύθα και το ζωμό.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βράστε για 20 λεπτά και πολτοποιήστε.",
              },
            ],
          },
        ],
        tips: ["Σερβίρετε ζεστή με λίγο ελαιόλαδο πάνω"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[4], tagRefs[5], tagRefs[6]], // μαγειρική, φυσικό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: false,
      },
      {
        title: "Μήλο με Φυστικοβούτυρο",
        slug: "milo-me-fystikoboutyro",
        summary: "Υγιεινό σνακ με φυτικές πρωτεΐνες",
        difficulty: "easy",
        prepTime: 3,
        cookTime: 0,
        servings: 1,
        ingredients: [
          { name: "Μήλο", amount: "1", notes: "κομμένο σε φέτες" },
          { name: "Φυστικοβούτυρο", amount: "1-2 κουταλιές", notes: "φυσικό, χωρίς ζάχαρη" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Κόψτε το μήλο σε φέτες.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Αλείψτε το φυστικοβούτυρο πάνω στις φέτες.",
              },
            ],
          },
        ],
        tips: ["Ιδανικό για σνακ μεταξύ γευμάτων"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        tags: [tagRefs[4], tagRefs[5], tagRefs[6]], // μαγειρική, φυσικό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: false,
      },
      {
        title: "Μπισκότα με Βρώμη",
        slug: "biskota-me-vromi",
        summary: "Υγιεινά μπισκότα για σνακ",
        difficulty: "medium",
        prepTime: 15,
        cookTime: 15,
        servings: 12,
        ingredients: [
          { name: "Βρώμη", amount: "200g" },
          { name: "Μπανάνα", amount: "2", notes: "ώριμες, πολτοποιημένες" },
          { name: "Ελαιόλαδο", amount: "2 κουταλιές" },
          { name: "Κανέλα", amount: "1/2 κουταλιά", notes: "αλεσμένη" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ανακατέψτε όλα τα υλικά.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Διαμορφώστε σε μικρά μπισκότα.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ψήστε στους 180°C για 15 λεπτά.",
              },
            ],
          },
        ],
        tips: ["Μπορείτε να προσθέσετε σταφίδες ή καρύδια"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        tags: [tagRefs[4], tagRefs[5]], // μαγειρική, φυσικό
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Γιαούρτι με Φρούτα",
        slug: "giaourti-me-frouta",
        summary: "Απλό και θρεπτικό γλυκό",
        difficulty: "easy",
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        ingredients: [
          { name: "Γιαούρτι", amount: "200g", notes: "φυσικό, πλήρες" },
          { name: "Μπανάνα", amount: "1/2", notes: "κομμένη" },
          { name: "Μούσμουλο", amount: "1", notes: "κομμένο" },
          { name: "Μέλι", amount: "1 κουταλιά", notes: "προαιρετικό" },
        ],
        instructions: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Βάλτε το γιαούρτι σε ένα μπολ.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Προσθέστε τα φρούτα και το μέλι.",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Ανακατέψτε και σερβίρετε.",
              },
            ],
          },
        ],
        tips: ["Χρησιμοποιήστε φρέσκα φρούτα της εποχής"],
        category: categoryRefs["fysikes-syntages"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[4], tagRefs[5], tagRefs[6]], // μαγειρική, φυσικό, εύκολο
        publishedAt: new Date().toISOString(),
        featured: false,
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

    // 7. Create Articles (4 total)
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
      {
        title: "Πώς να Ενθαρρύνετε την Ομιλία του Παιδιού",
        slug: "pos-na-entharynete-tin-omilia-tou-paidiou",
        excerpt: "Πρακτικές συμβουλές για να βοηθήσετε το παιδί σας να αναπτύξει το λεξιλόγιο και τις γλωσσικές του δεξιότητες",
        body: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Η ανάπτυξη της ομιλίας είναι σημαντική για την κοινωνική και γνωστική ανάπτυξη. Εδώ είναι μερικές συμβουλές:",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "1. Μιλήστε συχνά με το παιδί σας, ακόμα και από μικρή ηλικία",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "2. Διαβάστε βιβλία μαζί κάθε μέρα",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "3. Περιγράψτε τι κάνετε καθώς το κάνετε",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "4. Ακούστε προσεκτικά και δώστε χρόνο στο παιδί να απαντήσει",
              },
            ],
          },
        ],
        readingTime: 6,
        category: categoryRefs["omilia-lexilogo"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1], ageGroupRefs[2]], // 0-2, 2-4, 4-6
        tags: [tagRefs[6]], // εύκολο
        author: authorRef,
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Υγιεινή Διατροφή για Παιδιά 1-3 Ετών",
        slug: "ygeini-diatrofi-gia-paidia-1-3-eton",
        excerpt: "Οδηγίες για την προώθηση υγιεινής διατροφής και καλών διατροφικών συνηθειών",
        body: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Η διατροφή στα πρώτα χρόνια είναι κρίσιμη για την ανάπτυξη. Βασικές αρχές:",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "1. Προσφέρετε μια ποικιλία φρούτων και λαχανικών",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "2. Περιλαμβάνετε πρωτεΐνες (ψάρια, κρέας, όσπρια)",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "3. Χρησιμοποιήστε ολικής άλεσης δημητριακά",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "4. Προσφέρετε νερό ως κύριο ποτό",
              },
            ],
          },
        ],
        readingTime: 7,
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[5], tagRefs[6]], // φυσικό, εύκολο
        author: authorViktoriaRef,
        publishedAt: new Date().toISOString(),
        featured: true,
      },
      {
        title: "Ασφάλεια στο Σπίτι: Οδηγός για Γονείς",
        slug: "asfaleia-sto-spiti-odigos-gia-goneis",
        excerpt: "Σημαντικές συμβουλές για να κάνετε το σπίτι ασφαλές για μικρά παιδιά",
        body: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Η ασφάλεια στο σπίτι είναι προτεραιότητα. Βασικά μέτρα:",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "1. Τοποθετήστε προστατευτικά στις πρίζες",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "2. Ασφαλίστε τα ντουλάπια και τα συρτάρια",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "3. Τοποθετήστε φράγματα στις σκάλες",
              },
            ],
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "4. Κρατήστε τα καθαριστικά και φάρμακα εκτός προσπέλασης",
              },
            ],
          },
        ],
        readingTime: 5,
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        tags: [tagRefs[6]], // εύκολο
        author: authorRef,
        publishedAt: new Date().toISOString(),
        featured: false,
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

    // 9. Create Q&A Items (expanded based on NHS guidelines)
    console.log("\n❓ Creating Q&A Items...");
    const qaItems = [
      {
        question: "Πόσες ώρες ύπνου χρειάζεται ένα βρέφος;",
        answer: "Τα βρέφη 0-3 μηνών χρειάζονται περίπου 14-17 ώρες ύπνου την ημέρα, ενώ τα 4-11 μηνών περίπου 12-15 ώρες. Τα παιδιά 1-2 ετών χρειάζονται 11-14 ώρες, και τα 3-5 ετών 10-13 ώρες.",
        category: categoryRefs["ypnos-routimes"],
        ageGroups: [ageGroupRefs[0]], // 0-2 έτη
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πότε πρέπει να ξεκινήσω να δίνω στερεά φαγητά;",
        answer: "Συνήθως γύρω στους 6 μήνες, όταν το παιδί μπορεί να κάθεται και να κρατάει το κεφάλι του. Ξεκινήστε με μικρές ποσότητες και αυξάνετε σταδιακά. Συμβουλευτείτε πάντα τον παιδίατρο σας.",
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[0]], // 0-2 έτη
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πόσες φορές την ημέρα πρέπει να τρώει ένα παιδί 2-3 ετών;",
        answer: "Τα παιδιά 2-3 ετών πρέπει να τρώνε 3 κύρια γεύματα και 2-3 σνακ την ημέρα. Προσφέρετε μικρές ποσότητες και μην αναγκάζετε το παιδί να φάει αν δεν θέλει.",
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[1]], // 2-4 έτη
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πότε πρέπει να ανησυχώ για την ομιλία του παιδιού μου;",
        answer: "Αν το παιδί σας δεν λέει καμία λέξη μέχρι τα 18 μήνες, ή δεν συνδυάζει 2 λέξεις μέχρι τα 2 έτη, συμβουλευτείτε λογοθεραπευτή ή παιδίατρο. Κάθε παιδί αναπτύσσεται με διαφορετικό ρυθμό, αλλά είναι σημαντικό να εντοπίσετε τυχόν προβλήματα νωρίς.",
        category: categoryRefs["omilia-lexilogo"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πόση φυσική δραστηριότητα χρειάζεται ένα παιδί;",
        answer: "Τα παιδιά 1-2 ετών χρειάζονται τουλάχιστον 3 ώρες φυσικής δραστηριότητας την ημέρα, ενώ τα 3-4 ετών τουλάχιστον 3 ώρες, από τις οποίες 1 ώρα έντονη δραστηριότητα. Περιλαμβάνει παιχνίδι, τρέξιμο, πήδημα και εξερεύνηση.",
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πότε πρέπει να ξεκινήσω την εκπαίδευση στην τουαλέτα;",
        answer: "Τα περισσότερα παιδιά είναι έτοιμα μεταξύ 18 μηνών και 3 ετών. Σημεία που δείχνουν ότι είναι έτοιμο: μπορεί να περπατάει, να κάθεται, να ακολουθεί απλές οδηγίες, να δείχνει ενδιαφέρον για την τουαλέτα, και να παραμένει στεγνό για 2 ώρες.",
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[1]], // 2-4 έτη
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πώς μπορώ να βοηθήσω το παιδί μου να αναπτύξει κοινωνικές δεξιότητες;",
        answer: "Παίξτε μαζί, διαβάστε βιβλία που περιγράφουν συναισθήματα, ενθαρρύνετε το παιχνίδι με άλλα παιδιά, και μάθετε του να μοιράζεται. Το παιχνίδι είναι ο καλύτερος τρόπος για τα παιδιά να μάθουν κοινωνικές δεξιότητες.",
        category: categoryRefs["anaptyxi"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Τι να κάνω αν το παιδί μου δεν θέλει να φάει λαχανικά;",
        answer: "Μην ανησυχείτε - αυτό είναι συνηθισμένο. Προσφέρετε λαχανικά με διαφορετικούς τρόπους (ωμά, μαγειρεμένα, σε σούπες), να είστε το παράδειγμα τρώγοντας λαχανικά, και να συνεχίζετε να προσφέρετε χωρίς πίεση. Μερικές φορές χρειάζονται 10-15 προσπάθειες πριν το παιδί αποδεχτεί ένα νέο φαγητό.",
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[1], ageGroupRefs[2]], // 2-4, 4-6
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πόσο νερό πρέπει να πίνει ένα παιδί;",
        answer: "Τα παιδιά 1-3 ετών χρειάζονται περίπου 1-1.3 λίτρα υγρών την ημέρα (συμπεριλαμβανομένου του νερού από το γάλα και τα φαγητά). Προσφέρετε νερό σε κανονικά διαστήματα και μετά τη φυσική δραστηριότητα.",
        category: categoryRefs["diatrofi-epiloges"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
        publishedAt: new Date().toISOString(),
      },
      {
        question: "Πώς μπορώ να δημιουργήσω μια καλή ρουτίνα ύπνου;",
        answer: "Δημιουργήστε μια συνεπή ρουτίνα: λουστείτε, φορέστε πιτζάμες, διαβάστε ένα βιβλίο, και πηγαίνετε στο κρεβάτι την ίδια ώρα κάθε βράδυ. Κρατήστε το δωμάτιο σκοτεινό και ήσυχο. Η ρουτίνα βοηθά το παιδί να καταλάβει ότι είναι ώρα για ύπνο.",
        category: categoryRefs["ypnos-routimes"],
        ageGroups: [ageGroupRefs[0], ageGroupRefs[1]], // 0-2, 2-4
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

  } catch (error) {
    console.error("\n❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

// Run the seed function
seedData();

