# Μικροί Μαθητές - Architecture Documentation

**Last Updated:** January 2025  
**Purpose:** Comprehensive guide to how the application works, how it connects to Sanity CMS and Supabase, and the overall system architecture.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Application Architecture](#application-architecture)
4. [Sanity CMS Integration](#sanity-cms-integration)
5. [Supabase Integration](#supabase-integration)
6. [Data Flow](#data-flow)
7. [API Routes](#api-routes)
8. [Authentication & Authorization](#authentication--authorization)
9. [Content Management Flow](#content-management-flow)
10. [Analytics & Tracking](#analytics--tracking)
11. [Deployment Architecture](#deployment-architecture)

---

## System Overview

**Μικροί Μαθητές** is a Next.js 16 application that serves as a Parent Hub platform, providing educational content, activities, and resources for parents with children aged 0-6 years.

### Core Functionality

- **Content Display**: Articles, recipes, activities, and printables fetched from Sanity CMS
- **User Interactions**: Form submissions, newsletter signups, Q&A submissions
- **Analytics**: View and download tracking stored in Supabase
- **Admin Dashboard**: Content moderation, sponsor management, submission handling
- **SEO Optimization**: Dynamic metadata generation, sitemap, robots.txt

---

## Technology Stack

### Frontend
- **Next.js 16** (App Router) - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

### Backend Services
- **Sanity CMS** - Headless CMS for content management
- **Supabase** - PostgreSQL database for analytics and user data
- **NextAuth.js v5** - Authentication
- **Resend** - Email service

### Infrastructure
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **VPS** - Production hosting

---

## Application Architecture

### Directory Structure

```
├── app/                    # Next.js App Router (pages & API routes)
│   ├── api/               # API endpoints
│   ├── admin/             # Admin dashboard (protected)
│   ├── gia-goneis/        # For Parents section
│   ├── drastiriotites/    # Activities section
│   └── ...
├── components/            # React components
│   ├── home/              # Homepage components
│   ├── articles/          # Article-related components
│   ├── activities/        # Activity components
│   ├── admin/             # Admin components
│   └── ...
├── lib/                   # Utility libraries
│   ├── sanity/            # Sanity client & queries
│   ├── supabase/          # Supabase client
│   ├── content/           # Content fetching logic
│   ├── analytics/         # Analytics queries
│   └── ...
├── sanity/                # Sanity Studio configuration
│   └── schemas/           # Content type schemas
└── supabase/              # Database migrations
```

### Request Flow

1. **User Request** → Next.js Server
2. **Route Handler** → Fetches data from Sanity/Supabase
3. **Server Component** → Renders HTML with data
4. **Client Component** → Adds interactivity (forms, tracking)
5. **Response** → HTML sent to browser

---

## Sanity CMS Integration

### What is Sanity?

Sanity is a headless CMS (Content Management System) that stores all content (articles, activities, printables, etc.) in a cloud database. Content editors use Sanity Studio (accessible at `/studio`) to create and manage content.

### Connection Architecture

```
┌─────────────────┐
│  Sanity Studio  │  (Content Editor Interface)
│   /studio       │
└────────┬────────┘
         │
         │ Publishes content
         ▼
┌─────────────────┐
│  Sanity Cloud   │  (Content Database)
│   (CDN)         │
└────────┬────────┘
         │
         │ GROQ Queries
         ▼
┌─────────────────┐
│  Next.js App    │  (lib/sanity/client.ts)
│  Sanity Client  │
└────────┬────────┘
         │
         │ Fetches content
         ▼
┌─────────────────┐
│  Server Pages   │  (app/**/page.tsx)
│  Components     │
└─────────────────┘
```

### Sanity Client Setup

**Location:** `lib/sanity/client.ts`

```typescript
// Read-only client (public, safe for client/server)
export const sanityClient = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,  // Uses Sanity CDN for fast delivery
  apiVersion: "2024-03-01",
});
```

**Key Points:**
- Uses **CDN** for fast content delivery
- **Read-only** by default (no write permissions)
- **Public credentials** (projectId, dataset) - safe to expose
- Automatically cached by Next.js fetch cache

### Write Client (Server-Only)

**Location:** `lib/sanity/write-client.ts`

```typescript
// Write client (server-only, requires token)
export const sanityWriteClient = createClient({
  projectId: ...,
  dataset: ...,
  useCdn: false,  // Never use CDN for writes
  token: SANITY_WRITE_TOKEN,  // Secret token
});
```

**Used For:**
- Creating Q&A drafts from admin submissions
- Programmatic content creation
- **Never imported in client components**

### Content Fetching Flow

1. **Page Component** (`app/page.tsx`) calls `getFeaturedArticles()` from `lib/content/index.ts`
2. **Content Library** (`lib/content/index.ts`) uses `sanityClient.fetch()` with GROQ queries
3. **GROQ Query** (`lib/sanity/queries.ts`) defines what fields to fetch
4. **Sanity CDN** returns JSON data
5. **Next.js** caches the response
6. **Page renders** with the data

### GROQ Queries

**Location:** `lib/sanity/queries.ts`

GROQ (Graph-Relational Object Queries) is Sanity's query language. Example:

```groq
*[_type == "article" && featured == true] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  coverImage,
  excerpt,
  "author": author-> { name, slug }
}
```

**Query Structure:**
- `*[_type == "article"]` - Filter documents by type
- `| order(...)` - Sort results
- `[0...6]` - Limit to 6 items
- `{ fields }` - Select specific fields
- `"author": author->` - Reference resolution (follows reference)

### Content Types in Sanity

1. **Articles** (`article`) - Educational content for parents
2. **Recipes** (`recipe`) - Cooking recipes
3. **Activities** (`activity`) - Hands-on activities for kids
4. **Printables** (`printable`) - Downloadable PDFs
5. **Q&A Items** (`qaItem`) - Published Q&A from submissions
6. **Sponsors** (`sponsor`) - Sponsor logos and info
7. **Curated Collections** (`curatedCollection`) - Manually curated content groups
8. **Page Settings** (`pageSettings`) - Page-specific configurations

### Content Revalidation

**Problem:** When content changes in Sanity, Next.js cached pages don't update immediately.

**Solution:** Sanity Webhook → Next.js API Route

1. **Content Published** in Sanity Studio
2. **Sanity Webhook** triggers → `POST /api/revalidate?secret=...`
3. **API Route** (`app/api/revalidate/route.ts`) validates secret
4. **Next.js** revalidates cached pages (`revalidatePath()`)
5. **Next Request** gets fresh content

**Fallback:** Time-based revalidation (`export const revalidate = 600`) ensures content updates every 10 minutes even without webhook.

---

## Supabase Integration

### What is Supabase?

Supabase is a PostgreSQL database hosted in the cloud. We use it for:
- **Analytics tracking** (views, downloads)
- **User submissions** (Q&A, feedback, contact forms)
- **Newsletter subscriptions**
- **Admin authentication** (via NextAuth)

### Connection Architecture

```
┌─────────────────┐
│  Next.js API    │  (app/api/**/route.ts)
│  Routes         │
└────────┬────────┘
         │
         │ REST API Calls
         ▼
┌─────────────────┐
│  Supabase Admin │  (lib/supabase/server.ts)
│  Client         │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Supabase Cloud │  (PostgreSQL Database)
│  Database       │
└─────────────────┘
```

### Supabase Client Setup

**Location:** `lib/supabase/server.ts`

```typescript
// Server-side admin client (full database access)
export const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,  // Secret key - server-only
  {
    auth: {
      persistSession: false,  // Don't persist (server-side)
      autoRefreshToken: false,
    },
  }
);
```

**Key Points:**
- Uses **service_role key** for admin access
- **Server-only** (never exposed to client)
- Uses **REST API** (not direct DB connection) - perfect for serverless
- Connection pooling handled automatically by Supabase

### Database Tables

#### 1. `content_views`
Tracks page views for analytics.

```sql
CREATE TABLE content_views (
  id UUID PRIMARY KEY,
  content_type VARCHAR(50),  -- 'article', 'activity', 'recipe', 'printable'
  content_slug VARCHAR(255),
  session_id VARCHAR(255),
  viewed_at TIMESTAMP,
  is_bot BOOLEAN,
  device_type VARCHAR(50)
);
```

**Usage:**
- API: `POST /api/analytics/views`
- Component: `<ContentTracker>` automatically tracks views
- Query: `getContentViewCount()` in `lib/analytics/queries.ts`

#### 2. `content_downloads`
Tracks printable downloads.

```sql
CREATE TABLE content_downloads (
  id UUID PRIMARY KEY,
  content_type VARCHAR(50),  -- Always 'printable'
  content_slug VARCHAR(255),
  session_id VARCHAR(255),
  downloaded_at TIMESTAMP,
  is_bot BOOLEAN,
  device_type VARCHAR(50)
);
```

**Usage:**
- API: `POST /api/analytics/downloads`
- Component: `<PrintableDownloadButton>` tracks downloads
- Query: `getDownloadCount()` in `lib/analytics/queries.ts`

#### 3. `submissions`
Stores user form submissions (Q&A, feedback, contact).

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  type VARCHAR(50),  -- 'qa', 'feedback', 'contact', 'video_idea'
  status VARCHAR(50),  -- 'pending', 'approved', 'rejected', 'published'
  content JSONB,  -- Form data
  created_at TIMESTAMP,
  admin_notes TEXT
);
```

**Usage:**
- API: `POST /api/submissions` (create)
- API: `GET /api/admin/submissions` (list)
- Admin: `/admin/submissions` (moderate)

#### 4. `newsletter_subscriptions`
Stores newsletter email subscriptions.

```sql
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  subscribed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
```

**Usage:**
- API: `POST /api/newsletter` (subscribe)
- Email: Resend integration for newsletters

### Analytics Flow

1. **User Views Page** → `<ContentTracker>` component mounts
2. **Component** calls `POST /api/analytics/views` with content info
3. **API Route** (`app/api/analytics/views/route.ts`) validates request
4. **Supabase** inserts record into `content_views` table
5. **Admin Dashboard** queries `getContentViewCount()` to display stats

**Bot Detection:**
- User-Agent checking filters out crawlers
- `is_bot` flag stored in database
- Analytics queries exclude bots (`eq("is_bot", false)`)

---

## Data Flow

### Homepage Load Flow

```
1. User visits "/"
   ↓
2. app/page.tsx (Server Component)
   ↓
3. Parallel data fetching:
   - getFeaturedArticles() → Sanity
   - getFeaturedActivities() → Sanity
   - getHomeHero() → Sanity
   - getSponsors() → Sanity
   ↓
4. lib/content/index.ts
   ↓
5. sanityClient.fetch(articlesQuery)
   ↓
6. Sanity CDN returns JSON
   ↓
7. Next.js caches response
   ↓
8. HomePage component renders with data
   ↓
9. HTML sent to browser
   ↓
10. Client components hydrate:
    - ContentTracker (tracks view)
    - NewsletterSection (form)
    - SponsorsCarousel (interactive)
```

### Content Page Flow (e.g., Article)

```
1. User visits "/gia-goneis/article-slug"
   ↓
2. app/gia-goneis/[slug]/page.tsx
   ↓
3. generateStaticParams() pre-generates popular pages
   ↓
4. getArticleBySlug(slug) → Sanity
   ↓
5. getContentViewCount("article", slug) → Supabase
   ↓
6. Page renders with article content + view count
   ↓
7. ContentTracker component tracks view
   ↓
8. POST /api/analytics/views → Supabase
```

### Form Submission Flow

```
1. User fills form (e.g., Q&A form)
   ↓
2. Form submits → POST /api/submissions
   ↓
3. API validates input
   ↓
4. Insert into Supabase `submissions` table
   ↓
5. Send email notification (Resend)
   ↓
6. Return success response
   ↓
7. Admin sees submission in /admin/submissions
   ↓
8. Admin approves → Creates draft in Sanity
   ↓
9. Admin publishes → Q&A appears on /epikoinonia
```

---

## API Routes

### Public APIs

#### `/api/analytics/views` (POST)
Tracks content views.

**Request:**
```json
{
  "content_type": "article",
  "content_slug": "article-slug",
  "session_id": "abc123"
}
```

**Response:**
```json
{ "success": true }
```

#### `/api/analytics/downloads` (POST)
Tracks printable downloads.

**Request:**
```json
{
  "content_slug": "printable-slug",
  "session_id": "abc123"
}
```

#### `/api/submissions` (POST)
Creates user submission (Q&A, feedback, etc.).

**Request:**
```json
{
  "type": "qa",
  "content": {
    "question": "How do I...",
    "category": "nutrition"
  }
}
```

#### `/api/newsletter` (POST)
Subscribes email to newsletter.

**Request:**
```json
{
  "email": "user@example.com"
}
```

#### `/api/revalidate` (POST)
Revalidates Next.js cache (called by Sanity webhook).

**Query Params:**
- `secret` - Revalidation secret

### Admin APIs (Protected)

#### `/api/admin/submissions` (GET, POST)
List/create submissions.

#### `/api/admin/submissions/[id]` (GET, PATCH)
Get/update specific submission.

#### `/api/admin/submissions/[id]/send-reply` (POST)
Send reply and create Q&A draft in Sanity.

#### `/api/admin/sponsors` (GET, POST)
List/create sponsors.

#### `/api/admin/stats` (GET)
Get dashboard statistics.

---

## Authentication & Authorization

### NextAuth.js Setup

**Location:** `lib/auth/config.ts`

**Provider:** Credentials (email/password)

**Flow:**
1. User submits login form → `POST /api/auth/signin`
2. NextAuth validates credentials
3. Creates session cookie
4. Redirects to admin dashboard

**Middleware:** `middleware.ts`
- Protects `/admin/*` routes
- Redirects unauthenticated users to `/auth/login`
- Checks `session.user.role === "admin"`

**Session Storage:** JWT in HTTP-only cookie

---

## Content Management Flow

### Creating Content

1. **Editor** opens Sanity Studio (`/studio`)
2. **Creates** new article/activity/etc.
3. **Saves** as draft
4. **Publishes** → Content available via API
5. **Webhook** triggers revalidation
6. **Next.js** updates cached pages

### Admin Content Moderation

1. **User submits** Q&A via form
2. **Submission** stored in Supabase
3. **Admin** views in `/admin/submissions`
4. **Admin approves** → Creates draft in Sanity
5. **Admin edits** in Sanity Studio
6. **Admin publishes** → Appears on site

---

## Analytics & Tracking

### View Tracking

**Component:** `<ContentTracker>` (`components/analytics/content-tracker.tsx`)

**How it works:**
1. Component mounts on content page
2. Calls `POST /api/analytics/views`
3. API inserts record into `content_views` table
4. View count displayed via `<ViewCount>` component

**Bot Filtering:**
- User-Agent detection
- `is_bot` flag stored
- Analytics queries exclude bots

### Download Tracking

**Component:** `<PrintableDownloadButton>` (`components/printables/printable-download-button.tsx`)

**How it works:**
1. User clicks download button
2. Button calls `POST /api/analytics/downloads`
3. API inserts record into `content_downloads` table
4. Download count displayed via `<DownloadCount>` component

### Analytics Queries

**Location:** `lib/analytics/queries.ts`

**Functions:**
- `getContentViewCount()` - Get views for one item
- `getContentViewCounts()` - Get views for multiple items (batch)
- `getDownloadCount()` - Get downloads for one printable
- `getDownloadCounts()` - Get downloads for multiple printables
- `getMostViewedContent()` - Get trending content

---

## Deployment Architecture

### Build Process

1. **GitHub Push** → Triggers GitHub Actions
2. **CI Pipeline** (`ci.yml`):
   - Lint code
   - Run tests
   - Build application
3. **Deploy Pipeline** (`deploy-dev.yml`):
   - SSH to VPS
   - Pull latest code
   - Build Docker image
   - Restart container (zero-downtime)

### Docker Setup

**Multi-stage build:**
1. **Dependencies stage** - Install npm packages
2. **Builder stage** - Run `npm run build`
3. **Runner stage** - Copy built files, start server

**Zero-Downtime Deployment:**
- Build new image while old container runs
- Start new container
- Stop old container (~1-2 seconds downtime)

### Environment Variables

**Required:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key
- `SANITY_WRITE_TOKEN` - Sanity write token
- `NEXTAUTH_SECRET` - Auth secret
- `RESEND_API_KEY` - Email service key

---

## Key Design Decisions

### Why Sanity for Content?

- **Headless CMS** - Content separate from presentation
- **CDN Delivery** - Fast content loading
- **Rich Content** - Supports images, references, structured data
- **Studio UI** - Easy content editing
- **Versioning** - Draft/published workflow

### Why Supabase for Analytics?

- **PostgreSQL** - Relational database for complex queries
- **Serverless-friendly** - REST API works with Next.js serverless functions
- **Real-time** - Can add real-time features later
- **Free tier** - Good for analytics volume

### Why Next.js App Router?

- **Server Components** - Fast initial page loads
- **Static Generation** - Pre-render popular pages
- **API Routes** - Built-in backend
- **TypeScript** - Type safety throughout

---

## Common Patterns

### Content Fetching Pattern

```typescript
// 1. Page component
export default async function Page() {
  const articles = await getArticles();
  return <ArticlesList articles={articles} />;
}

// 2. Content library function
export async function getArticles() {
  return sanityClient.fetch(articlesQuery);
}

// 3. GROQ query
export const articlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id, title, slug, coverImage
  }
`;
```

### Analytics Tracking Pattern

```typescript
// 1. Component tracks on mount
'use client';
export function ContentTracker({ contentType, slug }) {
  useEffect(() => {
    fetch('/api/analytics/views', {
      method: 'POST',
      body: JSON.stringify({ content_type: contentType, content_slug: slug })
    });
  }, []);
}

// 2. API route stores in Supabase
export async function POST(req: Request) {
  await supabaseAdmin.from('content_views').insert({ ... });
}
```

---

## Troubleshooting

### Content Not Updating?

1. Check if Sanity webhook is configured
2. Verify `SANITY_REVALIDATE_SECRET` matches webhook URL
3. Check webhook delivery logs in Sanity
4. Wait for time-based revalidation (10 minutes)

### Analytics Not Working?

1. Check Supabase connection (`SUPABASE_SERVICE_ROLE_KEY`)
2. Verify API routes are accessible
3. Check browser console for errors
4. Verify bot detection isn't blocking legitimate requests

### Build Failures?

1. Check environment variables are set
2. Verify Sanity/Supabase credentials
3. Check TypeScript errors
4. Review build logs for specific errors

---

## Future Enhancements

- **Real-time Analytics** - Supabase real-time subscriptions
- **User Accounts** - Full user authentication (not just admin)
- **Content Search** - Full-text search across all content
- **Caching Strategy** - Redis for API response caching
- **Image Optimization** - Next.js Image component with Sanity CDN
- **A/B Testing** - Feature flags for content variations

---

**End of Architecture Documentation**
