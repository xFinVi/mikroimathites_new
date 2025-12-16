# Mikroi Mathites — MVP (v1)  
**Date:** 13/12/2025  
**Language:** Greek (all labels/URLs/content in Greek)

> **Important:** All content titles, headers, and user-facing text must be in Greek. The planning document is in English for development clarity, but the actual website content (page titles, article titles, buttons, labels, etc.) will be in Greek.

---

## 0) Goal (High-level)
Build a **Parent Hub** that:
- keeps parents "hooked" (time on site + return visits),
- provides immediate value (tips/activities/printables/recipes),
- and simultaneously supports the YouTube channel (content discovery + suggestions).

**MVP Strategy:** Launch quickly with 7 focused tasks → Get user feedback → Iterate

**Quick Reference — 7 MVP Tasks:**
1. **Task 1:** Project Foundation + Design System (2-3 days)
2. **Task 2:** Core Pages Structure (1-2 days)
3. **Task 3:** CMS Setup + Content Layer (3-4 days)
4. **Task 4:** Database + Forms (3-4 days)
5. **Task 5:** Landing Page (4-5 days)
6. **Task 6:** Content Pages (5-6 days)
7. **Task 7:** Support Page + Polish + Launch (4-5 days)

**Total estimated time:** 22-29 days (can be parallelized)

---

## 0.1) Design System (Quick Reference)

**Design Direction:** Modern Nursery (Warm Cozy) - Playful, colorful/pastel, but **readable for parents**

**Color Palette:**
- Primary Pink: `#FF6B9D` (CTAs, primary buttons)
- Sky Blue: `#4ECDC4` (secondary actions, links)
- Sunny Yellow: `#FFD93D` (badges, highlights)
- Mint Green: `#95E1D3` (success states)
- Soft Orange: `#FFA07A` (warm accents)
- Background Light: `#F7F7F7`
- Background White: `#FFFFFF`
- Text Dark: `#2C3E50` (primary text)
- Text Medium: `#5A6C7D` (secondary text)
- Text Light: `#95A5A6` (tertiary text)

**Typography:**
- Headings & Body: `'Inter', sans-serif` (excellent Greek support)
- Accent/Display: `'Poppins', sans-serif` (optional, for special elements)

**Component Guidelines:**
- Border Radius: 12px (cards), 8px (buttons), 4px (inputs)
- Shadows: Subtle elevation (0 2px 8px rgba(0,0,0,0.08))
- Spacing: 4px base scale
- Transitions: 200ms ease-in-out

**Design Inspiration:** Playful nursery aesthetic (designOne) - rounded corners, soft colors, child-friendly illustrations (subtle, not overwhelming), professional readability for parents.

---

## 1) MVP Pages (Compact sitemap)
1. **Home (Landing Page)** — "Αρχική"  
2. **For Parents** (Parent Hub — main content page) — "Για Γονείς"  
3. **Activities & Printables** — "Δραστηριότητες & Εκτυπώσιμα"  
4. **Support / Contact** (forms + moderated Q&A) — "Επικοινωνία"  
5. **About** — "Σχετικά"  
6. **Newsletter** (as section on Home + optionally separate landing `/newsletter`)

> Not doing now: mini-courses, full forum, e-shop. Leaving for later.

---

## MVP Implementation Plan — 7 Focused Tasks

**Goal:** Launch quickly, get user feedback, iterate. Each task is designed to be completed independently and deliver value.

### Task 1: Project Foundation + Design System
**Goal:** Set up the project structure and design system foundation.

**Deliverables:**
- ✅ Next.js 16 project initialized with TypeScript
- ✅ Tailwind CSS configured with custom design system colors
- ✅ Design tokens file (colors, typography, spacing)
- ✅ Base component library setup (Button, Card, Input, Container)
- ✅ Font setup (Inter for Greek support)
- ✅ Basic layout components (Header, Footer, Navigation)
- ✅ Responsive breakpoints configured

**Time estimate:** 2-3 days

**Acceptance criteria:**
- Project runs locally without errors
- Design system colors accessible via Tailwind classes
- Base components render correctly
- Greek text displays properly

---

### Task 2: Core Pages Structure (Skeleton)
**Goal:** Create all page routes with basic structure (no content yet).

**Deliverables:**
- ✅ All 5 main pages created as routes:
  - `/` (Home)
  - `/gia-goneis` (For Parents)
  - `/drastiriotites` (Activities & Printables)
  - `/epikoinonia` (Support/Contact)
  - `/sxetika` (About)
- ✅ Basic page templates with placeholders
- ✅ Navigation menu working
- ✅ Footer component
- ✅ Custom 404 page (Greek copy + CTA)
- ✅ SEO baseline per route (title/description + Open Graph/Twitter)
- ✅ Shared composition primitives (PageWrapper, PageHeader) to avoid Header/Footer duplication
- ✅ No repeated layout code; pages use shared wrappers/components
- ✅ Structured, flexible page composition to allow per-page creativity with a consistent philosophy
- ✅ 404 page
- ✅ Basic SEO meta tags structure

