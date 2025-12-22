# Mikroi Mathites - Architecture & Developer Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Data Structure](#data-structure)
4. [Backend Connections](#backend-connections)
5. [File Structure](#file-structure)
6. [Data Flow](#data-flow)
7. [API Routes](#api-routes)
8. [Frontend Components](#frontend-components)
9. [Potential Issues & Considerations](#potential-issues--considerations)

---

## Overview

**Mikroi Mathites** is a modern Parent Hub application built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. The application serves as a content platform for parents with children aged 0-6 years, providing articles, recipes, activities, printables, and Q&A content.

### Tech Stack

- **Framework:** Next.js 16.0.10 (App Router with Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** shadcn/ui (Radix UI primitives)
- **CMS:** Sanity.io (headless CMS for content management)
- **Database:** Supabase (PostgreSQL for user submissions)
- **Image Optimization:** Next.js Image component + Sanity CDN
- **Deployment:** Vercel (optimized for Next.js)

---

## Architecture Decisions

### Why Next.js 16 App Router?

**Decision:** Use Next.js 16 App Router instead of Pages Router

**Reasons:**
1. **Server Components by Default:** Better performance with server-side rendering, reducing JavaScript bundle size
2. **Streaming & Suspense:** Progressive page loading for better UX
3. **Better Data Fetching:** Async components, parallel data fetching with `Promise.all`
4. **Type Safety:** Better TypeScript integration with route params and search params
5. **Future-Proof:** App Router is the future of Next.js

**Trade-offs:**
- Learning curve for developers familiar with Pages Router
- Some libraries still catching up with App Router support

### Why Sanity for Content Management?

**Decision:** Use Sanity.io as headless CMS instead of traditional CMS or database-only approach

**Reasons:**
1. **Structured Content:** Rich content types with Portable Text for flexible formatting
2. **Real-time Collaboration:** Multiple editors can work simultaneously
3. **Image Optimization:** Built-in CDN with automatic image transformations
4. **Version Control:** Draft system built-in, content versioning
5. **Developer Experience:** GROQ query language is powerful and flexible
6. **Embedded Studio:** Can host Sanity Studio within the Next.js app (`/studio` route)
7. **Type Safety:** Can generate TypeScript types from schemas (though we use manual types)

**Trade-offs:**
- Learning GROQ query language
- Cost at scale (though generous free tier)
- Requires separate authentication for content editors

### Why Supabase for User Submissions?

**Decision:** Use Supabase (PostgreSQL) for user-generated content instead of Sanity or other solutions

**Reasons:**
1. **Separation of Concerns:** Content (Sanity) vs User Data (Supabase)
2. **Real-time Capabilities:** Can add real-time features later if needed
3. **Row Level Security (RLS):** Built-in security policies
4. **Cost-Effective:** Generous free tier, scales well
5. **PostgreSQL:** Full SQL database for complex queries and relationships
6. **REST API:** Easy integration with Next.js API routes
7. **Admin Dashboard:** Built-in Supabase dashboard for viewing submissions

**Trade-offs:**
- Two separate backends to manage
- Need to handle authentication separately if adding user accounts later

### Why Server Components by Default?

**Decision:** Use Server Components as default, Client Components only when needed

**Reasons:**
1. **Performance:** Smaller JavaScript bundles, faster page loads
2. **SEO:** All content rendered on server, fully indexable
3. **Security:** API keys and secrets never exposed to client
4. **Cost:** Less serverless function execution time (data fetching happens at build/request time)

**Trade-offs:**
- Need to mark components with `"use client"` for interactivity
- Some libraries require Client Components
- Hydration mismatches if not careful (we fixed this for images)

---

## Data Structure

### Sanity Content Types

All content is stored in Sanity and follows a standardized structure. Here are the main content types:

#### 1. **Article** (`article`)
- **Purpose:** Blog posts, tips, guides for parents
- **Key Fields:**
  - `title`, `slug`, `excerpt`, `body` (Portable Text)
  - `coverImage`, `secondaryImage`
  - `category` (reference), `ageGroups[]` (references), `tags[]` (references)
  - `author` (reference), `readingTime`
  - `publishedAt`, `featured`, `seo`
  - `relatedContent[]` (references to articles/recipes/activities)
- **Location:** `sanity/schemas/documents/article.ts`
- **Query:** `lib/sanity/queries.ts` → `articlesQuery`, `articleBySlugQuery`, `featuredArticlesQuery`

#### 2. **Recipe** (`recipe`)
- **Purpose:** Food recipes for children
- **Key Fields:**
  - Standard fields (title, slug, coverImage, etc.)
  - `summary`, `difficulty` (easy/medium/hard)
  - `prepTime`, `cookTime`, `servings`
  - `ingredients[]` (name, amount, notes)
  - `instructions` (Portable Text), `tips`, `nutritionNotes`
  - `category` (reference)
- **Location:** `sanity/schemas/documents/recipe.ts`
- **Query:** `lib/sanity/queries.ts` → `recipesQuery`, `recipeBySlugQuery`, `featuredRecipesQuery`

#### 3. **Activity** (`activity`)
- **Purpose:** Play activities and games for children
- **Key Fields:**
  - Standard fields
  - `summary`, `duration`
  - `goals[]`, `materials[]`, `steps[]` (Portable Text)
  - `safetyNotes`
  - `category` (reference)
- **Location:** `sanity/schemas/documents/activity.ts`
- **Query:** `lib/sanity/queries.ts` → `activitiesQuery`, `activityBySlugQuery`, `featuredActivitiesQuery`

#### 4. **Printable** (`printable`)
- **Purpose:** Downloadable PDFs and printable resources
- **Key Fields:**
  - Standard fields
  - `summary`, `file` (PDF file reference)
  - `previewImages[]`
- **Location:** `sanity/schemas/documents/printable.ts`
- **Query:** `lib/sanity/queries.ts` → `printablesQuery`, `printableBySlugQuery`, `featuredPrintablesQuery`

#### 5. **Supporting Content Types**

**Category** (`category`)
- Groups content by topic (e.g., "Sleep", "Food", "Emotions")
- Fields: `title`, `slug`, `description`, `icon`, `color`, `order`

**Age Group** (`ageGroup`)
- Defines age ranges (e.g., "0-2 years", "2-4 years")
- Fields: `title`, `slug`, `description`

**Tag** (`tag`)
- Flexible tagging system
- Fields: `title`, `slug`

**Author** (`author`)
- Content authors
- Fields: `name`, `slug`, `profilePicture`, `bio`

**QA Item** (`qaItem`)
- Q&A content displayed in accordion format
- Fields: `question`, `answer`, `ageGroups[]`, `category`, `publishedAt`

**Curated Collection** (`curatedCollection`)
- Manually curated lists of content (e.g., "Quick Tips", "Featured Content")
- Fields: `title`, `slug`, `description`, `placement` (e.g., "quick-tips"), `items[]` (references), `order`

**Page Settings** (`pageSettings`)
- Singleton document for global page settings
- Fields: `home` (hero, featuredBanner), other page-specific settings

### Supabase Database Schema

User submissions are stored in Supabase PostgreSQL database.

#### **Submissions Table** (`submissions`)

**Purpose:** Store all user-generated content (video ideas, feedback, questions, reviews)

**Schema:**
```sql
- id: uuid (primary key)
- type: enum ('video_idea', 'feedback', 'question', 'review')
- name: text (nullable)
- email: text (nullable)
- message: text (required)
- rating: int (1-5, nullable, for reviews)
- child_age_group: enum ('0_2', '2_4', '4_6', 'greek_abroad', 'other') (nullable)
- topic: enum ('sleep', 'speech', 'food', 'emotions', 'screens', 'routines', 'greek_abroad', 'other') (nullable)
- source_page: text (nullable, URL where form was submitted)
- content_slug: text (nullable, related content slug)
- is_approved: boolean (default: false, for Q&A publishing consent)
- status: enum ('new', 'read', 'archived', 'approved', 'rejected', 'published')
- admin_notes: text (nullable)
- created_at: timestamptz
- updated_at: timestamptz
```

**Indexes:**
- `submissions_status_idx` on `status`
- `submissions_type_idx` on `type`
- `submissions_created_idx` on `created_at DESC`
- `submissions_topic_idx` on `topic`
- `submissions_age_idx` on `child_age_group`

**RLS Policies:**
- Anonymous users can INSERT (submit forms)
- Service role has full access (for API routes)
- Location: `supabase/schema-submissions.sql`

#### **Submission Answers Table** (`submission_answers`)

**Purpose:** Store answers to Q&A submissions (optional, for future use)

**Schema:**
```sql
- id: uuid (primary key)
- submission_id: uuid (foreign key to submissions)
- answer: text (required)
- is_final: boolean (default: false)
- created_at: timestamptz
- updated_at: timestamptz
```

---

## Backend Connections

### Sanity Connection

#### Client Setup

**Location:** `lib/sanity/client.ts`

**Configuration:**
```typescript
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,  // Use CDN for faster responses (set false for drafts)
  token,         // Optional; required for drafts/authed reads
});
```

**Why `useCdn: true`?**
- Sanity CDN caches responses for faster delivery
- Good for production (published content)
- Set to `false` if you need fresh drafts (development)

**Environment Variables:**
- `SANITY_PROJECT_ID` - Your Sanity project ID
- `SANITY_DATASET` - Dataset name (usually "production")
- `SANITY_API_VERSION` - API version (default: "2024-03-01")
- `SANITY_TOKEN` or `SANITY_READ_TOKEN` - Read token (optional, needed for drafts)

#### Query Layer

**Location:** `lib/sanity/queries.ts`

**Structure:**
1. **Field Definitions:** Reusable field sets (`commonFields`, `articleFields`, `recipeFields`, etc.)
2. **GROQ Queries:** All queries use GROQ (Graph-Relational Object Queries)
3. **Query Functions:** Exported query strings that are used in `lib/content/index.ts`

**Example Query:**
```groq
*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]
| order(publishedAt desc)
{
  ${articleFields}
}
```

**Key Patterns:**
- `!(_id in path("drafts.**"))` - Exclude draft documents
- `defined(slug.current)` - Only include documents with slugs
- `order(publishedAt desc)` - Sort by publication date
- References: `"category": category-> { _id, title, "slug": slug.current }` - Dereference and project fields

#### Content Layer

**Location:** `lib/content/index.ts`

**Purpose:** Abstraction layer between pages and Sanity queries

**Structure:**
1. **TypeScript Interfaces:** Define types for all content (`Article`, `Recipe`, `Activity`, etc.)
2. **Fetch Functions:** Async functions that execute GROQ queries
   - `getArticles()` - Fetch all articles
   - `getArticleBySlug(slug)` - Fetch single article
   - `getFeaturedArticles()` - Fetch featured articles only
   - Similar functions for recipes, activities, printables, etc.

**Why This Layer?**
- **Type Safety:** TypeScript interfaces ensure type safety
- **Abstraction:** Pages don't need to know about GROQ
- **Reusability:** Same functions used across multiple pages
- **Error Handling:** Centralized error handling (returns empty arrays on failure)

**Example:**
```typescript
export async function getArticles(): Promise<Article[]> {
  if (!safeClient) return [];
  return safeClient.fetch<Article[]>(articlesQuery);
}
```

#### Image URL Generation

**Location:** `lib/sanity/image-url.ts`

**Purpose:** Generate optimized image URLs from Sanity image sources

**Usage:**
```typescript
import { urlFor } from "@/lib/sanity/image-url";

const imageUrl = urlFor(article.coverImage)
  .width(400)
  .height(250)
  .url();
```

**Why Server-Side Only?**
- **Hydration Fix:** We pre-generate image URLs in Server Components to avoid hydration mismatches
- **Performance:** One-time generation vs client-side generation on every render
- **SEO:** Images are in initial HTML, not loaded client-side

**Pattern:**
1. Fetch content in Server Component (`app/*/page.tsx`)
2. Pre-generate `imageUrl` for all items using `urlFor()`
3. Pass `imageUrl` as prop to Client Components
4. Client Components use pre-generated URL (no `urlFor()` calls in client)

### Supabase Connection

#### Server Client Setup

**Location:** `lib/supabase/server.ts`

**Configuration:**
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,      // Server-side only
    autoRefreshToken: false,     // Service role doesn't expire
    detectSessionInUrl: false,   // Server-side only
  },
});
```

**Why Service Role Key?**
- **Admin Access:** Service role key bypasses RLS policies
- **Server-Side Only:** Never exposed to client (only used in API routes)
- **No User Context:** We don't have user authentication yet, so service role is appropriate

**Why REST API (not direct connection)?**
- **Serverless Friendly:** Works well with Next.js serverless functions
- **Connection Pooling:** Handled automatically by Supabase
- **Scalability:** No connection limits to manage

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

#### API Route for Submissions

**Location:** `app/api/submissions/route.ts`

**Purpose:** Handle POST requests from contact forms

**Flow:**
1. Client submits form (Client Component)
2. Form sends POST to `/api/submissions`
3. API route validates and normalizes data
4. API route inserts into Supabase `submissions` table
5. Returns success/error response

**Data Normalization:**
- `type`: Normalizes "video-idea" → "video_idea", etc.
- `child_age_group`: Normalizes "0-2" → "0_2", etc.
- `topic`: Normalizes topic strings
- `rating`: Clamps to 1-5 range

**Security:**
- No authentication required (public submissions)
- Validation on required fields
- Service role key never exposed to client

---

## File Structure

### Root Directory

```
MikroiMathites_new/
├── app/                    # Next.js App Router (pages & API routes)
├── components/             # React components
├── lib/                    # Utilities, content layer, connections
├── sanity/                 # Sanity Studio configuration
├── supabase/               # Supabase schema files
├── scripts/                # Utility scripts
├── public/                 # Static assets
├── .env.local              # Environment variables (not in git)
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

### `/app` Directory (Next.js App Router)

**Purpose:** All routes and API endpoints

```
app/
├── layout.tsx              # Root layout (fonts, metadata, analytics)
├── page.tsx                # Homepage (/)
├── globals.css             # Global styles
├── error.tsx               # Error boundary
├── not-found.tsx           # 404 page
├── robots.ts               # robots.txt generator
├── sitemap.ts              # sitemap.xml generator
│
├── api/                    # API Routes (Backend)
│   ├── submissions/
│   │   └── route.ts        # POST /api/submissions (Supabase insert)
│   └── revalidate/
│       └── route.ts        # POST /api/revalidate (Sanity webhook)
│
├── studio/                 # Sanity Studio (embedded)
│   └── [[...index]]/
│       └── page.tsx        # Sanity Studio route handler
│
├── gia-goneis/             # "For Parents" section
│   ├── page.tsx            # /gia-goneis (list page)
│   ├── [slug]/
│   │   └── page.tsx         # /gia-goneis/[slug] (article detail)
│   └── recipes/
│       └── [slug]/
│           └── page.tsx     # /gia-goneis/recipes/[slug] (recipe detail)
│
├── drastiriotites/         # "Activities" section
│   ├── page.tsx            # /drastiriotites (list page)
│   ├── [slug]/
│   │   └── page.tsx         # /drastiriotites/[slug] (activity detail)
│   └── printables/
│       └── [slug]/
│           └── page.tsx     # /drastiriotites/printables/[slug] (printable detail)
│
├── age/                    # Age group pages
│   └── [slug]/
│       └── page.tsx         # /age/[slug] (age-specific content)
│
├── epikoinonia/            # Contact page
│   └── page.tsx            # /epikoinonia
│
├── sxetika/                # About page
│   └── page.tsx            # /sxetika
│
└── admin/                  # Admin pages (future: add auth)
    └── submissions/
        └── page.tsx        # /admin/submissions (view Supabase submissions)
```

**Key Patterns:**
- **Server Components by Default:** All `page.tsx` files are Server Components unless marked `"use client"`
- **Dynamic Routes:** `[slug]` folders create dynamic routes
- **API Routes:** `app/api/*/route.ts` files create API endpoints
- **Metadata:** Each page can export `metadata` or `generateMetadata()` function

### `/components` Directory

**Purpose:** Reusable React components

```
components/
├── ui/                     # shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   └── ...
│
├── layout/                 # Layout components
│   ├── header.tsx         # Site header/navigation
│   ├── footer.tsx         # Site footer
│   ├── navigation.tsx     # Navigation menu
│   └── mobile-menu.tsx    # Mobile hamburger menu
│
├── articles/               # Article-specific components
│   ├── article-card.tsx   # Article card (used in lists)
│   ├── article-content.tsx # Article body renderer
│   ├── article-meta.tsx   # Author, date, etc.
│   ├── articles-list.tsx  # List of articles
│   ├── related-articles.tsx
│   └── share-buttons.tsx   # Social sharing buttons
│
├── activities/             # Activity-specific components
│   ├── activity-card.tsx
│   ├── activity-content.tsx
│   ├── activity-meta.tsx
│   └── activities-list.tsx
│
├── content/                # Shared content components
│   ├── content-list.tsx   # Generic list (articles/recipes/activities)
│   ├── content-filters.tsx # Age/category filters
│   └── search-bar.tsx     # Search input
│
├── forms/                  # Form components
│   ├── unified-contact-form.tsx # Main contact form
│   ├── video-idea-form.tsx
│   ├── feedback-form-tab.tsx
│   ├── qa-form.tsx
│   └── ...
│
├── home/                   # Homepage-specific components
│   ├── home-page.tsx      # Main homepage component (Client Component)
│   └── featured-banner.tsx
│
├── pages/                  # Page-level components
│   ├── page-header.tsx    # Reusable page header
│   └── page-wrapper.tsx  # Page wrapper with layout
│
└── ... (other feature components)
```

**Client vs Server Components:**
- **Server Components (default):** No `"use client"` directive
  - Can use async/await
  - Can access server-only APIs
  - Cannot use hooks, event handlers, browser APIs
- **Client Components:** Must have `"use client"` at top
  - Can use hooks (`useState`, `useEffect`, etc.)
  - Can use browser APIs
  - Can handle user interactions
  - Cannot be async

**Examples:**
- `components/content/content-filters.tsx` - Client Component (uses `useSearchParams`, `useRouter`)
- `components/articles/article-card.tsx` - Server Component (just displays data)
- `components/home/home-page.tsx` - Client Component (carousel with state)

### `/lib` Directory

**Purpose:** Utilities, content layer, and backend connections

```
lib/
├── sanity/                 # Sanity connection & queries
│   ├── client.ts          # Sanity client setup
│   ├── queries.ts         # GROQ queries
│   └── image-url.ts      # Image URL generator
│
├── supabase/              # Supabase connection
│   └── server.ts         # Supabase admin client
│
├── content/                # Content layer (abstraction)
│   └── index.ts          # TypeScript interfaces & fetch functions
│
├── seo/                    # SEO utilities
│   ├── config.ts         # SEO configuration per route
│   └── generate-metadata.ts # Metadata generator
│
├── constants/              # Constants
│   └── home-page.ts      # Homepage limits & image sizes
│
├── utils/                  # Utility functions
│   ├── age-groups.ts     # Age group utilities
│   └── utils.ts          # General utilities (cn, etc.)
│
└── design-tokens.ts        # Design system tokens
```

### `/sanity` Directory

**Purpose:** Sanity Studio configuration and schemas

```
sanity/
├── schemas/
│   ├── index.ts          # Schema registry (exports all schemas)
│   ├── documents/        # Document types (content types)
│   │   ├── article.ts
│   │   ├── recipe.ts
│   │   ├── activity.ts
│   │   ├── printable.ts
│   │   ├── category.ts
│   │   ├── ageGroup.ts
│   │   ├── tag.ts
│   │   ├── author.ts
│   │   ├── qaItem.ts
│   │   ├── curatedCollection.ts
│   │   └── pageSettings.ts
│   └── objects/          # Reusable object types
│       ├── seo.ts        # SEO fields
│       ├── hero.ts       # Hero section
│       ├── ingredient.ts # Recipe ingredient
│       └── featuredBanner.ts
└── (sanity.config.ts is in root)
```

**Schema Pattern:**
- Each document type exports a `defineType()` object
- Objects are reusable field groups
- References use `type: "reference"` with `to: [{ type: "..." }]`
- Arrays use `type: "array"` with `of: [{ type: "..." }]`

### `/supabase` Directory

**Purpose:** Supabase database schema files

```
supabase/
└── schema-submissions.sql # SQL schema for submissions table
```

**Usage:**
- Run this SQL in Supabase SQL Editor to create tables
- Defines tables, indexes, RLS policies, triggers

---

## Data Flow

### Reading Content (Sanity → Frontend)

**Flow Diagram:**
```
1. User visits page (e.g., /gia-goneis)
   ↓
2. Next.js Server Component (app/gia-goneis/page.tsx) renders
   ↓
3. Server Component calls lib/content/index.ts function
   (e.g., getArticles(), getRecipes())
   ↓
4. Content layer executes GROQ query via lib/sanity/queries.ts
   ↓
5. Sanity client (lib/sanity/client.ts) fetches from Sanity CDN
   ↓
6. Data returned to Server Component
   ↓
7. Server Component pre-generates image URLs (lib/sanity/image-url.ts)
   ↓
8. Server Component passes data to Client/Server Components
   ↓
9. Components render HTML
   ↓
10. HTML sent to browser (with images, metadata, etc.)
```

**Example: Article Detail Page**

```typescript
// app/gia-goneis/[slug]/page.tsx (Server Component)
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Fetch article from Sanity
  const article = await getArticleBySlug(slug);
  //    ↓ calls lib/content/index.ts
  //    ↓ which calls lib/sanity/queries.ts
  //    ↓ which uses lib/sanity/client.ts
  
  if (!article) notFound();
  
  // 2. Pre-generate image URL (server-side)
  const coverImageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(600).url()
    : null;
  
  // 3. Render (Server Component can render directly)
  return (
    <PageWrapper>
      <Image src={coverImageUrl} ... />
      <ArticleContent content={article.body} />
    </PageWrapper>
  );
}
```

### Writing Data (Frontend → Supabase)

**Flow Diagram:**
```
1. User fills out form (Client Component)
   ↓
2. User submits form (onSubmit handler)
   ↓
3. Client Component sends POST to /api/submissions
   ↓
4. API Route (app/api/submissions/route.ts) receives request
   ↓
5. API Route validates and normalizes data
   ↓
6. API Route uses supabaseAdmin (lib/supabase/server.ts)
   ↓
7. Supabase client inserts into submissions table
   ↓
8. API Route returns success/error response
   ↓
9. Client Component shows success/error message
```

**Example: Contact Form Submission**

```typescript
// components/forms/unified-contact-form.tsx (Client Component)
"use client";

export function UnifiedContactForm() {
  const handleSubmit = async (data: FormData) => {
    // 1. Send POST to API route
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'feedback',
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });
    
    // 2. Handle response
    if (response.ok) {
      // Show success message
    } else {
      // Show error message
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// app/api/submissions/route.ts (API Route)
export async function POST(req: Request) {
  const body = await req.json();
  
  // 1. Validate data
  if (!body.type || !body.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  
  // 2. Normalize data
  const dbType = normalizeType(body.type);
  
  // 3. Insert into Supabase
  const { error } = await supabaseAdmin
    .from("submissions")
    .insert({
      type: dbType,
      name: body.name || null,
      email: body.email || null,
      message: body.message,
      status: "new",
    });
  
  if (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true });
}
```

### Image Optimization Flow

**Why Pre-generate Image URLs?**

**Problem:** If we call `urlFor()` in Client Components, we get hydration mismatches because:
- Server renders with one URL
- Client generates different URL (different timestamp, etc.)

**Solution:** Pre-generate all image URLs in Server Components

**Flow:**
```
1. Server Component fetches content from Sanity
   ↓
2. Server Component loops through items
   ↓
3. For each item, generate imageUrl using urlFor()
   ↓
4. Add imageUrl to item object
   ↓
5. Pass items with imageUrl to Client Components
   ↓
6. Client Components use pre-generated imageUrl (no urlFor() calls)
   ↓
7. No hydration mismatch! ✅
```

**Example:**
```typescript
// app/page.tsx (Server Component)
const articles = await getArticles();

// Pre-generate image URLs
const articlesWithImageUrls = articles.map((article) => ({
  ...article,
  imageUrl: article.coverImage
    ? urlFor(article.coverImage).width(400).height(250).url()
    : null,
}));

// Pass to Client Component
return <HomePage articles={articlesWithImageUrls} />;

// components/articles/article-card.tsx (Server or Client Component)
export function ArticleCard({ article }: { article: Article & { imageUrl?: string | null } }) {
  // Use pre-generated URL (no urlFor() call here!)
  return <Image src={article.imageUrl} ... />;
}
```

---

## API Routes

### `/api/submissions` (POST)

**Purpose:** Handle form submissions from contact forms

**Location:** `app/api/submissions/route.ts`

**Method:** POST

**Request Body:**
```typescript
{
  type: "video-idea" | "feedback" | "question" | "review" | "rating" | "suggestion" | "other",
  name?: string,
  email?: string,
  message: string,  // Required
  rating?: number,  // 1-5, for reviews
  child_age_group?: "0-2" | "2-4" | "4-6" | "greek-abroad" | "other",
  topic?: "sleep" | "speech" | "food" | "emotions" | "screens" | "routines" | "greek-abroad" | "other",
  source_page?: string,  // URL where form was submitted
  content_slug?: string,  // Related content slug
  publish_consent?: boolean  // For Q&A publishing
}
```

**Response:**
- **Success (200):** `{ ok: true }`
- **Error (400):** `{ error: "Missing required fields: type, message" }`
- **Error (500):** `{ error: "Failed to submit" }`

**Data Normalization:**
- `type`: "video-idea" → "video_idea", "rating" → "review", etc.
- `child_age_group`: "0-2" → "0_2", etc.
- `rating`: Clamped to 1-5 range
- `source_page`: Uses `referer` header if not provided

**Security:**
- No authentication required (public submissions)
- Validation on required fields
- Service role key never exposed

### `/api/revalidate` (POST)

**Purpose:** Webhook endpoint for Sanity to trigger Next.js revalidation

**Location:** `app/api/revalidate/route.ts`

**Method:** POST

**Query Params or Body:**
- `secret`: Must match `SANITY_REVALIDATE_SECRET`

**Response:**
- **Success (200):** `{ revalidated: true, now: timestamp, paths: [...] }`
- **Error (401):** `{ error: "Invalid secret" }`
- **Error (500):** `{ error: "Failed to revalidate", details: ... }`

**Revalidated Paths:**
- `/` (homepage)
- `/gia-goneis`
- `/drastiriotites`
- `/epikoinonia`
- `/sxetika`
- Layout-level revalidation for dynamic routes

**Setup in Sanity:**
1. Go to Sanity Dashboard → API → Webhooks
2. Create webhook pointing to: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
3. Trigger on: Document published/unpublished

**Why This?**
- When content is published in Sanity, Next.js cache needs to be cleared
- This webhook triggers `revalidatePath()` to clear cache
- Ensures users see latest content immediately

---

## Frontend Components

### Server vs Client Components

**Rule of Thumb:**
- **Start with Server Component** (default)
- **Add `"use client"` only when needed:**
  - Need hooks (`useState`, `useEffect`, `useSearchParams`, etc.)
  - Need event handlers (`onClick`, `onChange`, etc.)
  - Need browser APIs (`window`, `localStorage`, etc.)
  - Need third-party libraries that require client-side

**Examples:**

**Server Component (Default):**
```typescript
// components/articles/article-card.tsx
import Image from "next/image";
import Link from "next/link";

export function ArticleCard({ article }: { article: Article }) {
  // No "use client" - this is a Server Component
  // Can use async/await, access server-only APIs
  return (
    <Link href={`/gia-goneis/${article.slug}`}>
      <Image src={article.imageUrl} alt={article.title} />
      <h3>{article.title}</h3>
    </Link>
  );
}
```

**Client Component (When Needed):**
```typescript
// components/content/content-filters.tsx
"use client";  // Required for hooks

import { useSearchParams, useRouter } from "next/navigation";

export function ContentFilters() {
  const searchParams = useSearchParams();  // Requires "use client"
  const router = useRouter();              // Requires "use client"
  
  const handleFilterChange = (value: string) => {
    // Update URL params
    router.push(`/gia-goneis?category=${value}`);
  };
  
  return <Select onValueChange={handleFilterChange} ... />;
}
```

### Component Patterns

#### 1. **Card Components**
- **Purpose:** Display content in lists/grids
- **Pattern:** Accept content object + optional `imageUrl` prop
- **Examples:** `ArticleCard`, `RecipeCard`, `ActivityCard`
- **Location:** `components/articles/`, `components/activities/`, etc.

#### 2. **List Components**
- **Purpose:** Render multiple cards in grid/list
- **Pattern:** Accept array of items, map to cards
- **Examples:** `ArticlesList`, `ContentList`, `ActivitiesList`
- **Location:** `components/articles/`, `components/content/`, etc.

#### 3. **Form Components**
- **Purpose:** Collect user input
- **Pattern:** Client Components with form state, submit to API
- **Examples:** `UnifiedContactForm`, `VideoIdeaForm`, `QAForm`
- **Location:** `components/forms/`

#### 4. **Layout Components**
- **Purpose:** Page structure and navigation
- **Pattern:** Server Components (mostly), some Client Components for interactivity
- **Examples:** `Header`, `Footer`, `Navigation`, `MobileMenu`
- **Location:** `components/layout/`

#### 5. **Page Components**
- **Purpose:** Full page layouts
- **Pattern:** Server Components that fetch data and compose other components
- **Examples:** `HomePage`, `PageHeader`, `PageWrapper`
- **Location:** `components/home/`, `components/pages/`

---

## Potential Issues & Considerations

### 1. **Performance: No Pagination**

**Issue:** Pages fetch ALL content from Sanity (no limits)

**Impact:**
- Slow page loads as content grows
- High memory usage
- Unnecessary data transfer

**Current State:**
- `getArticles()` fetches all articles
- `getRecipes()` fetches all recipes
- `getActivities()` fetches all activities

**Solutions:**
1. Add pagination to queries (limit results)
2. Implement infinite scroll
3. Use virtual scrolling

**Location:** `lib/sanity/queries.ts`, `lib/content/index.ts`

### 2. **Client-Side Search Inefficiency**

**Issue:** Search filters all fetched content client-side

**Impact:**
- All content must be loaded first
- Inefficient for large datasets
- `item.body?.toString()` converts entire PortableText on every search

**Current State:**
- Search happens in `app/gia-goneis/page.tsx` after fetching all content
- Converts PortableText to string for searching

**Solutions:**
1. Move search to GROQ queries (server-side)
2. Extract searchable text during fetch
3. Use Sanity's full-text search

**Location:** `app/gia-goneis/page.tsx:56-64`

### 3. **No Error Handling for Data Fetching**

**Issue:** If Sanity queries fail, page crashes or shows incomplete data

**Impact:**
- Poor user experience
- No graceful degradation

**Current State:**
- Some pages have try-catch (homepage)
- Most pages don't handle errors

**Solutions:**
1. Add try-catch to all data fetching
2. Use error boundaries
3. Show fallback UI on errors

**Location:** All `app/*/page.tsx` files

### 4. **Debug Code in Production**

**Issue:** `console.log` statements in production code

**Impact:**
- Code clutter
- Potential performance impact

**Current State:**
- `app/gia-goneis/page.tsx:81-96` has debug logging (gated by `NODE_ENV`)

**Solutions:**
1. Remove debug code
2. Use proper logging utility
3. Use environment variable flag

**Location:** `app/gia-goneis/page.tsx`

### 5. **Static SEO Metadata**

**Issue:** Metadata doesn't change based on filters/search

**Impact:**
- Missed SEO opportunities
- Generic social sharing

**Current State:**
- All pages use static metadata from `lib/seo/config.ts`
- No dynamic metadata for filtered views

**Solutions:**
1. Generate dynamic metadata based on search params
2. Add structured data (JSON-LD)
3. Dynamic canonical URLs

**Location:** `lib/seo/generate-metadata.ts`, all `app/*/page.tsx`

### 6. **No Loading States**

**Issue:** No skeleton screens or loading indicators

**Impact:**
- Poor perceived performance
- Layout shift

**Current State:**
- No `loading.tsx` files
- No Suspense boundaries

**Solutions:**
1. Add `loading.tsx` files
2. Use Suspense with skeletons
3. Implement streaming SSR

**Location:** All `app/*/` directories

### 7. **Complex Category Mapping Logic**

**Issue:** Category merging logic is complex and inline

**Impact:**
- Hard to maintain
- Potential for bugs

**Current State:**
- Category mapping in `app/gia-goneis/page.tsx:43-102`
- Handles multiple edge cases inline

**Solutions:**
1. Extract to utility function
2. Use configuration object
3. Move to Sanity schema level

**Location:** `app/gia-goneis/page.tsx`

### 8. **Image URL Generation for All Items**

**Issue:** Image URLs generated for all items, even filtered out ones

**Impact:**
- Unnecessary processing

**Current State:**
- URLs generated before filtering
- Some items never displayed

**Solutions:**
1. Generate URLs only for displayed items
2. (Not recommended: Lazy generation - would cause hydration issues)

**Location:** `app/gia-goneis/page.tsx:104-127`

### 9. **No Content Pagination**

**Issue:** All filtered/search results displayed at once

**Impact:**
- Long pages
- Poor performance
- Poor UX for large result sets

**Current State:**
- No pagination component
- All results rendered

**Solutions:**
1. Traditional pagination (page numbers)
2. Infinite scroll
3. Virtualized list

**Location:** `app/gia-goneis/page.tsx`, `components/content/content-list.tsx`

### 10. **Supabase Service Role Key Usage**

**Issue:** Using service role key means no user-level permissions

**Impact:**
- All operations have admin access
- If we add user auth later, need to refactor

**Current State:**
- `supabaseAdmin` uses service role key
- No user authentication

**Future Consideration:**
- When adding user accounts, create authenticated client
- Use RLS policies for user-specific data
- Service role only for admin operations

**Location:** `lib/supabase/server.ts`

---

## Environment Variables

### Required

**Sanity:**
```bash
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-01
SANITY_TOKEN=your-read-token  # Optional, for drafts
SANITY_REVALIDATE_SECRET=your-secret  # For webhook
```

**Supabase:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Optional

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # For metadata
```

---

## Development Workflow

### Adding New Content Type

1. **Create Sanity Schema:**
   - Add schema file in `sanity/schemas/documents/`
   - Register in `sanity/schemas/index.ts`

2. **Create GROQ Query:**
   - Add query in `lib/sanity/queries.ts`
   - Use standardized field patterns

3. **Create TypeScript Interface:**
   - Add interface in `lib/content/index.ts`
   - Create fetch functions (`getX()`, `getXBySlug()`, etc.)

4. **Create Components:**
   - Card component: `components/[type]/[type]-card.tsx`
   - Detail page: `app/[route]/[slug]/page.tsx`
   - List page: `app/[route]/page.tsx`

5. **Add Routes:**
   - Create route in `app/` directory
   - Add to navigation if needed

### Adding New Form Type

1. **Update Supabase Schema (if needed):**
   - Add new enum value to `submission_type` if needed
   - Run migration in Supabase SQL Editor

2. **Create Form Component:**
   - Add form in `components/forms/`
   - Use `UnifiedContactForm` as reference

3. **Update API Route (if needed):**
   - Add normalization logic in `app/api/submissions/route.ts`
   - Test submission flow

### Debugging

**Sanity Queries:**
- Use Sanity Vision plugin in Studio
- Test GROQ queries directly
- Check `lib/sanity/queries.ts` for query syntax

**Supabase:**
- Use Supabase Dashboard → Table Editor
- Check API route logs in Vercel
- Test API route with `curl` or Postman

**Hydration Errors:**
- Check for `urlFor()` calls in Client Components
- Ensure image URLs pre-generated in Server Components
- Check for `Date.now()`, `Math.random()` in components

**Performance:**
- Use Next.js DevTools
- Check Network tab for large payloads
- Use React DevTools Profiler

---

## Conclusion

This architecture provides a solid foundation for a content-driven application with user submissions. The separation of concerns (Sanity for content, Supabase for user data) allows for scalability and flexibility. However, there are areas for improvement, particularly around performance (pagination, search optimization) and user experience (loading states, error handling).

For new developers, focus on understanding:
1. **Server vs Client Components** - When to use each
2. **Data Flow** - How data moves from Sanity/Supabase to UI
3. **Image Optimization** - Why we pre-generate URLs
4. **API Routes** - How forms submit to Supabase

The codebase follows Next.js 16 best practices and is structured for maintainability and scalability.

