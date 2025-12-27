# `any` Types Analysis & Fix Plan

## Overview

This document analyzes all `any` types in the codebase, categorizes them, and provides a plan for fixing or documenting them.

---

## Categories of `any` Types

### 1. **PortableText Components** (Legitimate but can be improved)
**Files:**
- `components/activities/activity-content.tsx:41,69,162,228`
- `components/articles/article-content.tsx` (similar pattern)
- `components/printables/printable-content.tsx:16,38`

**Why `any` is used:**
- PortableText library expects flexible types for custom components
- Sanity image values don't have strict TypeScript types
- Link mark values are dynamic

**Can we fix it?** ✅ YES - Create proper interfaces for image and link values

**Fix:**
```typescript
interface SanityImageValue {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
  caption?: string;
}

interface PortableTextLinkValue {
  href?: string;
  blank?: boolean;
}
```

---

### 2. **Error Handling** (Can be improved)
**Files:**
- `components/forms/video-idea-form.tsx:62`
- `components/forms/qa-form.tsx:63`
- `components/forms/unified-contact-form.tsx:153`
- `components/forms/inline-quick-form.tsx:92`

**Why `any` is used:**
- Common TypeScript pattern: `catch (err: any)`
- Error objects can have any shape

**Can we fix it?** ✅ YES - Use `unknown` instead, then type guard

**Fix:**
```typescript
catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Κάτι πήγε στραβά";
  setError(message);
}
```

---

### 3. **Form Payloads** (Can be improved)
**Files:**
- `components/forms/unified-contact-form.tsx:76`
- `components/forms/inline-quick-form.tsx:51`

**Why `any` is used:**
- Quick prototyping
- Dynamic form structure

**Can we fix it?** ✅ YES - Create proper interfaces

**Fix:**
```typescript
interface SubmissionPayload {
  type: string;
  name?: string;
  email?: string;
  message: string;
  // ... etc
}
```

---

### 4. **Sanity Query Results** (Partially necessary)
**Files:**
- `lib/utils/sanity.ts:106` - `textToPortableText` returns `any[]`
- `lib/sanity/write-client.ts:59` - `answer: any` (PortableText)
- `lib/content/index.ts:413,542` - Filter callbacks with `any`

**Why `any` is used:**
- PortableText structure is complex and dynamic
- Sanity query results are not always strictly typed
- Filter callbacks need flexibility

**Can we fix it?** ⚠️ PARTIAL - Some can use `unknown` or proper types

**Fix:**
- `textToPortableText`: Return `PortableTextBlock[]` instead of `any[]`
- Filter callbacks: Use proper types from interfaces

---

### 5. **External Library Types** (Necessary)
**Files:**
- `components/ads/ad-unit.tsx:15` - `window.adsbygoogle: any[]`

**Why `any` is used:**
- Google AdSense doesn't provide TypeScript types
- Global window augmentation

**Can we fix it?** ❌ NO - External library limitation

**Action:** Document why it's necessary

---

### 6. **Scripts** (Low priority)
**Files:**
- `scripts/find-article-references.ts` - Multiple `any` types
- `scripts/create-curated-collections.ts` - Multiple `any` types

**Why `any` is used:**
- One-off scripts, not production code
- Quick iteration, less strict typing needed

**Can we fix it?** ✅ YES - But low priority

---

### 7. **Type Assertions** (Necessary for now)
**Files:**
- `components/activities/activity-content.tsx:162,228` - `components={portableTextComponents as any}`
- `app/api/analytics/views/route.ts:72` - `content_type as any`
- `lib/utils/content.ts:158` - `child: any` in forEach

**Why `any` is used:**
- Type mismatch between library types and our usage
- PortableText component types are complex
- Content type unions need narrowing

**Can we fix it?** ⚠️ PARTIAL - Some can be improved with better types

---

## Fix Priority

### High Priority (Fix Now)
1. ✅ Error handling - Change `catch (err: any)` to `catch (err: unknown)`
2. ✅ Form payloads - Create proper interfaces
3. ✅ PortableText image/link values - Create interfaces

### Medium Priority (Fix Soon)
4. ⚠️ Sanity query results - Improve where possible
5. ⚠️ Type assertions - Improve with better types

### Low Priority (Document or Fix Later)
6. 📝 Scripts - Fix when time permits
7. 📝 External libraries - Document why `any` is necessary

---

## Summary

**Total `any` instances:** ~30
**Can be fixed:** ~20 (67%)
**Necessary/acceptable:** ~10 (33%)

**Recommendation:** Fix high-priority items now, document the rest.