**Time estimate:** 1-2 days

**Acceptance criteria:**
- All routes accessible
- Navigation works between pages
- Pages have basic structure (header, content area, footer)
- No broken links
- 404 page renders with Greek messaging and CTA to home
- Route metadata present (title, description, OG/Twitter)
- Layout duplication removed via shared wrappers/components

---

### Task 3: CMS Setup + Content Layer
**Goal:** Set up Sanity CMS and create content fetching layer.

**Deliverables:**
- ✅ Sanity project created
- ✅ Basic schemas: Article, Activity, Printable, Category, AgeGroup
- ✅ Sanity Studio configured
- ✅ Content provider layer (`lib/content/`):
  - `getArticles()`, `getArticleBySlug()`
  - `getActivities()`, `getActivityBySlug()`
  - `getPrintables()`, `getPrintableBySlug()`
- ✅ Next.js 16 Server Components integration
- ✅ Webhook setup for revalidation (basic)
- ✅ 3-5 sample articles in Sanity for testing

**Time estimate:** 3-4 days

**Acceptance criteria:**
- Can create/edit content in Sanity Studio
- Content displays on pages via Server Components
- Webhook triggers revalidation (tested)
- Sample content visible on site

---

### Task 4: Database + Forms (Submissions)
**Goal:** Set up Supabase database and form submission system.

**Deliverables:**
- ✅ Supabase project created
- ✅ Database schema implemented:
  - `submissions` table
  - `submission_answers` table
  - Basic RLS policies
- ✅ API routes:
  - `POST /api/submissions` (create submission)
  - `GET /api/submissions` (admin only, basic)
- ✅ Support page forms (3 tabs):
  - Video idea form
  - Feedback form
  - Q&A form
- ✅ Form validation and error handling
- ✅ Success/error states
- ✅ Basic admin view (simple table/list)

**Time estimate:** 3-4 days

**Acceptance criteria:**
- Forms submit successfully
- Data saved to Supabase
- Admin can view submissions
- Email notifications work (basic)

---

### Task 5: Landing Page (Full Implementation)
**Goal:** Complete the Home page with all sections and content.

**Deliverables:**
- ✅ Hero section with CTAs
- ✅ Age-first cards (0-2, 2-4, 4-6, Greek Abroad)
- ✅ Preview: For Parents (3 featured cards)
- ✅ Preview: Activities & Printables (4 featured items)
- ✅ Support/Community entry block
- ✅ Newsletter signup section
- ✅ Request form (simplified, combined with newsletter)
- ✅ Footer with all links
- ✅ Mobile responsive
- ✅ Loading states

**Time estimate:** 4-5 days

**Acceptance criteria:**
- All sections render correctly
- CTAs link to correct pages
- Newsletter form works
- Mobile-friendly
- Fast load times (< 3s)

---

### Task 6: Content Pages (For Parents + Activities)
**Goal:** Implement the main content browsing pages.

**Deliverables:**
- ✅ "For Parents" page:
  - Hero + search bar
  - Category cards grid
  - Featured articles section
  - Quick tips section
  - Filters (age, category)
- ✅ Article detail page:
  - Full article content
  - Reading time
  - Related articles
  - Share buttons
- ✅ "Activities & Printables" page:
  - Grid/list view
  - Filters (age, type)
  - Activity/Printable detail pages
  - Download functionality (printables)
- ✅ All pages mobile responsive

**Time estimate:** 5-6 days

**Acceptance criteria:**
- Content displays from Sanity
- Filters work correctly
- Detail pages render properly
- Downloads work
- Mobile-friendly

---

### Task 7: Support Page + Polish + Launch Prep
**Goal:** Complete Support page, add polish, prepare for launch.

**Deliverables:**
- ✅ Support page fully functional:
  - All 3 forms working
  - Q&A preview section (approved only)
  - Safety rules section
- ✅ About page content
- ✅ Error pages (404, 500)
- ✅ SEO optimization:
  - Meta tags on all pages
  - Sitemap.xml
  - robots.txt
  - Open Graph tags
- ✅ Performance optimization:
  - Image optimization
  - Code splitting
  - Loading states
- ✅ Analytics setup (basic):
  - Google Analytics 4
  - Event tracking (page views)
- ✅ Final testing:
  - Cross-browser testing
  - Mobile testing
  - Form testing
  - Content review

**Time estimate:** 4-5 days

**Acceptance criteria:**
- All pages functional
- No console errors
- Forms work end-to-end
- SEO basics in place
- Performance scores good (Lighthouse)
- Ready for production deployment

---

## MVP Launch Checklist

