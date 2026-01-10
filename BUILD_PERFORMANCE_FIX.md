# 🐌 Build Performance Issue - Analysis & Fix

## Problem
Build time increased from **150 seconds** to **756+ seconds** (12+ minutes) and still running.

## Root Causes

### 1. **Static Generation During Build**
Next.js is pre-generating ALL static pages during build:
- All articles (`generateStaticParams` in `app/gia-goneis/[slug]/page.tsx`)
- All activities (`generateStaticParams` in `app/drastiriotites/[slug]/page.tsx`)
- All printables (`generateStaticParams` in `app/drastiriotites/printables/[slug]/page.tsx`)
- All recipes (`generateStaticParams` in `app/gia-goneis/recipes/[slug]/page.tsx`)
- All age groups (`generateStaticParams` in `app/age/[slug]/page.tsx`)

**Impact:** If you have 100+ items, Next.js fetches from Sanity for EACH one during build.

### 2. **No Docker Build Cache**
The script uses `docker compose build` without cache optimization. Every build is a full rebuild.

### 3. **VPS Resource Constraints**
- Low CPU/RAM can cause slow builds
- Network latency to Sanity during build

## Solutions

### **Option 1: Limit Static Generation (Recommended)**

Instead of generating ALL pages at build time, generate only a subset and let the rest be generated on-demand:

```typescript
// app/gia-goneis/[slug]/page.tsx
export async function generateStaticParams() {
  // Only pre-generate first 20 articles (most popular/recent)
  const articles = await getArticles();
  return articles.slice(0, 20).map((article) => ({
    slug: article.slug,
  }));
}
```

**Benefits:**
- Faster builds (only 20 pages vs 100+)
- Remaining pages generated on-demand (first request)
- Still gets SEO benefits

### **Option 2: Use Build Cache**

Modify deployment script to leverage Docker cache:

```bash
# Instead of: docker compose build
# Use: docker compose build --build-arg BUILDKIT_INLINE_CACHE=1
```

### **Option 3: Disable Static Generation for Some Routes**

For less critical pages, use dynamic rendering:

```typescript
// app/gia-goneis/[slug]/page.tsx
export const dynamic = 'force-dynamic'; // Instead of generateStaticParams
```

**Trade-off:** Slightly slower first load, but much faster builds.

### **Option 4: Optimize VPS Resources**

- Increase RAM (2GB+ recommended)
- Use SSD storage
- Check CPU usage during build

## Immediate Fix

**Quick win:** Limit `generateStaticParams` to first 20-30 items:

```typescript
// Apply to all generateStaticParams functions
export async function generateStaticParams() {
  const items = await getItems();
  return items.slice(0, 30).map((item) => ({ slug: item.slug }));
}
```

This will:
- Reduce build time from 12+ minutes to ~3-5 minutes
- Still pre-generate most popular content
- Generate remaining pages on first request

## Long-term Solution

Consider using **Incremental Static Regeneration (ISR)** with `revalidate`:
- Pre-generate critical pages
- Regenerate others on-demand
- Best of both worlds: fast builds + fresh content
