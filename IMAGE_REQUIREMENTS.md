# Image Requirements Guide

## Overview

All content types now require at least one image (coverImage) and support an optional second image (secondaryImage).

## Schema Changes

### Required Fields
- **coverImage** - Now required for all content types:
  - Articles
  - Activities
  - Printables
  - Recipes

### Optional Fields
- **secondaryImage** - Optional additional image for all content types

## Content Types Updated

1. **Article** (`sanity/schemas/documents/article.ts`)
   - ✅ `coverImage` - Required
   - ✅ `secondaryImage` - Optional

2. **Activity** (`sanity/schemas/documents/activity.ts`)
   - ✅ `coverImage` - Required
   - ✅ `secondaryImage` - Optional

3. **Printable** (`sanity/schemas/documents/printable.ts`)
   - ✅ `coverImage` - Required
   - ✅ `secondaryImage` - Optional

4. **Recipe** (`sanity/schemas/documents/recipe.ts`)
   - ✅ `coverImage` - Required
   - ✅ `secondaryImage` - Optional

## Frontend Behavior

### Featured Sections
- Only items with `coverImage` will appear in featured sections
- Queries automatically filter: `defined(coverImage)`
- Home page filters out items without images

### Fallback Images
- If an image is missing (shouldn't happen in featured), a gradient placeholder is shown
- Placeholder includes an emoji and "No Image" text

### Image Display
- **Cover Image**: Used in cards, listings, and featured sections
- **Secondary Image**: Available for use in detail pages or galleries (future enhancement)

## How to Add Images in Sanity Studio

1. **Open any content item** (Article, Activity, etc.)
2. **Cover Image (Required)**:
   - Scroll to "Cover Image" field
   - Click "Upload" or "Select"
   - Choose an image
   - Add alt text for accessibility
3. **Secondary Image (Optional)**:
   - Scroll to "Secondary Image (Optional)" field
   - Upload or select an image if desired
4. **Publish** the document

## Validation

- Sanity Studio will show an error if you try to publish without a cover image
- Error message: "Cover image is required for featured content"
- You must add a cover image before publishing

## Best Practices

1. **Image Dimensions**:
   - Recommended: 1200x630px (for social sharing)
   - Minimum: 800x600px
   - Aspect ratio: 16:9 or 4:3 works well

2. **File Size**:
   - Keep images under 2MB for faster loading
   - Sanity automatically optimizes images

3. **Alt Text**:
   - Always add descriptive alt text
   - Helps with SEO and accessibility

4. **Secondary Images**:
   - Use for additional context
   - Can show different angles or steps
   - Great for activities showing before/after

## Troubleshooting

### "Cover image is required" Error
- You must add a cover image before publishing
- Click "Upload" or "Select" in the Cover Image field
- Choose an image file

### Images Not Showing on Frontend
1. Check that the image is uploaded (not just selected)
2. Verify the document is published (not draft)
3. Clear browser cache
4. Check browser console for errors

### Featured Section Empty
- Only items with `coverImage` appear in featured sections
- Make sure your featured items have cover images
- Check that items are published

## Migration Notes

If you have existing content without images:
1. The schema now requires `coverImage`
2. You'll need to add images to existing content before republishing
3. Use the fix script to identify items without images:
   ```bash
   node scripts/fix-sanity-data.js
   ```

## Next Steps

1. ✅ Add cover images to all existing content
2. ✅ Use secondary images for enhanced visual content
3. ✅ Ensure all new content includes cover images
4. ✅ Test featured sections show images correctly