**Before going live:**
- [ ] All 5 main pages functional
- [ ] At least 10 articles in Sanity
- [ ] At least 5 activities/printables
- [ ] Forms submitting correctly
- [ ] Admin can view submissions
- [ ] Newsletter signup working
- [ ] Mobile responsive
- [ ] SEO basics (meta tags, sitemap)
- [ ] Analytics tracking
- [ ] Error pages (404, 500)
- [ ] Performance optimized
- [ ] Content reviewed (Greek text correct)
- [ ] Domain configured
- [ ] SSL certificate active

**Post-launch (Week 1):**
- [ ] Monitor analytics
- [ ] Review form submissions
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Plan iteration 2 based on feedback

---

## 2) Task 1 — Design & Skeleton Pages
**Goal:** Set up UI/Design system and wire up basic pages (routes/templates) without full content.

### Deliverables
- Design direction: **Modern Nursery (Warm Cozy)**, colorful/pastel, but **readable for parents**.
- Skeleton templates for:
  - Home
  - For Parents
  - Activities & Printables
  - Support / Contact
  - About

### Tech Stack (MVP)
- **Next.js 16** (App Router, Server Components, Turbopack)
- **Tailwind CSS** (styling)
- **TypeScript** (type safety)
- **Sanity CMS** (headless CMS for editorial content)
- **Supabase** (Postgres DB + Auth + Storage)
- **Vercel** (hosting + edge functions)

**Next.js 16 Features to Leverage:**
- Turbopack for faster builds
- Explicit caching mechanisms (unstable_cache, revalidateTag)
- Improved Server Components performance
- Enhanced routing & navigation
- Built-in image optimization

### Design System

**Color Palette (Modern Nursery - Warm Cozy):**
- **Primary Pink:** `#FF6B9D` - CTAs, highlights, primary buttons
- **Sky Blue:** `#4ECDC4` - Secondary actions, links, accents
- **Sunny Yellow:** `#FFD93D` - Badges, highlights, callouts
- **Mint Green:** `#95E1D3` - Success states, positive indicators
- **Soft Orange:** `#FFA07A` - Warm accents, decorative elements
- **Background Light:** `#F7F7F7` - Page backgrounds
- **Background White:** `#FFFFFF` - Card backgrounds
- **Text Dark:** `#2C3E50` - Primary text (readable, professional)
- **Text Medium:** `#5A6C7D` - Secondary text
- **Text Light:** `#95A5A6` - Tertiary text, placeholders

**Typography:**
- **Headings:** `'Inter', sans-serif` (playful yet professional, excellent Greek support)
  - H1: 48px / 56px (bold)
  - H2: 36px / 44px (bold)
  - H3: 28px / 36px (semi-bold)
  - H4: 24px / 32px (semi-bold)
- **Body Text:** `'Inter', sans-serif` (clean, readable)
  - Large: 18px / 28px (regular)
  - Base: 16px / 24px (regular)
  - Small: 14px / 20px (regular)
- **Accent/Display:** `'Poppins', sans-serif` (optional, for special headings/badges)

**Component Styles:**
- **Border Radius:** 12px (cards), 8px (buttons), 4px (inputs)
- **Shadows:** Subtle elevation (0 2px 8px rgba(0,0,0,0.08))
- **Spacing Scale:** 4px base (4, 8, 12, 16, 24, 32, 48, 64, 96)
- **Transitions:** 200ms ease-in-out (standard interactions)

---

## 3) Task 2 — Landing Page (Wireframe + Sections)
**Goal:** Optimized for **retention** from the first scroll.

### Landing Page sections (in order)
1. **Hero**
   - Central value message (for parents)
   - 2 CTAs:
     - "Start by age"
     - "View activities"

2. **By Age (Age-first cards)**
   - "0–2", "2–4", "4–6", "Greek Abroad"
   - Each card leads to curated content (parents + activities).

3. **Preview: For Parents**
   - 3 featured cards from main categories (e.g., Sleep, Speech, Nutrition).

4. **Preview: Activities & Printables**
   - 4 featured items with "View" / "Download" buttons.

5. **Support / Community entry**
   - Small block: "Ask us / Send video idea"
   - CTA to Support Hub.

6. **Your opinion matters (Request Form)**
   - Small form at the end (before or after newsletter):
     - Name (optional)
     - Email (optional/required depending on selection)
     - Request type (dropdown): "Video idea", "Topic for parents", "Activity", "Other"
     - Message
   - Note: "We only publish if approved (if it's a Q&A)"

7. **Newsletter**
   - Simple signup + lead magnet (e.g., "Starter pack printables")
   - CTA: "Subscribe"

8. **Footer**
   - About, Contact, Policies, YouTube, Social

---

## 4) Task 3 — "For Parents" Page (Wireframe — Option A: Categories first)
**Goal:** Function as a **guided map** (not a blog feed) and lead to deeper browsing.

