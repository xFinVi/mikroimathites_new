# Developer Guide - Μικροί Μαθητές

**Welcome to the team!** This guide will help you understand the codebase, architecture, and development patterns used in this project.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Development Patterns](#development-patterns)
5. [Getting Started](#getting-started)
6. [Key Concepts](#key-concepts)
7. [Code Style & Conventions](#code-style--conventions)
8. [Common Tasks](#common-tasks)
9. [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │  ← Frontend (React 19, TypeScript)
│   (App Router)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Sanity │ │Supabase│
│  CMS  │ │  DB    │
└───────┘ └────────┘
```

**Key Principles:**
- **Server-First:** Most data fetching happens on the server (Server Components)
- **Type Safety:** Full TypeScript coverage
- **Separation of Concerns:** Clear boundaries between UI, data, and business logic
- **Performance:** ISR (Incremental Static Regeneration) for content pages
- **Maintainability:** Centralized constants, utilities, and type definitions

### Data Flow

1. **Content (Sanity CMS):**
   - Content editors manage articles, activities, recipes, etc. in Sanity Studio
   - Content is fetched via GROQ queries in Server Components
   - Images are optimized via Sanity CDN

2. **User Data (Supabase):**
   - Submissions (questions, feedback, video ideas)
   - Newsletter subscriptions
   - Admin authentication
   - Analytics tracking

3. **Rendering:**
   - Static pages: Pre-rendered at build time (ISR)
   - Dynamic pages: Rendered on-demand with caching
   - API routes: Handle form submissions, admin operations

---

## 🛠️ Tech Stack

### Core
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type safety
- **React 19** - UI library
- **Tailwind CSS** - Utility-first styling

### UI Components
- **shadcn/ui** - Accessible component library (Radix UI primitives)
- **Lucide React** - Icon library

### Backend Services
- **Sanity CMS** - Headless CMS for content
- **Supabase** - PostgreSQL database + Auth
- **Resend** - Email service
- **NextAuth.js v5** - Authentication

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **tsx** - TypeScript execution for scripts

---

## 📁 Project Structure

```
mikroi-mathites/
├── app/                          # Next.js App Router (pages & API routes)
│   ├── admin/                    # Admin dashboard (protected routes)
│   │   ├── dashboard/           # Dashboard overview
│   │   └── submissions/         # Submission management
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin-only API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── submissions/         # Public submission endpoints
│   │   └── ...                  # Other API routes
│   ├── gia-goneis/              # "For Parents" section
│   ├── drastiriotites/          # Activities section
│   ├── epikoinonia/             # Contact page
│   ├── sxetika/                 # About page
│   ├── support/                 # Donation/support page
│   ├── studio/                  # Sanity Studio (embedded)
│   └── layout.tsx               # Root layout
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Header, footer, navigation
│   ├── forms/                   # Form components
│   ├── admin/                   # Admin dashboard components
│   ├── activities/              # Activity-specific components
│   ├── articles/                # Article-specific components
│   └── ...                      # Other feature components
│
├── lib/                         # Core utilities and business logic
│   ├── constants/               # Centralized constants
│   │   ├── admin.ts            # Admin dashboard constants
│   │   ├── gia-goneis.ts       # "For Parents" page constants
│   │   └── ...                 # Other page constants
│   ├── content/                 # Content layer (Sanity queries)
│   │   └── index.ts            # Main content fetching functions
│   ├── sanity/                  # Sanity client & utilities
│   │   ├── client.ts           # Sanity client setup
│   │   ├── queries.ts          # GROQ queries
│   │   ├── image-url.ts        # Image URL generation
│   │   └── write-client.ts     # Sanity write operations
│   ├── supabase/                # Supabase client
│   ├── auth/                    # Authentication utilities
│   ├── email/                   # Email service (Resend)
│   ├── seo/                     # SEO metadata generation
│   ├── utils/                   # General utilities
│   │   ├── logger.ts           # Production-safe logging
│   │   ├── content-url.ts      # URL generation helpers
│   │   └── ...                 # Other utilities
│   └── types/                   # TypeScript type definitions
│
├── hooks/                       # Custom React hooks
│   ├── use-content-tracking.ts # Content view tracking
│   └── use-cookie-consent.ts   # Cookie consent management
│
├── sanity/                      # Sanity Studio configuration
│   └── schemas/                 # Content schemas
│       ├── documents/          # Document types (article, activity, etc.)
│       └── objects/            # Object types (reusable fields)
│
├── supabase/                    # Database migrations
│   └── migrations/             # SQL migration files
│
├── scripts/                     # Utility scripts
│   ├── create-curated-collections.ts
│   └── resend-api-keys.ts
│
└── public/                      # Static assets
    └── images/                  # Image files
```

---

## 🎯 Development Patterns

### 1. Server Components (Default)

**When to use:** Most components should be Server Components by default.

```typescript
// ✅ Server Component (default)
export default async function Page() {
  const articles = await getArticles();
  return <ArticlesList articles={articles} />;
}
```

**Benefits:**
- No JavaScript bundle sent to client
- Direct database/CMS access
- Better SEO
- Faster initial load

### 2. Client Components (When Needed)

**When to use:** Only when you need interactivity (useState, useEffect, event handlers).

```typescript
// ✅ Client Component (when needed)
"use client";

import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  // ... interactive logic
}
```

**Rule:** Always add `"use client"` at the top when using client-side features.

### 3. Data Fetching Pattern

**Server Components:**
```typescript
// app/page.tsx
import { getArticles } from "@/lib/content";

export default async function HomePage() {
  // Fetch on server
  const articles = await getArticles();
  return <ArticlesList articles={articles} />;
}
```

**API Routes:**
```typescript
// app/api/submissions/route.ts
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const data = await request.json();
  // Process and save to Supabase
  const result = await supabaseAdmin.from("submissions").insert(data);
  return NextResponse.json(result);
}
```

### 4. Error Handling Pattern

**Always use try-catch with fallbacks:**
```typescript
export default async function Page() {
  let articles: Article[] = [];
  try {
    articles = await getArticles();
  } catch (error) {
    logger.error("Failed to fetch articles:", error);
    // Graceful degradation - page still renders
  }
  
  return <ArticlesList articles={articles} />;
}
```

### 5. Constants Pattern

**Centralize magic numbers and configuration:**
```typescript
// lib/constants/gia-goneis.ts
export const GIA_GONEIS_CONSTANTS = {
  PAGE_SIZE: 18,
  SEARCH_DEBOUNCE_MS: 500,
  IMAGE_SIZES: {
    CARD: { width: 400, height: 250 },
  },
} as const;
```

**Usage:**
```typescript
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";

const pageSize = GIA_GONEIS_CONSTANTS.PAGE_SIZE;
```

### 6. Type Safety Pattern

**Always define types, avoid `any`:**
```typescript
// lib/types/submission.ts
export interface Submission {
  id: string;
  type: "question" | "feedback" | "video_idea" | "review";
  // ...
}

// Usage
import type { Submission } from "@/lib/types/submission";

function processSubmission(submission: Submission) {
  // Type-safe!
}
```

### 7. Image Optimization Pattern

**Always use `generateImageUrl` for Sanity images:**
```typescript
import { generateImageUrl } from "@/lib/sanity/image-url";
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";

const imageUrl = generateImageUrl(
  article.coverImage,
  GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.width,
  GIA_GONEIS_CONSTANTS.IMAGE_SIZES.CARD.height
);
```

### 8. URL Generation Pattern

**Use `getContentUrl` for type-safe URLs:**
```typescript
import { getContentUrl } from "@/lib/utils/content-url";

const articleUrl = getContentUrl("article", article.slug);
// Returns: "/gia-goneis/article-slug"
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd mikroi-mathites
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```bash
# Sanity
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-01

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (for admin)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=your-resend-key
ADMIN_EMAIL=admin@example.com

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your-ga-id
```

### 3. Run Database Migrations

In Supabase Dashboard → SQL Editor, run:
- `supabase/migrations/create-newsletter-subscriptions.sql`
- `supabase/migrations/create-content-views.sql` (if using analytics)

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Access Sanity Studio

Visit `http://localhost:3000/studio` to manage content.

---

## 🔑 Key Concepts

### Content Types

**Articles** (`/gia-goneis/[slug]`)
- Educational content for parents
- Categories, tags, age groups
- Featured articles system

**Recipes** (`/gia-goneis/recipes/[slug]`)
- Cooking recipes
- Ingredients, instructions
- Age-appropriate recipes

**Activities** (`/drastiriotites/[slug]`)
- Hands-on activities for kids
- Structured steps with images
- Materials and goals

**Printables** (`/drastiriotites/printables/[slug]`)
- Downloadable PDFs
- Activity sheets, coloring pages

**Q&A Items** (`/epikoinonia`)
- Published Q&A from user submissions
- Categorized by topic

### Admin Dashboard

**Access:** `/admin/dashboard` (requires authentication)

**Features:**
- View all user submissions
- Reply to questions/feedback
- Publish Q&A to Sanity
- Manage submission status

**Authentication:**
- Uses NextAuth.js with Supabase Auth
- Admin role required (`user_metadata.role = "admin"`)

### Email Templates

**Location:** `lib/constants/email-templates.ts`

**Usage:**
- Pre-defined templates for common responses
- Auto-fills variables (name, question, etc.)
- Accessible via dropdown in admin dashboard

### Constants Files

Each major page/section has a constants file:
- `lib/constants/admin.ts` - Admin dashboard
- `lib/constants/gia-goneis.ts` - For Parents page
- `lib/constants/drastiriotites.ts` - Activities page
- `lib/constants/contact.ts` - Contact page

**Purpose:** Centralize configuration, magic numbers, image sizes.

---

## 📝 Code Style & Conventions

### Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `article-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `content-url.ts`)
- Constants: `kebab-case.ts` (e.g., `gia-goneis.ts`)

**Components:**
- PascalCase: `ArticleCard`, `SubmissionsAdmin`
- Descriptive names: `ActivityContent`, not `Content`

**Functions:**
- camelCase: `getArticles()`, `generateImageUrl()`
- Verb + noun: `fetchSubmissions()`, `createQADraft()`

**Constants:**
- UPPER_SNAKE_CASE: `PAGE_SIZE`, `SEARCH_DEBOUNCE_MS`
- Grouped in objects: `GIA_GONEIS_CONSTANTS.PAGE_SIZE`

### TypeScript

**Always type:**
```typescript
// ✅ Good
interface Props {
  title: string;
  count: number;
}

// ❌ Bad
function Component(props: any) { }
```

**Use type imports:**
```typescript
// ✅ Good
import type { Article } from "@/lib/content";

// ❌ Bad
import { Article } from "@/lib/content"; // if only used as type
```

### Component Structure

```typescript
"use client"; // Only if needed

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  title: string;
}

export function Component({ title }: ComponentProps) {
  // Hooks
  const [state, setState] = useState("");
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

### Styling

**Tailwind CSS classes:**
- Use design tokens: `bg-primary-pink`, `text-text-dark`
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Consistent spacing: `p-4`, `gap-6`, `mt-8`

**Example:**
```typescript
<div className="bg-background-white rounded-lg p-6 shadow-sm border border-gray-200">
  <h2 className="text-2xl font-bold text-text-dark mb-4">
    {title}
  </h2>
</div>
```

### Logging

**Use logger utility (not console.log):**
```typescript
import { logger } from "@/lib/utils/logger";

// ✅ Good
logger.error("Failed to fetch:", error);
logger.info("User action:", data);

// ❌ Bad
console.log("Debug info");
console.error("Error:", error);
```

---

## 🔧 Common Tasks

### Adding a New Page

1. **Create page file:**
```typescript
// app/new-page/page.tsx
import { generateMetadataFor } from "@/lib/seo/generate-metadata";

export const metadata = generateMetadataFor("new-page");

export default async function NewPage() {
  return <div>New Page</div>;
}
```

2. **Add to navigation:**
```typescript
// components/layout/navigation.tsx
const navItems = [
  // ...
  { label: "New Page", href: "/new-page" },
];
```

3. **Add SEO config:**
```typescript
// lib/seo/config.ts
export const seoConfig = {
  // ...
  "new-page": {
    title: "New Page | Μικροί Μαθητές",
    description: "...",
  },
};
```

### Adding a New Content Type

1. **Create Sanity schema:**
```typescript
// sanity/schemas/documents/newContent.ts
export const newContent = defineType({
  name: "newContent",
  title: "New Content",
  type: "document",
  fields: [
    // ...
  ],
});
```

2. **Register in schemas:**
```typescript
// sanity/schemas/index.ts
import { newContent } from "./documents/newContent";
// Add to schemas array
```

3. **Create content fetching function:**
```typescript
// lib/content/index.ts
export async function getNewContent(): Promise<NewContent[]> {
  // GROQ query
}
```

4. **Create page and components:**
- `app/new-content/page.tsx`
- `components/new-content/new-content-card.tsx`

### Adding a New API Route

```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function GET(request: Request) {
  try {
    // Your logic
    return NextResponse.json({ data: "result" });
  } catch (error) {
    logger.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Adding a New Constant

```typescript
// lib/constants/new-page.ts
export const NEW_PAGE_CONSTANTS = {
  PAGE_SIZE: 20,
  IMAGE_SIZES: {
    CARD: { width: 400, height: 250 },
  },
} as const;
```

### Creating a Reusable Component

1. **Create component:**
```typescript
// components/shared/my-component.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

2. **Export from index (if creating a folder):**
```typescript
// components/shared/index.ts
export { MyComponent } from "./my-component";
```

---

## ✅ Best Practices

### Performance

1. **Use Server Components by default**
2. **Implement ISR for content pages:**
```typescript
export const revalidate = 600; // 10 minutes
```

3. **Optimize images:**
- Always use `generateImageUrl` with proper dimensions
- Use Next.js `Image` component

4. **Debounce search inputs:**
```typescript
const [debouncedSearch, setDebouncedSearch] = useState("");
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### Security

1. **Never expose secrets:**
- Use `NEXT_PUBLIC_` prefix only for public env vars
- Server-side env vars are automatically secure

2. **Validate user input:**
```typescript
if (!email || !email.includes("@")) {
  return NextResponse.json({ error: "Invalid email" }, { status: 400 });
}
```

3. **Protect admin routes:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check authentication
}
```

### Code Quality

1. **Remove unused code:**
- Delete commented code
- Remove unused imports
- Clean up debug files

2. **Keep functions small:**
- Single responsibility
- Max 50-100 lines per function

3. **Document complex logic:**
```typescript
/**
 * Fetches articles with pagination and filtering
 * @param page - Page number (1-indexed)
 * @param filters - Filter options
 * @returns Paginated articles
 */
export async function getArticles(page: number, filters: Filters) {
  // ...
}
```

4. **Handle errors gracefully:**
```typescript
try {
  const data = await fetchData();
} catch (error) {
  logger.error("Error:", error);
  // Fallback or empty state
  return [];
}
```

### Testing

1. **Test locally before committing**
2. **Check TypeScript errors:**
```bash
npm run build
```

3. **Check linting:**
```bash
npm run lint
```

---

## 📚 Additional Resources

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Sanity:** https://www.sanity.io/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

### Internal Docs
- [README.md](README.md) - Quick start guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete project overview and summary

### Getting Help

1. **Check existing code** - Similar patterns likely exist
2. **Review constants files** - Configuration might be there
3. **Check utilities** - Reusable functions in `lib/utils/`
4. **Ask the team** - Don't hesitate to ask questions!

---

## 🎯 Quick Reference

### Common Imports

```typescript
// Components
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

// Content
import { getArticles } from "@/lib/content";

// Utilities
import { generateImageUrl } from "@/lib/sanity/image-url";
import { getContentUrl } from "@/lib/utils/content-url";
import { logger } from "@/lib/utils/logger";

// Constants
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";

// Types
import type { Article } from "@/lib/content";
```

### Common Patterns

```typescript
// Server Component with data fetching
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Client Component with state
"use client";
export function InteractiveComponent() {
  const [state, setState] = useState("");
  return <div>{state}</div>;
}

// API Route
export async function POST(request: Request) {
  const body = await request.json();
  // Process
  return NextResponse.json({ success: true });
}
```

---

**Happy coding! 🚀**

If you have questions or need clarification, don't hesitate to ask the team.


