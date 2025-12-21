# Curated Collections Script

This script automatically creates Curated Collections for your Mikroi Mathites app.

## What it does

- Creates a "Quick Tips" Curated Collection with placement `"quick-tips"`
- Automatically finds and adds existing articles, activities, and recipes
- Skips creation if a collection already exists

## Prerequisites

1. Make sure you have content in Sanity (articles, activities, recipes, or printables)
   - If you don't have content yet, run: `npm run seed` first

2. Ensure your `.env.local` file has:
   ```
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=your_dataset
   SANITY_TOKEN=your_write_token
   ```

## How to run

### Option 1: Using npm script (recommended)
```bash
npm run create-collections
```

### Option 2: Using tsx directly
```bash
npx tsx scripts/create-curated-collections.ts
```

### Option 3: If tsx is not available, install it first
```bash
npm install -D tsx
npm run create-collections
```

## What happens

1. The script checks if a Quick Tips collection already exists
2. If not, it finds up to 4 existing content items (articles, activities, recipes)
3. Creates a new Curated Collection with:
   - Title: "Γρήγορες λύσεις (5')"
   - Placement: "quick-tips"
   - Items: Automatically selected from your existing content

## After running

1. Visit `http://localhost:3000/studio`
2. Go to "Curated Collection" documents
3. Edit the "Quick Tips" collection to:
   - Add/remove items
   - Change the order
   - Update the title or description

## Creating more collections

You can create additional collections manually in Sanity Studio:
- Home Featured
- Parents Page Top
- Activities Page Featured
- Category-specific "Start Here" collections

Just set the `placement` field to the appropriate value from the dropdown.