### Wireframe (in order)
1. **Hero + Search**
   - Title: "For Parents"
   - Subtitle: "Short tips & practical ideas for daily life with your child"
   - Search: "Search: sleep, food, speech…"

2. **Quick selection**
   - "By age" chips: 0–2 / 2–4 / 4–6
   - "By topic" chips (see categories below)

3. **Category Cards (Main grid)**
   - Sleep & Routines  
   - Speech & Vocabulary  
   - Nutrition & Picky Eating  
   - Tantrums & Boundaries  
   - Development (gentle milestones / daily skills)  
   - Screens & Digital Safety  
   - Greek Abroad (bilingual home)  
   - Play Ideas (connection to Activities)

4. **Popular this week (Featured)**
   - 6 cards (articles/guides) with reading time (e.g., "3′", "6′")

5. **Quick solutions — 5 minutes**
   - Small tips blocks ("quick wins") for immediate value

6. **Recipes (Preview within "For Parents" page)**
   - 3–6 cards with age filter
   - CTA to "View all recipes" (if we keep them as a separate page later)

7. **Mini Toolkit (Freebies / Printables)**
   - 2–4 freebies for parents (e.g., sleep routine, emotions chart)

8. **Support CTA**
   - "Send question / idea" → Support Hub

9. **Newsletter CTA**
   - Small block (optional) before footer

### Starter content (what we write first — 10 ideas)
1. "Sleep routine for toddlers: 5 simple steps"  
2. "Tantrums: 3 phrases that really help"  
3. "How to do 'watch together' to encourage speech"  
4. "Picky eating: what to do without pressure"  
5. "5-minute vocabulary game (0–2)"  
6. "5-minute numbers game (2–4)"  
7. "Greek abroad: 7 small habits at home"  
8. "Screens: rules that work in practice (for toddlers)"  
9. "Transitions without tears: from play to sleep/bath"  
10. "Checklist: what to do when 'they don't listen'"

---

## 5) Support / Feedback (how we set it up)
**Goal:** Receive ideas/requests/feedback in an organized way + build community **safely**.

### Support / Contact page includes:
- **Contact Form** (general message)
- **"Video idea" Form** (structured)
- **Q&A (with approval before publication)**
  - Submit question
  - Admin approval
  - Public Q&A page (only approved)

---

## 6) Back-of-house (Admin) — what we need in MVP
**Goal:** Be able to easily upload content by section.

### Content types (MVP)
- **Article (For Parents)**
- **Mini Tip (Quick 5′ solution)** (optional but useful)
- **Activity**
- **Printable (PDF/PNG)**
- **Q&A entry** (question/answer, status)

### Fields (for Article)
- Title, slug, excerpt
- Category (1 primary), tags
- Age (0–2 / 2–4 / 4–6 / all)
- Reading time (auto or manual)
- 3 "Takeaways" (bullets)
- SEO: title/description/OG image
- Status: draft / review / published

### Moderation (Q&A)
- status: draft → approved → published
- Ability to edit before publication

---

## 7) Next step (next step after Task 3)
- Wireframe for **Activities & Printables** (list + filters + preview/download)
- Wireframe for **Support page** (forms + moderation flow)
- Then: populate with 10 articles + 10 activities + 3 freebies (starter content)

---

## 10) Task 5 — "Support / Contact" Page (Wireframe)
**Goal:** Collect **video ideas**, feedback and questions in an organized way, and build community **safely** (moderated Q&A).

### 10.1 What the page will have (MVP)
1) **Hero**
- Title: "Your opinion matters"
- Short explanation: "Send a video idea, feedback or question. Q&As are only published after approval."

2) **Tabs / form options (1 page, 3 forms)**
- Tab 1: **Video idea**
- Tab 2: **Feedback**
- Tab 3: **Question (Q&A)**

3) **Q&A Preview (only approved)**
- 3–6 cards with "approved" questions/answers
- CTA: "View all Q&As" + "Ask a question"

4) **Rules / Safety**
- 3–5 bullets (e.g., no personal information about children, we don't provide medical diagnoses, publication only after approval)

5) **Alternative contact channels**
- email, social (if you want)

---

### 10.2 Fields per form (MVP)

**A) Video idea**
- Name (optional)
- Email (optional)
- Child's age (dropdown, optional): 0–2 / 2–4 / 4–6 / other
- Topic (dropdown): Vocabulary / Routines / Nutrition / Emotions / Other
- Message (textarea)

**B) Feedback**
- Name (optional)
- Email (optional)
- What did you like? (textarea)
- What should we improve? (textarea)
- (optional) rating 1–5

**C) Question (Q&A)**
- Name (optional)
- Email (optional, for notification)
- Category (dropdown)
- Question (textarea)
- Checkbox: "I agree to have the question published if approved (without personal information)"

---

