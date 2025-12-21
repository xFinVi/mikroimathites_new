# How to Add Curated Collections in Sanity Studio

This guide shows you how to manually create Curated Collections in Sanity Studio, ensuring they match the schema exactly.

## Step-by-Step Instructions

### 1. Create a New Curated Collection

1. Go to **Sanity Studio** (`http://localhost:3000/studio`)
2. Click **"Curated Collection"** in the left sidebar
3. Click **"Create new"** button

### 2. Fill in Required Fields

#### **Title** (Required)
- Enter a descriptive title, e.g., `"Γρήγορες λύσεις (5')"`

#### **Slug** (Required)
- Click the "Generate" button next to the slug field
- Or manually enter a URL-friendly slug, e.g., `"grhgores-lyseis-5"`
- The slug will auto-generate from the title if you click "Generate"

#### **Description** (Optional)
- Add a description if you want, e.g., `"Γρήγορες και πρακτικές συμβουλές για γονείς"`

#### **Items** (Required - Minimum 1)
This is the most important part! Follow these steps carefully:

1. Click **"+ Add item..."** button
2. You'll see a dropdown with options:
   - **Collection Article** - for articles
   - **Collection Recipe** - for recipes
   - **Collection Activity** - for activities
   - **Collection Printable** - for printables

3. **Select the type** (e.g., "Collection Article")
4. **Search for the document** you want to add:
   - Type the title of the article/activity/recipe/printable
   - Select it from the dropdown
   - **IMPORTANT**: Only select documents that are **Published** (not drafts)

5. Repeat steps 1-4 to add more items (minimum 1, but you can add as many as you want)

#### **Placement** (Required)
- Select from the dropdown:
  - **Quick Tips (Parents Page)** - for the Quick Tips section on `/gia-goneis`
  - **Parents Page Top** - for top of parents page
  - **Home Featured** - for homepage
  - Or any other placement option

#### **Order** (Optional)
- Enter a number (default: 0)
- Used for sorting when multiple collections have the same placement
- Lower numbers appear first

#### **Published at** (Optional)
- Set a date/time when this collection should be published
- Leave empty to publish immediately

### 3. Publish the Collection

1. Click the **"Publish"** button in the top right
2. The collection is now live and will appear on your site!

## Important Notes

### ✅ DO:
- Only add **Published** documents to items (not drafts)
- Make sure documents have a slug before adding them
- Use the correct placement for where you want it to appear
- Publish the collection after creating it

### ❌ DON'T:
- Don't add draft documents (they won't work)
- Don't leave Items empty (minimum 1 required)
- Don't forget to publish the collection

## Troubleshooting

### "Item of type reference not valid for this list"
- **Cause**: The document you're trying to add is a draft or doesn't exist
- **Fix**: 
  1. Go to the document (Article/Activity/Recipe/Printable)
  2. Make sure it's **Published** (not in draft)
  3. Make sure it has a **slug**
  4. Then try adding it to the collection again

### Items not showing on frontend
- **Cause**: Collection is not published or items are drafts
- **Fix**: 
  1. Check that the collection is published (green "Published" badge)
  2. Check that all items in the collection are published documents
  3. Verify the placement matches what the frontend is looking for

### Can't find documents to add
- **Cause**: Documents might be drafts or don't have slugs
- **Fix**: 
  1. Go to the document type (Article/Activity/etc.)
  2. Publish the documents you want to use
  3. Make sure they have slugs
  4. Then try adding them again

## Example: Creating Quick Tips Collection

1. **Title**: `Γρήγορες λύσεις (5')`
2. **Slug**: `grhgores-lyseis-5` (auto-generated)
3. **Description**: `Γρήγορες και πρακτικές συμβουλές για γονείς - 5 λεπτά για κάθε λύση`
4. **Items**: 
   - Click "+ Add item..." → Select "Collection Article"
   - Search and select: "10 Συμβουλές για Ήρεμο Ύπνο"
   - Click "+ Add item..." → Select "Collection Article"
   - Search and select: "Πώς να Ενθαρρύνετε την Ομιλία του Παιδιού"
   - (Add 2-4 more items)
5. **Placement**: Select "Quick Tips (Parents Page)"
6. **Order**: `0`
7. **Click "Publish"**

That's it! The collection will now appear on `/gia-goneis` in the Quick Tips section.

