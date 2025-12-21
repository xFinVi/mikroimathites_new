# Age Group Flow Design

## Current Structure

### Content Tagging System
- **Age Groups** (array): Developmental stages - 0-2, 2-4, 4-6, Greek Abroad
- **Category** (single): Topic/theme - Sleep, Speech, Food, Emotions, etc.
- **Tags** (array): Additional metadata for cross-linking

### Current State
- ✅ All content types support ageGroups (Articles, Activities, Printables, Recipes)
- ✅ Filters work with age groups via URL params (`?age=slug`)
- ❌ Age cards on home page are not clickable
- ❌ No dedicated age group landing page

---

## Proposed Solution: Unified Age Group Page

### Flow Design

**When user clicks "0-2 έτη" → `/age/0-2`**

### Page Structure:

```
┌─────────────────────────────────────────┐
│ Hero Section                             │
│ - Age group title & description          │
│ - Key milestones/characteristics         │
│ - Visual (age-appropriate imagery)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Quick Navigation Tabs                    │
│ [Άρθρα] [Δραστηριότητες] [Εκτυπώσιμα]  │
│ [Συνταγές] [Όλα]                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Featured Content (Curated)               │
│ - 3-4 featured items for this age       │
│ - Mix of content types                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Content by Type                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ Articles │ │Activities│ │Printables│  │
│ │  (3-6)   │ │  (3-6)   │ │  (3-6)   │  │
│ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Relevant Categories                      │
│ - Top categories for this age group     │
│ - With content counts                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Age-Specific Tips/Info                   │
│ - Quick tips for this age                │
│ - Developmental milestones               │
└─────────────────────────────────────────┘
```

---

## Implementation Options

### Option A: Dedicated Age Group Page (Recommended)
**Route:** `/age/[slug]` (e.g., `/age/0-2`, `/age/2-4`)

**Pros:**
- ✅ Best UX - all content in one place
- ✅ Can show age-specific information
- ✅ Better for SEO
- ✅ Can have curated featured content per age
- ✅ Clear navigation

**Cons:**
- ⚠️ Requires new page component
- ⚠️ Need to fetch all content types

**Implementation:**
- Create `/app/age/[slug]/page.tsx`
- Fetch articles, activities, printables, recipes filtered by age
- Show unified content grid with tabs/filters
- Use Curated Collections for featured content per age

---

### Option B: Redirect to Existing Pages with Filter
**Route:** Click "0-2" → `/gia-goneis?age=0-2` + `/drastiriotites?age=0-2`

**Pros:**
- ✅ Simple - no new pages
- ✅ Reuses existing filtering logic
- ✅ Quick to implement

**Cons:**
- ❌ Splits content across multiple pages
- ❌ User has to navigate between pages
- ❌ No age-specific landing experience
- ❌ Less engaging

---

### Option C: Combined View with Tabs
**Route:** `/age/[slug]` with content type tabs

**Pros:**
- ✅ All content in one place
- ✅ Easy to switch between types
- ✅ Can show age-specific info

**Cons:**
- ⚠️ More complex component
- ⚠️ Need to manage tab state

---

## Recommended Approach: Option A (Dedicated Page)

### Page Features:

1. **Hero Section**
   - Age group title and description
   - Key developmental characteristics
   - Visual representation

2. **Content Grid**
   - Unified grid showing all content types
   - Visual indicators for type (icon/badge)
   - Filter by content type (tabs or buttons)
   - Sort by: Newest, Featured, Popular

3. **Featured Section**
   - Use Curated Collections with placement "age-0-2", "age-2-4", etc.
   - Show 3-4 featured items
   - Mix of content types

4. **Category Navigation**
   - Show top categories for this age
   - Link to filtered view: `/age/0-2?category=sleep`

5. **Quick Tips**
   - Age-specific tips section
   - Can use Curated Collections or separate content type

---

## Content Tagging Strategy

### Current System (Good!)
- ✅ **Age Groups**: Already implemented on all content
- ✅ **Categories**: Single category per content (topic-based)
- ✅ **Tags**: Additional metadata

### Recommendations:

1. **Always tag content with age groups**
   - Content can belong to multiple age groups
   - Example: An article about "Toddler Sleep" might be relevant for both 0-2 and 2-4

2. **Use categories for topics**
   - Sleep, Speech, Food, Emotions, etc.
   - Helps with cross-age content discovery

3. **Use tags for specific themes**
   - "night-waking", "picky-eating", "tantrums"
   - More granular than categories

4. **Curated Collections for featured content**
   - Create collections per age group
   - Placement: "age-0-2", "age-2-4", "age-4-6", "age-greek-abroad"
   - Allows editorial control over what's featured

---

## URL Structure

### Option 1: `/age/[slug]`
- `/age/0-2`
- `/age/2-4`
- `/age/4-6`
- `/age/greek-abroad`

### Option 2: `/ages/[slug]` (plural)
- `/ages/0-2`
- `/ages/2-4`

**Recommendation:** Use `/age/[slug]` (singular, cleaner)

---

## User Journey Example

1. **User clicks "0-2 έτη" on home page**
   → Navigate to `/age/0-2`

2. **Landing on age group page**
   → See hero with age info
   → See featured content (3-4 items)
   → See all content for 0-2 age group

3. **User can:**
   - Filter by content type (Articles, Activities, etc.)
   - Filter by category (Sleep, Food, etc.)
   - Search within this age group
   - Click any content to view detail page

4. **From detail page**
   → Can click age badge to return to age group page
   → Can see related content for same age

---

## Implementation Checklist

- [ ] Create `/app/age/[slug]/page.tsx`
- [ ] Create age group hero component
- [ ] Create unified content grid component
- [ ] Add content type filter tabs
- [ ] Fetch all content types filtered by age
- [ ] Add Curated Collection support for age-specific featured content
- [ ] Add category navigation for age group
- [ ] Update home page age cards to link to age pages
- [ ] Add age group to breadcrumbs
- [ ] Update SEO metadata for age pages

---

## Alternative: Quick Win Approach

If you want something simpler first:

1. **Make age cards clickable**
   - Link to `/gia-goneis?age=0-2` (articles)
   - Or `/drastiriotites?age=0-2` (activities)
   - Or both with a combined view

2. **Add "View All" link**
   - Shows all content types for that age
   - Can be a simple filtered view

3. **Enhance later**
   - Add dedicated age pages when ready
   - Add age-specific curated content

---

## Questions to Consider

1. **Should age groups be mutually exclusive?**
   - Current: Content can have multiple age groups ✅
   - This is good - some content is relevant for multiple ages

2. **Should we show content from adjacent age groups?**
   - Example: On 0-2 page, show some 2-4 content as "Next Steps"
   - Could be useful for parents

3. **How to handle "Greek Abroad" age group?**
   - This is more of a context than an age
   - Might need special handling

4. **Should age pages be editable in CMS?**
   - Use Page Settings or Curated Collections
   - Allow custom hero content per age

---

## Recommendation

**Start with Option A (Dedicated Page)** because:
- Best user experience
- All content in one place
- Can showcase age-specific information
- Better for SEO and content discovery
- Allows for future enhancements (age-specific tips, milestones, etc.)

**Implementation Priority:**
1. Make age cards clickable → link to `/age/[slug]`
2. Create basic age group page with content grid
3. Add featured content section (Curated Collections)
4. Add category navigation
5. Enhance with age-specific info/tips