### 10.3 Back-office / Admin for Support
- Submissions table with filters: type (idea/feedback/q&a), status, date
- Status workflow:
  - idea/feedback: new → read → archived
  - Q&A: new → draft answer → approved → published
- Ability to "edit" before publication (Q&A)
- Export CSV (nice-to-have)

---

## 11) Next (Task 6)
- Decide: which CMS to use for content + where to store form submissions
- Populate MVP with starter content (10 articles + 10 activities/printables + 3 freebies)

---

## 12) Task 6 — "About" Page (Front-end closing)
**Goal:** Build **trust**, explain *who we are/why we exist*, and lead to next action (channel, newsletter, support).

### 12.1 Wireframe (in order)
1) **Hero**
- Title: "Hello! We are Mikroi Mathites."
- 1–2 sentences: what we do & for which ages
- Badges: "0–6", "Greek Abroad", "Watch together"
- CTAs: "View channel" + "Send message"
- Visual: photo/illustration (Victoria/Iris/Bruno)

2) **3 cards (quick understanding)**
- "Our mission"
- "Why we started"
- "What you'll find here" (Parent Hub + Activities + moderated Q&A)

3) **Our team**
- 3 small cards: Ms. Victoria / Iris / Bruno (or "the team")

4) **Mini FAQ**
- 3–5 quick questions (ages, how to use videos, where to send ideas)

5) **Quick links (sidebar or block)**
- Support / Contact
- Activities & Printables
- Newsletter
- (optional) Media kit for partnerships

6) **Final CTA**
- "Tell us what you'd like to see" → Support
- "Subscribe to newsletter" → signup

### 12.2 Content checklist (MVP)
- Short, warm description (2–4 paragraphs max)
- 1–2 photos or 1 illustration (brand)
- 3 bullets: what we offer
- Link to YouTube
- Link to Support

---

## 13) Next (Task 7 — CMS)
- Choose CMS (CMS-first) for: Articles (For Parents), Activities, Printables, Q&A
- Define content models + roles + editorial workflow
- Connect form submissions with admin moderation

---

## 14) Task 7 — CMS + DB (Canonical models)
**Decision:** Option A — **DB (Supabase/Postgres) for submissions/moderation** + **Sanity for editorial content**.  
**Goal:** Have "our own" operational data (requests/feedback/moderation) and simultaneously top-tier authoring for content.

**Tech Stack Confirmed:**
- **Next.js 16** (App Router, Server Components, Turbopack)
- **Sanity CMS** (headless, for Articles/Activities/Printables/Q&A)
- **Supabase** (Postgres for submissions/analytics, Auth for admin)
- **Tailwind CSS** (styling with custom design system)
- **TypeScript** (type safety throughout)
- **Vercel** (hosting, edge functions, ISR)

---

### 14.1 Canonical models (Source of Truth)
These are the models we keep stable, regardless of CMS:

**Content (Editorial):**
- `Article` (For Parents)
- `Activity` (Activity)
- `Printable` (Printable)
- `QAItem` (Approved Q&A — published)

**Operational (in our own DB):**
- `Submission` (Video idea / Feedback / Question)
- (Later) `Account`, `Favorite`, `CourseProgress`, `Order`

**Taxonomies (shared):**
- `AgeGroup` (0–2 / 2–4 / 4–6 / GreekAbroad)
- `Category`
- `Tag`

---

### 14.2 Where things live (MVP)
- **Sanity**: Articles / Activities / Printables / Published Q&A + Taxonomies (for SEO pages)
- **Supabase (Postgres)**: Submissions queue (ideas/feedback/questions) + moderation statuses

> Workflow: User submits form → written to Supabase → admin responds/approves → if it's a Q&A to be published, we create/update `QAItem` in Sanity (published).

---

### 14.3 Supabase DB schema (MVP) — Submissions
**Table: `submissions`**
- `id` (uuid, pk)
- `type` (enum): `video_idea | feedback | question`
- `name` (text, nullable)
- `email` (text, nullable)
- `child_age_group` (text, nullable): `0-2 | 2-4 | 4-6 | other`
- `topic` (text, nullable): `sleep | speech | food | emotions | screens | other`
- `message` (text, required)
- `status` (enum):
  - for idea/feedback: `new | read | archived`
  - for question: `new | draft_answer | approved | rejected | published`
- `admin_notes` (text, nullable)
- `created_at` (timestamptz, default now)

**Nice-to-have (later):**
- `attachments` (storage refs)
- `source_page` (url)
- `locale` (el)

---

### 14.4 Sanity schemas (MVP) — Content
**Article**
- `title`, `slug`, `excerpt`
- `category` (ref), `tags` (refs)
- `ageGroup` (multi)
- `readingTime` (number)
- `takeaways` (array of strings, 3–5)
- `body` (rich content)
- `coverImage`
- `seo` (title, description, ogImage)
- `status` (draft/published) (or just draft/unpublished via Sanity)

