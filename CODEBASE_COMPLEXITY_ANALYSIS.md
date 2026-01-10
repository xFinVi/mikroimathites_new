# Codebase Complexity Analysis & Cleanup Plan

## 📊 Current State: 193 TypeScript/TSX Files

### Breakdown by Directory:
- **app/**: 62 files (32% of total)
  - 26 API routes
  - 7 auth pages/components
  - 5 admin pages
  - 4 gia-goneis pages
  - 4 drastiriotites pages
  - 16 other pages/utilities

- **components/**: 100 files (52% of total) ⚠️ **LARGEST CONCERN**
  - 16 UI components (shadcn/ui - necessary)
  - 10 article components
  - 9 sponsors components
  - 9 admin components
  - 7 forms components
  - 7 analytics components
  - 6 home components
  - 5 printables components
  - 5 content components
  - 5 activities components
  - 22 other components

- **lib/**: 31 files (16% of total)
- **sanity/**: 27 files (14% of total)
- **hooks/**: 2 files
- **scripts/**: 4 files

---

## 🔍 Issues Found

### 1. **UNUSED COMPONENTS** (Can Delete - ~5 files)

#### Home Components (3 unused):
- ❌ `components/home/background-video-section.tsx` - **NOT USED ANYWHERE**
- ❌ `components/home/video-hero-section.tsx` - **NOT USED ANYWHERE**
- ❌ `components/home/featured-banner.tsx` - **NOT USED ANYWHERE** (but FeaturedBanner type exists)

**Note:** Only `video-sneak-peek.tsx` is actually used on the homepage.

#### Analytics Components (2 unused):
- ❌ `components/analytics/google-analytics.tsx` - **NOT USED**
- ❌ `components/analytics/google-analytics-manual.tsx` - **NOT USED**

**Only `conditional-analytics.tsx` is used** (in `app/layout.tsx`)

### 2. **UNUSED API ROUTES** (Can Delete - 1 file)

- ❌ `app/api/sponsors/upload-url/route.ts` - **NOT USED**
  - Only `/api/sponsors/upload` is used (in `components/sponsors/logo-upload.tsx`)
  - The upload-url route was likely an alternative approach that wasn't adopted

### 3. **ORPHANED CODE** (Needs Cleanup - 3 files)

#### Testimonial Feature (User deleted schema but code remains):
- ⚠️ `sanity/schemas/documents/testimonial.ts` - **EXISTS BUT NOT REGISTERED**
- ⚠️ `components/home/testimonials-section.tsx` - **USED BUT WILL FAIL** (no schema)
- ⚠️ `lib/sanity/queries.ts` - Contains `testimonialsQuery` that will fail
- ⚠️ `lib/content/index.ts` - Contains `getTestimonials()` that will fail
- ⚠️ `app/page.tsx` - Calls `getTestimonials()` 
- ⚠️ `components/home/home-page.tsx` - Renders `TestimonialsSection`

**Decision needed:** Either restore testimonial schema OR remove all testimonial code.

### 4. **OVER-ENGINEERING** (Can Consolidate)

#### Article Components (10 files - could be 5-6):
- `article-card.tsx` ✅ Used
- `article-content.tsx` ✅ Used
- `article-header.tsx` ✅ Used (uses `article-meta.tsx`)
- `article-meta.tsx` ✅ Used (by header)
- `article-stats.tsx` ✅ Used
- `article-tags.tsx` ✅ Used
- `articles-list.tsx` ✅ Used
- `next-article.tsx` ✅ Used
- `related-articles.tsx` ✅ Used
- `share-buttons.tsx` ✅ Used

**Recommendation:** These are actually well-organized. Keep as-is.

#### Forms Components (7 files):
- `feedback-form-tab.tsx` ✅ Used
- `form-tabs.tsx` ✅ Used (uses video-idea-form, qa-form)
- `inline-quick-form.tsx` ❓ **NEEDS VERIFICATION** - Not found in imports
- `qa-form.tsx` ✅ Used (in form-tabs)
- `success-message.tsx` ✅ Used (by forms)
- `unified-contact-form.tsx` ✅ Used
- `video-idea-form.tsx` ✅ Used (in form-tabs)

**Action:** Verify `inline-quick-form.tsx` usage.

#### Analytics Components (7 files - could be 3-4):
- `adsense-head-script.tsx` ✅ Used
- `conditional-analytics.tsx` ✅ Used (main one)
- `content-tracker.tsx` ✅ Used
- `download-count.tsx` ✅ Used
- `view-count.tsx` ✅ Used
- `google-analytics.tsx` ❌ **UNUSED** - DELETE
- `google-analytics-manual.tsx` ❌ **UNUSED** - DELETE

### 5. **DUPLICATE QUERIES** (Can Consolidate)

- `lib/sanity/queries.ts` - Main queries
- `lib/sanity/queries-sorting.ts` - Sorting variants (4 queries)

**Status:** Actually necessary for different sort options. Keep as-is.

### 6. **API ROUTES ANALYSIS** (26 routes)

#### Admin Routes (11 routes):
- `/api/admin/sponsor-applications/*` - 3 routes ✅ Used
- `/api/admin/sponsors/*` - 3 routes ✅ Used
- `/api/admin/stats` - 1 route ✅ Used
- `/api/admin/submissions/*` - 4 routes ✅ Used

#### Public Routes (15 routes):
- `/api/analytics/*` - 2 routes ✅ Used
- `/api/auth/*` - 4 routes ✅ Used
- `/api/gia-goneis/load-more` - 1 route ✅ Used
- `/api/health` - 1 route ✅ Used
- `/api/newsletter` - 1 route ✅ Used
- `/api/printables/[slug]/download` - 1 route ✅ Used
- `/api/revalidate` - 1 route ✅ Used
- `/api/sponsors/*` - 3 routes (2 used, 1 unused: upload-url)
- `/api/submissions` - 1 route ✅ Used

**Total:** 25 used, 1 unused

---

## 🎯 Cleanup Recommendations

### **Phase 1: Quick Wins (Delete Unused - ~8 files)**

1. **Delete unused home components:**
   - `components/home/background-video-section.tsx`
   - `components/home/video-hero-section.tsx`
   - `components/home/featured-banner.tsx` (or verify if FeaturedBanner type is used)

2. **Delete unused analytics components:**
   - `components/analytics/google-analytics.tsx`
   - `components/analytics/google-analytics-manual.tsx`

3. **Delete unused API route:**
   - `app/api/sponsors/upload-url/route.ts`

4. **Delete unused form component:**
   - `components/forms/inline-quick-form.tsx` - **VERIFIED NOT USED**

**Note:** `components/home/featured-banner.tsx` component is unused, but `FeaturedBanner` TYPE is used in `lib/content/index.ts` and Sanity schema. Delete component, keep type.

**Estimated reduction: 7 files**

### **Phase 2: Fix Orphaned Code (Testimonials)**

**Option A: Restore Testimonial Feature**
- Re-add `testimonial` to `sanity/schemas/index.ts`
- Keep all testimonial-related code

**Option B: Remove Testimonial Feature** (Recommended if not needed)
- Delete `sanity/schemas/documents/testimonial.ts`
- Delete `components/home/testimonials-section.tsx`
- Remove `testimonialsQuery` from `lib/sanity/queries.ts`
- Remove `getTestimonials()` from `lib/content/index.ts`
- Remove testimonial calls from `app/page.tsx`
- Remove testimonial prop from `components/home/home-page.tsx`

**Estimated reduction: 5-6 files (if Option B)**

### **Phase 3: Consolidation Opportunities** (Optional - ~10-15 files)

1. **Merge small utility components:**
   - Consider merging `article-meta.tsx` into `article-header.tsx` (if only used there)
   - Consider merging `success-message.tsx` into form components (if only used there)

2. **Consolidate form components:**
   - `inline-quick-form.tsx`, `video-idea-form.tsx`, `qa-form.tsx` share similar structure
   - Could create a base form component with variants

3. **Simplify analytics:**
   - Already identified unused ones above

**Note:** Consolidation may reduce maintainability. Only do if files are truly redundant.

---

## 📈 Expected Results

### After Phase 1 (Quick Wins):
- **193 → ~185 files** (-8 files, ~4% reduction)

### After Phase 2 (Fix Orphaned Code - Option B):
- **185 → ~179 files** (-6 files, ~3% reduction)
- **Total: 193 → ~179 files** (-14 files, ~7% reduction)

### After Phase 3 (Consolidation - if done):
- **179 → ~165-170 files** (-9-14 files, ~5-8% reduction)
- **Total: 193 → ~165-170 files** (-23-28 files, ~12-15% reduction)

---

## 🎯 Realistic Target

For a **9-15 page app**, a reasonable file count would be:
- **Pages:** ~15-20 files (app routes)
- **API Routes:** ~15-20 files (reasonable for admin + public APIs)
- **Components:** ~40-50 files (well-organized, reusable)
- **Lib/Utils:** ~20-25 files (utilities, queries, configs)
- **Sanity Schemas:** ~20-25 files (necessary for CMS)
- **Hooks/Scripts:** ~5-10 files

**Total Target: ~115-150 files** (vs current 193)

**Gap: ~43-78 files** (22-40% reduction needed)

---

## ✅ Action Plan

### Immediate Actions (Do Now):
1. ✅ Delete 7 unused files (Phase 1) - **VERIFIED**
2. ✅ Fix testimonial orphaned code (Phase 2 - choose Option A or B)
3. ✅ **COMPLETED:** Verified `inline-quick-form.tsx` - NOT USED, safe to delete

### Future Considerations:
- Review if all 26 API routes are necessary
- Consider consolidating similar form components
- Evaluate if all article/sponsor components need separate files

---

## 📝 Notes

- **UI Components (16 files):** These are shadcn/ui components - **DO NOT DELETE**. They're necessary.
- **Sanity Schemas (27 files):** These are necessary for CMS structure - **DO NOT DELETE**.
- **API Routes:** Most are used. Only 1 unused route found.
- **Component Organization:** Most components are well-organized. The issue is unused/duplicate components, not over-organization.

---

## ✅ Verification Completed

1. ✅ `components/forms/inline-quick-form.tsx` - **VERIFIED NOT USED** - Safe to delete
2. ✅ `components/home/featured-banner.tsx` - **VERIFIED:** Component unused, but `FeaturedBanner` TYPE is used in `lib/content/index.ts` and Sanity schema. Delete component, keep type.
3. ⚠️ **Testimonial feature** - **NEEDS DECISION:** Schema deleted but code still references it. Choose Option A (restore) or Option B (remove all code).
