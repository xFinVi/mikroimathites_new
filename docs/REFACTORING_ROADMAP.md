# Refactoring Roadmap

## Completed

- ✅ Phase 1: Documentation & Quick Wins (Dec 2025)
- ✅ Phase 2: Utility Consolidation (Dec 2025)
- ✅ Phase 3: Infrastructure Optimization (Dec 2025)

## Summary of Changes

- Documentation files: 9 → 2 (at root)
- Utility files: 9 → 5
- API routes: 14 → 13
- Added server/client boundary protections
- Centralized Sanity configuration
- Improved code documentation

## Phase 1: Documentation & Quick Wins

**Completed**: Dec 2025

### Changes Made

1. **Documentation Reorganization**:
   - Created `docs/` folder structure with `setup/` and `features/` subdirectories
   - Consolidated 7 markdown files into 4 organized files
   - Updated README.md and DEVELOPER_GUIDE.md with new documentation links
   - Deleted old documentation files from root

2. **Deprecated Code Cleanup**:
   - Removed deprecated `createQAItemInSanity` function
   - Deleted deprecated `/api/admin/qa/publish` route
   - Removed `handlePublishToQA` function from admin component

3. **API Route Consolidation**:
   - Merged `/api/analytics/view` into `/api/analytics/views`
   - Added `export const dynamic = "force-dynamic"` for live view counts
   - Added explicit `cache-control: no-store` headers
   - Added explicit 405 handlers for unsupported methods

## Phase 2: Utility Consolidation

**Completed**: Dec 2025

### Changes Made

1. **Created Consolidated Files**:
   - `lib/utils/content.ts` - Merged 4 files (content-url, content-utils, category-mapping, article-stats)
   - `lib/utils/forms.ts` - Merged 2 files (submission-labels, html-escape)
   - `lib/utils/sanity.ts` - Renamed from sanity-mapping.ts with `import "server-only"` guard
   - Updated `lib/utils/age-groups.ts` with usage comments

2. **Migration Strategy**:
   - Step 1: Created compat layer (re-exports)
   - Step 2: Updated all imports across ~20 files
   - Step 3: Deleted compat files after verification

3. **Safety Measures**:
   - Verified zero old imports before deletion
   - Added server-only guards where needed
   - Maintained identical export signatures during migration

## Phase 3: Infrastructure Optimization

**Completed**: Dec 2025

### Changes Made

1. **Sanity Configuration Consolidation**:
   - Created `lib/sanity/config.public.ts` - Safe for all contexts
   - Created `lib/sanity/config.server.ts` - Server-only secrets with lazy resolution
   - Updated `lib/sanity/client.ts` to use public config
   - Updated `lib/sanity/write-client.ts` to use server config with lazy initialization
   - Updated `sanity.config.ts` to use public config

2. **Safety Features**:
   - Lazy validation (at usage, not import time)
   - Server-only guards on secret-containing modules
   - Graceful degradation for missing config
   - Clear error messages with setup instructions

## Future Phases (Deferred)

### Phase 4: Content Layer Optimization

**Goal**: Simplify data fetching architecture  
**Effort**: 4-6 hours  
**Status**: Deferred - current approach works, optimize when pain points emerge

**Context**: `lib/content/index.ts` is 851 lines with 28 async functions

**Options**:

1. **Split into focused modules**:
   - `lib/content/articles.ts`
   - `lib/content/activities.ts`
   - `lib/content/shared.ts`

2. **Migrate to direct Server Component fetching** (Next.js recommended):
   - Move GROQ queries directly into page.tsx files
   - Keep only shared transforms/utilities in lib/content
   - Pros: More explicit, easier per-page optimization
   - Cons: More boilerplate, potential duplication

3. **Keep current centralized approach**:
   - If it ain't broke, don't fix it
   - Performance is good, changes are infrequent

**Decision Criteria**: Optimize if/when:
- Performance becomes an issue
- Need per-page query optimization
- Team size grows and explicit is better than DRY

### Phase 5: Component Consolidation

**Goal**: Reduce form component duplication  
**Effort**: 2-3 hours  
**Status**: Deferred - current separation is maintainable

**Candidates**:
- `components/forms/qa-form.tsx`
- `components/forms/feedback-form-tab.tsx`
- `components/forms/video-idea-form.tsx`

**Consideration**: Could consolidate into generic `SubmissionForm` component.

**Trade-off**:
- Explicit separate forms are easier to modify independently
- Generic component adds complexity for marginal benefit
- Current approach: each form is self-contained and clear

**Decision**: Keep explicit until duplication becomes painful

### Phase 6: Utility Location Optimization

**Goal**: Move single-use utilities closer to usage  
**Effort**: 1-2 hours  
**Status**: Deferred - marked with TODO comments in Phase 2

**Actions**:
- `lib/utils/age-groups.ts` → `app/age/` if only used in age routes
- `lib/utils/sanity.ts` → `lib/sanity/` if usage stays narrow
- Re-evaluate after 3-6 months of usage patterns

**Decision Criteria**: Move to app/ folder if:
- Used in only 1-2 files in same route segment
- No other routes need the utility
- Co-location improves cohesion

## Lessons Learned

### What Worked Well

- Phased approach with independent test criteria
- Compat layer for smooth import migration (reviewable diffs)
- Explicit server/client boundary marking
- Usage comments in consolidated files
- Lazy config validation (at usage, not import)

### Watch Out For

- Import-time explosions in multi-runtime contexts (Studio + Next.js)
- Server-only code accidentally imported in client components
- Broken markdown links after docs reorganization
- Bundle size increases from consolidation
- Pre-existing TypeScript errors unrelated to refactoring

### Best Practices Established

- Always use `import 'server-only'` for server-side modules
- Lazy config validation (at usage, not import)
- Explicit function signatures during consolidation
- Verify zero old imports before deleting compat files
- Split public/server configs to prevent import-time failures
- Add comprehensive usage comments to consolidated files

## Metrics

### Before Refactoring

- Documentation files (root): 9
- Utility files: 9
- API routes: 14
- Lines of utility code: ~800
- Files with utility imports: ~30

### After Refactoring

- Documentation files (root): 2
- Utility files: 5
- API routes: 13
- Lines of utility code: ~600
- Files with utility imports: ~20
- Reduction: ~44% fewer utility files, ~25% less code

## Next Steps

1. **Monitor for pain points**: Watch for performance issues or maintenance difficulties
2. **Evaluate Phase 4**: If content fetching becomes complex, consider splitting `lib/content/index.ts`
3. **Review utility locations**: After 3-6 months, assess if single-use utilities should move closer to usage
4. **Continue documentation**: Keep docs up-to-date as architecture evolves