**Activity**
- `title`, `slug`, `excerpt`
- `ageGroup`, `duration` (5/10/15+)
- `goals` (multi)
- `materials` (array)
- `steps` (structured list or rich)
- `variations` (easy/hard)
- `coverImage`
- `relatedPrintables` (refs)
- `seo`

**Printable**
- `title`, `slug`, `excerpt`
- `ageGroup`, `duration`, `goals`
- `file` (PDF)
- `previewImages` (1–6)
- `instructions`
- `coverImage`
- `seo`

**QAItem (Published)**
- `question`
- `answer`
- `category` (ref)
- `ageGroup`
- `publishedAt`

**Taxonomies**
- `Category` (title, slug, icon/emoji optional)
- `Tag` (title, slug)
- `AgeGroup` (title, slug)

---

### 14.5 Next.js 16 integration (portable)
**Rule:** Don't scatter queries across pages/components. Build 1 layer:

- `lib/content/` (content provider layer)
  - `getArticles(filters)` - Server Component function
  - `getArticleBySlug(slug)` - Server Component function
  - `getActivities(filters)` - Server Component function
  - `getActivityBySlug(slug)` - Server Component function
  - `getPrintables(filters)` - Server Component function
  - `getPrintableBySlug(slug)` - Server Component function
  - `getQAItems()` - Server Component function

**Next.js 16 Best Practices:**
- Server Components for data fetching (no client-side queries)
- `unstable_cache` for explicit caching (revalidateTag for invalidation)
- ISR (Incremental Static Regeneration) with `revalidate` option
- Webhooks from Sanity → revalidate paths via API route
- Streaming SSR for better UX (loading states)

This way, if we change CMS (Sanity → Strapi), we only change this layer.

---

### 14.6 Admin flow (MVP)
- **Submissions inbox** (Supabase):
  - filters by `type` and `status`
  - change status (read/archived etc.)
  - for `question`: draft answer → approved/rejected
- **Publish Q&A**:
  - when `approved`, create `QAItem` in Sanity for public page/SEO
  - update `submissions.status = published`

---

## 15) Task 8 — CMS Choice (Sanity) & Setup checklist
- Create Sanity project + schemas (Article/Activity/Printable/QAItem/Taxonomies)
- Roles (Admin/Editor/Moderator)
- Preview mode for Next.js 16 (Server Components compatible)
- Webhooks → API route → revalidateTag for ISR (Next.js 16 caching)
- Media strategy (PDFs/preview images) - Sanity CDN + Supabase Storage fallback
- Sanity Studio customization (brand colors, custom components)

---

## 16) Database Design (Professional) — Tracking + Taxonomy + Scale
**Goal:** Have a "proper" data model for:
- **Activity tracking** (visits/reads/downloads) per post/page
- **Clean taxonomy** (ages, categories, tags) for "For Parents" & activities
- **Scale** (grow to accounts, favorites, courses, e-shop)

> Editorial content remains in **Sanity**, but we keep "canonical IDs" in our own DB so we can do analytics, aggregations and future features.

---

### 16.1 Data Strategy (Recommended: Hybrid)
- **Sanity = content source** (Article/Activity/Printable/QAItem + taxonomy refs)
- **Supabase/Postgres = operational + analytics**
  - submissions/moderation (Support)
  - event tracking (views/reads/downloads)
  - aggregations (daily/weekly counters)
  - (later) accounts/favorites/progress/orders

---

### 16.2 Canonical Content Registry (bridge CMS ↔ DB)
**Table: `content_items`**
Keeps every post/page we want to track, with "link" to Sanity.

Fields (proposal):
- `id` uuid PK
- `source` text: `sanity`
- `cms_id` text (unique) — e.g. Sanity _id
- `type` text: `article | activity | printable | qa | page`
- `slug` text (unique per type)
- `title` text
- `primary_category_id` uuid nullable (FK → categories)
- `published_at` timestamptz nullable
- `is_active` boolean default true
- timestamps

> This allows us to keep analytics **even if CMS changes**.

---

### 16.3 Taxonomy (clean taxonomy for scale)
**Tables:**
- `age_groups` (`0_2`, `2_4`, `4_6`, `greek_abroad`)
- `categories` (e.g. sleep, speech, food, emotions, screens, routines)
- `tags`

**Join tables (many-to-many):**
- `content_age_groups` (content_id, age_group_id)
- `content_tags` (content_id, tag_id)
- (optional) `content_categories` if we want multi-category

> In MVP you can keep taxonomy in Sanity too, but it's good to "lock" IDs/slugs here for consistency.

---

### 16.4 Event Tracking (accurate but scalable)
**Table: `events`** (append-only)
Every event that happens on the website.

