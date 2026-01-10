# 📦 Barrel Files Analysis (index.ts re-exports)

## Found Barrel Files

### 1. `components/sponsors/index.ts` ⚠️ **QUESTIONABLE**

**Content:**
```typescript
export { SponsorsSection } from './sponsors-section';
export { SponsorCard, type Sponsor } from './sponsor-card';
export { BecomeSponsorCard } from './become-sponsor-card';
export { SponsorsCarousel } from './sponsors-carousel';
export { SponsorsSkeleton } from './sponsors-skeleton';
```

**Used in 3 places:**
- `app/page.tsx`: `import { type Sponsor } from "@/components/sponsors"`
- `lib/content/index.ts`: `import { type Sponsor } from "@/components/sponsors"`
- `components/home/home-page.tsx`: `import { SponsorsSection, type Sponsor } from "@/components/sponsors"`

**Benefit:**
- Cleaner imports: `from "@/components/sponsors"` vs `from "@/components/sponsors/sponsor-card"`

**Cost:**
- Extra file (1 file)
- Extra indirection (harder to trace)
- No actual value added

**Recommendation:** ❌ **REMOVE** - Update imports to use direct paths

---

### 2. `sanity/schemas/index.ts` ✅ **NECESSARY**

**Content:**
```typescript
// Imports all schemas
// Exports as array for Sanity config
export default schemas;
```

**Used in:**
- `sanity.config.ts`: `import schemas from "./sanity/schemas"`

**Benefit:**
- ✅ **Required by Sanity CMS** - Must aggregate all schemas
- ✅ Single entry point for schema registration
- ✅ Makes it easy to add/remove schemas

**Recommendation:** ✅ **KEEP** - Required by framework

---

### 3. `lib/content/index.ts` ✅ **NOT A BARREL FILE**

**Content:**
- 1000+ lines of actual logic
- Functions, types, interfaces
- Data fetching logic
- NOT just re-exports

**Recommendation:** ✅ **KEEP** - This is a real module, not a barrel file

---

## Analysis: `components/sponsors/index.ts`

### Current Usage

**3 imports using barrel:**
```typescript
// app/page.tsx
import { type Sponsor } from "@/components/sponsors";

// lib/content/index.ts
import { type Sponsor } from "@/components/sponsors";

// components/home/home-page.tsx
import { SponsorsSection, type Sponsor } from "@/components/sponsors";
```

### If We Remove Barrel File

**Direct imports:**
```typescript
// app/page.tsx
import { type Sponsor } from "@/components/sponsors/sponsor-card";

// lib/content/index.ts
import { type Sponsor } from "@/components/sponsors/sponsor-card";

// components/home/home-page.tsx
import { SponsorsSection } from "@/components/sponsors/sponsors-section";
import { type Sponsor } from "@/components/sponsors/sponsor-card";
```

### Trade-offs

**Remove Barrel:**
- ✅ One less file
- ✅ Direct imports (easier to trace)
- ✅ No indirection
- ❌ Slightly longer import paths

**Keep Barrel:**
- ✅ Shorter import paths
- ❌ Extra file
- ❌ Extra indirection
- ❌ Harder to trace where things come from

## Recommendation

**Remove `components/sponsors/index.ts`** and update imports to direct paths.

**Reasoning:**
- Only 3 imports to update
- Removes unnecessary indirection
- Makes codebase simpler
- No real benefit from barrel file for 5 components

**Impact:**
- -1 file
- 3 files to update (simple find/replace)
