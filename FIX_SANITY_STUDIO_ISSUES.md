# Fix Sanity Studio Issues

This guide helps you fix common issues in Sanity Studio that prevent content from being edited properly.

## Common Issues

### 1. **Invalid Property Value - Slug Type Mismatch**

**Error Message:**
```
Invalid property value
The property value is stored as a value type that does not match the expected type.
The value of this property must be of type `slug` according to the schema.
The current value (string)
```

**Cause:** 
Slug fields are stored as plain strings (`"my-slug"`) but the schema expects slug objects (`{ _type: "slug", current: "my-slug" }`).

**Solution:**

#### Option A: Run the Fix Script (Recommended)
```bash
node scripts/fix-sanity-data.js
```

This script will automatically:
- Convert all string slugs to proper slug objects
- Fix missing `_key` properties in arrays
- Set featured flags on content

#### Option B: Manual Fix in Studio
1. Click the "Reset value" button in the error message
2. Re-enter the slug value in the slug field
3. The Studio will automatically create the correct slug object structure
4. Publish the document

### 2. **Missing Keys in Arrays**

**Error Message:**
```
Missing keys
Some items in the list are missing their keys. This must be fixed in order to edit the list.
```

**Cause:**
Array items (ageGroups, tags, etc.) are missing `_key` properties that Sanity requires for array editing.

**Solution:**

#### Option A: Run the Fix Script
```bash
node scripts/fix-sanity-data.js
```

#### Option B: Manual Fix in Studio
1. Click "Add missing keys" button
2. The Studio will automatically add `_key` properties to all array items
3. Publish the document

### 3. **Content Not Showing on Frontend**

**Possible Causes:**
- Items are drafts (not published)
- Missing slugs
- Featured flag not set (for featured sections)
- Data type mismatches

**Solution:**
1. Run the fix script: `node scripts/fix-sanity-data.js`
2. Ensure all items are published (not drafts)
3. Set `featured: true` on items you want in featured sections
4. Verify slugs are set correctly

## Quick Fix - Run All Fixes

```bash
# Make sure you have your .env.local file with Sanity credentials
node scripts/fix-sanity-data.js
```

This will fix:
- ✅ Slug type mismatches (string → slug object)
- ✅ Missing `_key` properties in arrays
- ✅ Featured flags (sets on first 10 items of each type)
- ✅ All content types: articles, activities, printables, recipes, categories, age groups, tags

## After Running the Script

1. **Refresh Sanity Studio** - The errors should be gone
2. **Check the frontend** - Content should now appear
3. **Verify featured sections** - Should show content on home page

## Troubleshooting

### Script Fails with "Missing credentials"

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your_token
```

### Some Items Still Show Errors

1. Check if the item is a draft (drafts won't be fixed by the script)
2. Manually fix in Studio by clicking "Reset value" or "Add missing keys"
3. Re-run the script if needed

### Content Still Not Showing

1. Verify items are **published** (green dot in Studio)
2. Check browser console for errors
3. Clear Next.js cache: `rm -rf .next && npm run dev`
4. Verify GROQ queries in `lib/sanity/queries.ts`

## Prevention

To avoid these issues in the future:
- Always use the slug field's "Generate" button in Studio (don't type slugs manually)
- When creating arrays, Studio automatically adds `_key` properties
- If you migrate data, use the fix script to convert old formats