Fields:
- `id` bigint / uuid PK
- `event_type` text:
  - `page_view`, `read_complete`, `download`, `search`, `newsletter_signup`, `submit_form`
- `content_id` uuid nullable (FK → content_items)
- `path` text (fallback for pages without content_id)
- `referrer` text nullable
- `session_id` uuid nullable
- `user_id` uuid nullable (if/when you add accounts)
- `meta` jsonb nullable (e.g. query term, download file id)
- `created_at` timestamptz default now

**Privacy note:** We don't store raw IP. If you want dedupe/anti-spam, store `ip_hash` (sha256 + salt) with short retention.

---

### 16.5 Aggregations (fast dashboards without heavy queries)
To avoid always counting over millions of events:

**Table: `content_metrics_daily`**
- `date` (date)
- `content_id` uuid
- counters:
  - `page_views` int
  - `unique_sessions` int
  - `read_completes` int
  - `downloads` int
- PK: (`date`, `content_id`)

**Table: `site_metrics_daily`** (optional)
- `date`
- totals: page_views, sessions, newsletter_signups, submissions

> Update strategy: nightly job (cron) or streaming upsert (e.g. each event does upsert daily row).

---

### 16.6 "Read" measurement (for "read")
For "For Parents" we want something more meaningful than page view:
- `page_view` when it loads
- `read_complete` when:
  - user reached 80–90% scroll, **and**
  - ≥ X seconds passed (e.g. 30–60s)

This gives real "read" metric.

---

### 16.7 Indexing & Scale notes
- `events(created_at desc)`, `events(content_id, created_at desc)`, `events(event_type, created_at desc)`
- For scale: partition events by month (later), or keep only 90–180 days raw events and keep aggregates forever.
- Dashboards read from `content_metrics_daily` (fast).

---

### 16.8 Admin / Reporting (what you'll see)
**Dashboard (future, but data model supports it):**
- Top articles by:
  - views, read_completes, downloads
- Performance by category/age
- Funnels:
  - view → read_complete → newsletter_signup
- Submissions stats:
  - how many "video ideas" per topic, how many approved Q&As

---

### 16.9 Future-ready tables (Phase 2+)
- `favorites` (user_id, content_id, created_at)
- `saved_collections` + `collection_items`
- `course_progress` (user_id, course_id, lesson_id, progress)
- `orders` / `order_items` (e-shop)

---

### 16.10 What we implement in MVP
MVP DB includes:
- `submissions`, `submission_answers`, `submission_events` (Support)
- `content_items` + taxonomy tables (registry for analytics)
- `events` + `content_metrics_daily` (tracking + aggregates)

**Next step:** Write SQL migrations + RLS policies for all of the above.

---

## 17) Iteration 1 — Supabase DB Modeling Spec (Operational + Analytics)
**Goal:** First production-ready iteration for:
- submissions/moderation (Support)
- analytics (views/reads/downloads) for content from Sanity
- clean taxonomy (age/category/tag) for reporting
- structure that scales to accounts/favorites/courses/shop

**Basic decision:**  
- Editorial content in **Sanity**  
- Operational + analytics in **Supabase/Postgres**

**ID strategy (recommended):**
- `content_items.id` = **uuid** (stable internal id)
- `events.id` = **bigint** (fast/cheap for many rows)
- `session_id` = uuid (cookie-based)

---

### 17.1 Enums
```sql
-- Submission types
create type submission_type as enum ('video_idea', 'feedback', 'question');

-- Submission status (unified enum for MVP simplicity)
create type submission_status as enum (
  'new', 'read', 'archived',
  'draft_answer', 'approved', 'rejected', 'published'
);

-- Topics
create type submission_topic as enum (
  'sleep','speech','food','emotions','screens','routines','greek_abroad','other'
);

-- Age groups
create type age_group_slug as enum ('0_2','2_4','4_6','greek_abroad','other');

-- Event types
create type event_type as enum (
  'page_view','read_complete','download','search','newsletter_signup','submit_form'
);
```

---

### 17.2 Core Tables (Operational)

#### A) `submissions` (Support inbox)
```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  type submission_type not null,
  topic submission_topic null,
  child_age_group age_group_slug null,

  name text null,
  email text null,
  message text not null,

  status submission_status not null default 'new',
  admin_notes text null,
  assigned_to uuid null, -- FK -> profiles.id (optional)
  source text null,      -- 'landing' | 'support' | etc.

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index submissions_type_status_created_idx
  on submissions (type, status, created_at desc);
create index submissions_topic_idx on submissions (topic);
create index submissions_age_idx on submissions (child_age_group);
```

#### B) `submission_answers` (draft/final answer for questions)
```sql
create table submission_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  answer text not null,
  is_final boolean not null default false,
  created_by uuid null, -- FK -> profiles.id
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index submission_answers_submission_idx
  on submission_answers (submission_id, created_at desc);
```

