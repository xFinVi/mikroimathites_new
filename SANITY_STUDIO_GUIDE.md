# Sanity Studio Guide - Access & Sample Data

## ✅ Frontend Integration Status

**Good news!** Your schemas are already connected to the frontend:

- ✅ **Schemas created** - All content types (Article, Recipe, Activity, Printable, etc.)
- ✅ **Queries ready** - GROQ queries in `lib/sanity/queries.ts`
- ✅ **Content functions** - Helper functions in `lib/content/index.ts`
- ✅ **Pages connected** - `/drastiriotites` page already uses `getActivities()`
- ✅ **Studio accessible** - Available at `http://localhost:3000/studio`

## 🚀 Accessing Sanity Studio

### Step 1: Start Your Dev Server

```bash
npm run dev
```

### Step 2: Open Studio

1. Open your browser
2. Navigate to: **http://localhost:3000/studio**
3. You'll see the Sanity Studio login page
4. **Log in with your Sanity account** (the one associated with project `4umly1wd`)

### Step 3: Verify You See Content Types

After logging in, you should see in the sidebar:
- 📄 **Article**
- 🍳 **Recipe** (NEW)
- 🎨 **Activity**
- 📎 **Printable**
- 🏷️ **Tag** (NEW)
- 👤 **Author** (NEW)
- 📚 **Category**
- 👶 **Age Group**
- 📋 **Curated Collection** (NEW)
- ⚙️ **Page Settings** (NEW)
- ❓ **QA Item**

## 📝 Adding Sample Data - Step by Step

### Step 1: Create Age Groups (Required First)

Age Groups are referenced by other content, so create them first:

1. Click **Age Group** in the sidebar
2. Click **Create new**
3. Create these age groups:
   - **Title**: "0-2 έτη" | **Slug**: auto-generated | **Order**: 1
   - **Title**: "2-4 έτη" | **Slug**: auto-generated | **Order**: 2
   - **Title**: "4-6 έτη" | **Slug**: auto-generated | **Order**: 3
   - **Title**: "Εξωτερικό" | **Slug**: auto-generated | **Order**: 4
4. Click **Publish** for each

### Step 2: Create Categories

1. Click **Category** in the sidebar
2. Create these categories:
   - **Title**: "Ύπνος & Ρουτίνες" | **Order**: 1
   - **Title**: "Ομιλία & Λεξιλόγιο" | **Order**: 2
   - **Title**: "Διατροφή & Επιλογές" | **Order**: 3
   - **Title**: "Φυσικές Συνταγές" | **Order**: 4
   - **Title**: "Τέχνες & Χειροτεχνίες" | **Order**: 5
   - **Title**: "Ανάπτυξη" | **Order**: 6
   - **Title**: "Ελληνικό Εξωτερικό" | **Order**: 7
   - **Title**: "Ιδέες Παιχνιδιού" | **Order**: 8
3. Click **Publish** for each

### Step 3: Create Tags (Optional but Recommended)

1. Click **Tag** in the sidebar
2. Create some tags like:
   - "αισθητηριακό παιχνίδι"
   - "γρήγορη δραστηριότητα"
   - "εκτός σπιτιού"
   - "χειροποίητο"
   - "μαγειρική"
3. Click **Publish** for each

### Step 4: Create Your First Activity

1. Click **Activity** in the sidebar
2. Click **Create new**
3. Fill in:
   - **Title**: "Χρωματιστό Παιχνίδι με Ρύζι"
   - **Slug**: Auto-generated
   - **Summary**: "Διασκεδαστικό αισθητηριακό παιχνίδι με χρωματιστό ρύζι"
   - **Duration**: "10-15 λεπτά"
   - **Materials**: 
     - "Ρύζι"
     - "Χρώματα τροφίμων"
     - "Πλαστικό δοχείο"
   - **Steps**: Add some steps with images if you want
   - **Cover Image**: Upload an image
   - **Age Groups**: Select "2-4 έτη"
   - **Category**: Select "Τέχνες & Χειροτεχνίες"
   - **Tags**: Select tags you created
   - **Published At**: Set to today's date
   - **Featured**: Toggle ON if you want it featured
4. Click **Publish**

### Step 5: Create Your First Recipe

1. Click **Recipe** in the sidebar
2. Click **Create new**
3. Fill in:
   - **Title**: "Μπανάνα με Μέλι"
   - **Slug**: Auto-generated
   - **Summary**: "Απλή και υγιεινή συνταγή για μικρά παιδιά"
   - **Difficulty**: "Easy"
   - **Prep Time**: 5
   - **Cook Time**: 0
   - **Servings**: 2
   - **Ingredients**: 
     - Name: "Μπανάνα", Amount: "1", Notes: "ώριμη"
     - Name: "Μέλι", Amount: "1 κουταλιά", Notes: "φυσικό"
   - **Instructions**: Add cooking instructions
   - **Cover Image**: Upload an image
   - **Age Groups**: Select "0-2 έτη"
   - **Category**: Select "Φυσικές Συνταγές"
   - **Published At**: Set to today's date
