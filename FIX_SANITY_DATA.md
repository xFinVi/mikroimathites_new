# Fix Sanity Data Issues

This guide helps you fix common data issues in Sanity that prevent content from rendering on the frontend.

## Common Issues

1. **Missing `_key` properties** in array fields (ageGroups, tags)
2. **Missing `featured` flags** - content won't show in featured sections
3. **Missing slugs** - content won't be accessible
4. **Data type mismatches** - e.g., slug stored as string instead of slug type

## Quick Fix Script

Run the automated fix script:

```bash
node scripts/fix-sanity-data.js
```

This script will:
- Add missing `_key` properties to ageGroups and tags arrays
- Set `featured: true` on the first 10 items of each content type
- Skip items without slugs (you'll need to add slugs manually in Sanity Studio)

## Manual Fixes in Sanity Studio

### Fix Missing Keys

1. Open an article/activity/printable in Sanity Studio
2. If you see "Missing keys" warning:
   - Click "Add missing keys" button
   - Or manually add `_key` to each array item

### Set Featured Flag

1. Open content item in Sanity Studio
2. Find the "Featured" checkbox
3. Check it for items you want to show in featured sections
4. Publish the changes

### Fix Slug Issues

1. If slug shows as "Invalid property value":
   - Click "Reset value"
   - Re-enter the slug value
   - Make sure it's in the correct format (lowercase, hyphens)
   - Publish

### Ensure All Content Has Required Fields

- **Title**: Required
- **Slug**: Required (must be unique)
- **Published At**: Set a date for published content
- **Cover Image**: Recommended for better display

## Verify Fixes

After running the script:

1. Check the home page - you should see:
   - Featured section with 6 items
   - Articles section with 3 items
   - Activities section with 4 items

2. Check individual pages:
   - `/gia-goneis` - should show all articles
   - `/drastiriotites` - should show all activities and printables

3. If content still doesn't show:
   - Check browser console for errors
   - Verify items are published (not drafts)
   - Verify slugs are set correctly
   - Check that featured flag is set if using featured queries

## Troubleshooting

### Content Still Not Showing

1. **Check if items are published**: Drafts won't show on frontend
2. **Verify Sanity connection**: Check `.env.local` has correct credentials
3. **Clear Next.js cache**: Delete `.next` folder and restart dev server
4. **Check GROQ queries**: Verify queries in `lib/sanity/queries.ts` match your schema

### Featured Section Empty

- The featured section uses a mix of featured articles, activities, and recipes
- If you have less than 6 featured items total, it will show what's available
- Make sure at least some items have `featured: true` set

### Sections Not Rendering

- Sections now always render (even if empty) with a fallback message
- If you see "Δεν υπάρχουν..." messages, it means no content was found
- Run the fix script to set featured flags on some items