#### C) `submission_events` (audit log)
```sql
create table submission_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  event_type text not null, -- 'status_changed' | 'note_added' | 'assigned' | etc.
  from_status submission_status null,
  to_status submission_status null,
  meta jsonb null,
  created_by uuid null, -- FK -> profiles.id
  created_at timestamptz not null default now()
);
create index submission_events_submission_idx
  on submission_events (submission_id, created_at desc);
```

---

### 17.3 Users / Roles (Supabase Auth + profiles)
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text null,
  role text not null default 'moderator', -- 'admin' | 'editor' | 'moderator'
  created_at timestamptz not null default now()
);
create index profiles_role_idx on profiles (role);
```

---

### 17.4 Content Registry (Bridge Sanity → DB analytics)
#### A) `content_items`
```sql
create table content_items (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'sanity',
  cms_id text not null, -- Sanity _id
  type text not null,   -- 'article' | 'activity' | 'printable' | 'qa' | 'page'
  slug text not null,
  title text not null,
  primary_category_id uuid null,
  published_at timestamptz null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, cms_id),
  unique (type, slug)
);
create index content_items_type_published_idx
  on content_items (type, published_at desc);
```

> Sync strategy: when you publish in Sanity → webhook that upserts `content_items`.

---

### 17.5 Taxonomy (for filters & reports)
#### A) `age_groups`
```sql
create table age_groups (
  id uuid primary key default gen_random_uuid(),
  slug age_group_slug not null unique,
  title text not null
);
```

#### B) `categories`
```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null
);
```

#### C) `tags`
```sql
create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null
);
```

#### D) Join tables
```sql
create table content_age_groups (
  content_id uuid not null references content_items(id) on delete cascade,
  age_group_id uuid not null references age_groups(id) on delete cascade,
  primary key (content_id, age_group_id)
);

create table content_tags (
  content_id uuid not null references content_items(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (content_id, tag_id)
);

-- Optional, if we want multi-category:
create table content_categories (
  content_id uuid not null references content_items(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (content_id, category_id)
);
```

---

### 17.6 Analytics — Raw Events (append-only)
#### A) `events` (big volume)
```sql
create table events (
  id bigint generated always as identity primary key,
  event_type event_type not null,
  content_id uuid null references content_items(id) on delete set null,
  path text null,       -- fallback when we don't have content_id
  referrer text null,
  session_id uuid null,
  user_id uuid null references auth.users(id) on delete set null,
  meta jsonb null,
  created_at timestamptz not null default now()
);

create index events_created_idx on events (created_at desc);
create index events_content_created_idx on events (content_id, created_at desc);
create index events_type_created_idx on events (event_type, created_at desc);
```

**Read tracking rule (MVP):**
- `read_complete` event when:
  - scroll ≥ 85% **and**
  - time on page ≥ 45s (configurable)

---

### 17.7 Analytics — Aggregates (for dashboards)
#### A) `content_metrics_daily`
```sql
create table content_metrics_daily (
  date date not null,
  content_id uuid not null references content_items(id) on delete cascade,
  page_views int not null default 0,
  unique_sessions int not null default 0,
  read_completes int not null default 0,
  downloads int not null default 0,
  primary key (date, content_id)
);
create index content_metrics_daily_date_idx on content_metrics_daily (date desc);
```

**Update strategy (MVP):**
- (1) *Streaming upsert* on each event (fast, simple) or
- (2) *Nightly job* that calculates from `events` (clean, but needs scheduled job)

> For MVP I recommend (1) upsert daily counters **+** keep raw events 90–180 days.

---

### 17.8 RLS (Security) — High-level rules
- `submissions`:  
  - **insert**: allowed to anon (only specific columns)  
  - **select/update**: only admins/moderators
- `events`:  
  - **insert**: allowed to anon (with `session_id`)  
  - **select**: only admins
- `content_metrics_daily`:  
  - **select**: admins (or public read if you want public counters)

> We'll implement helper function `is_staff()` that checks role from `profiles`.

---

### 17.9 Scale plan (Phase 2+ tables)
- `favorites` (user_id, content_id)
- `saved_collections` + `collection_items`
- `course_progress`
- `orders` / `order_items`

---

### 17.10 Next steps (Implementation)
1) Create migrations (enums + tables + indexes)  
2) Triggers for `updated_at`  
3) RLS policies + `is_staff()` helper function  
4) API routes (Next.js 16 App Router) for:
   - `POST /api/submissions` - insert submissions
   - `POST /api/events` - insert events (page_view/read_complete/download/search)
   - `POST /api/revalidate` - Sanity webhook handler (revalidateTag)
5) Sanity webhook → `/api/revalidate` → upsert `content_items` (+ taxonomy joins)
6) Server Components for data fetching (no client-side queries)
7) Leverage Next.js 16 Turbopack for faster development builds