4. Click **Publish**

### Step 6: Create Your First Article

1. Click **Article** in the sidebar
2. Click **Create new**
3. Fill in:
   - **Title**: "10 Συμβουλές για Ήρεμο Ύπνο"
   - **Slug**: Auto-generated
   - **Excerpt**: "Πρακτικές συμβουλές για να βοηθήσετε το παιδί σας να κοιμηθεί"
   - **Body**: Add article content
   - **Reading Time**: 5
   - **Cover Image**: Upload an image
   - **Category**: Select "Ύπνος & Ρουτίνες"
   - **Age Groups**: Select multiple age groups
   - **Tags**: Select relevant tags
   - **Published At**: Set to today's date
   - **Featured**: Toggle ON
4. Click **Publish**

### Step 7: Create Page Settings (Singleton)

1. Click **Page Settings** in the sidebar
2. If it doesn't exist, click **Create new**
3. Configure:
   - **Home → Hero**: 
     - Type: "Image"
     - Upload an image
     - Add title/subtitle if desired
   - **Home → Seasonal Banner**:
     - Enabled: Toggle ON/OFF
     - Add title, subtitle, image
   - **For Parents → Hero**: Similar to home hero
   - **Site → Default OG Image**: Upload a default image
4. Click **Publish**

### Step 8: Create a Curated Collection

1. Click **Curated Collection** in the sidebar
2. Click **Create new**
3. Fill in:
   - **Title**: "Κορυφαίες Δραστηριότητες"
   - **Slug**: Auto-generated
   - **Description**: "Οι καλύτερες δραστηριότητες για παιδιά"
   - **Items**: Select activities/articles/recipes you created
   - **Placement**: Select "homeFeatured"
   - **Order**: 0
   - **Published At**: Set to today's date
4. Click **Publish**

## ✅ Verify Content Appears on Frontend

### Test Activities Page

1. Visit: **http://localhost:3000/drastiriotites**
2. You should see your activities displayed
3. If no activities, you'll see a message with a link to Studio

### Test API Directly

You can test the API endpoint:
```bash
curl http://localhost:3000/api/test-sanity
```

Or visit: **http://localhost:3000/api/test-sanity**

## 🔍 Troubleshooting

### Studio Won't Load

1. **Check environment variables**:
   ```bash
   # Make sure .env.local has:
   SANITY_PROJECT_ID=4umly1wd
   SANITY_DATASET=mikroimathites_2026
   SANITY_API_VERSION=2024-03-01
   SANITY_TOKEN=your-token-here
   ```

2. **Restart dev server** after changing env vars:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check browser console** for errors

### Can't See Content Types

1. **Verify schemas are registered**:
   - Check `sanity/schemas/index.ts` includes all schemas
   - Restart dev server

2. **Clear browser cache** and reload Studio

### Content Not Appearing on Frontend

1. **Check if content is published** (not just saved as draft)
2. **Verify `publishedAt` date** is set
3. **Check browser console** for API errors
4. **Verify queries** in `lib/sanity/queries.ts` match your schema fields

### Images Not Loading

1. **Check `next.config.ts`** has Sanity CDN configured
2. **Verify image URLs** are being generated correctly
3. **Check image permissions** in Sanity

## 📚 Next Steps

1. ✅ Create Age Groups and Categories
2. ✅ Add sample Activities, Recipes, Articles
3. ✅ Configure Page Settings
4. ✅ Create Curated Collections
5. ✅ Test frontend pages display content
6. ✅ Set up webhook for revalidation (for production)

## 🎯 Quick Test Checklist

- [ ] Can access Studio at `/studio`
- [ ] Can log in to Studio
- [ ] Can see all content types
- [ ] Created at least 1 Age Group
- [ ] Created at least 1 Category
- [ ] Created at least 1 Activity
- [ ] Activity appears on `/drastiriotites` page
- [ ] Can edit and republish content
- [ ] Changes reflect on frontend after revalidation

## 💡 Pro Tips

1. **Use the Preview feature** in Studio to see how content will look
2. **Create content in order**: Age Groups → Categories → Tags → Content
3. **Use Featured flag** to highlight important content
4. **Set Published At dates** for proper sorting
5. **Use Tags** for flexible content discovery
6. **Create Curated Collections** for editorial control without code changes

