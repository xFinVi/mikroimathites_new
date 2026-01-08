# Μικροί Μαθητές - Project Summary

**Last Updated:** December 2025  
**Status:** Production Ready ✅

---

## 📋 Quick Overview

**Μικροί Μαθητές** is a modern Parent Hub built with Next.js 16, providing educational content, activities, and resources for parents with children 0-6 years old.

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **CMS:** Sanity (headless CMS)
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js v5
- **Email:** Resend
- **Analytics:** Google Analytics 4 + AdSense
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Sanity account
- Supabase account

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
Create `.env.local` with:
```env
# Sanity (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2024-03-01
SANITY_TOKEN=your-read-token
SANITY_WRITE_TOKEN=your-write-token

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (Required for Admin)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (Required)
RESEND_API_KEY=your-resend-key
ADMIN_EMAIL=admin@example.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX

# Site URL (Optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup
Run migrations in Supabase Dashboard → SQL Editor:
1. `supabase/migrations/create-users-table.sql`
2. `supabase/migrations/create-content-views.sql`
3. `supabase/migrations/fix-submission-status-enum.sql`

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes
│   ├── gia-goneis/        # For Parents section
│   ├── drastiriotites/    # Activities section
│   └── studio/            # Sanity Studio
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Header, footer, navigation
│   ├── admin/            # Admin dashboard components
│   └── ...
├── lib/                  # Core utilities
│   ├── constants.ts      # All constants (consolidated)
│   ├── content/          # Content layer (Sanity)
│   ├── sanity/           # Sanity client & config
│   ├── supabase/         # Supabase client
│   ├── auth/             # Authentication
│   ├── email/            # Email service (Resend)
│   └── utils/            # Utilities (consolidated)
├── sanity/               # Sanity Studio config
│   └── schemas/          # Content schemas
└── supabase/             # Database migrations
```

---

## ✅ Key Features

### Content Management
- ✅ Articles, Recipes, Activities, Printables
- ✅ Age groups, Categories, Tags
- ✅ Q&A system (user submissions → admin review → publish)
- ✅ Featured content system (manual curation)
- ✅ Homepage sections (Hero, Featured, For Parents, Activities)
- ✅ Sanity Studio embedded at `/studio`

### User Features
- ✅ Contact forms (Video Ideas, Feedback, Q&A)
- ✅ Newsletter subscription
- ✅ Server-side search & filtering
- ✅ Server-side pagination
- ✅ Age group & category filtering
- ✅ Content view tracking

### Admin Dashboard
- ✅ Authentication (NextAuth.js + Supabase)
- ✅ Submission management (view, reply, archive, delete)
- ✅ Email notifications (Resend)
- ✅ Q&A workflow (create drafts in Sanity)
- ✅ Dashboard statistics
- ✅ Mobile-responsive (hamburger menu at <1024px)

### Technical
- ✅ Error handling on all pages
- ✅ Loading states with skeletons
- ✅ Cookie consent (GDPR compliant)
- ✅ SEO optimization
- ✅ Responsive design (mobile menu at <1024px)
- ✅ Production-safe logging
- ✅ TypeScript type safety

---

## 🔧 Development

### Common Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
```

### Access Points
- **App:** http://localhost:3000
- **Sanity Studio:** http://localhost:3000/studio
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

### Code Patterns

**Server Components (Default):**
```typescript
export default async function Page() {
  const articles = await getArticles();
  return <ArticlesList articles={articles} />;
}
```

**Client Components (When Needed):**
```typescript
"use client";
export function InteractiveComponent() {
  const [state, setState] = useState("");
  return <div>{state}</div>;
}
```

**Constants (Centralized):**
```typescript
import { GIA_GONEIS_CONSTANTS } from "@/lib/constants";
const pageSize = GIA_GONEIS_CONSTANTS.PAGE_SIZE;
```

**Utilities (Consolidated):**
```typescript
import { getContentUrl, getContentTypeLabel } from "@/lib/utils/content";
import { escapeHtml, getTopicLabel } from "@/lib/utils/forms";
```

---

## 📄 Main Pages

- `/` - Homepage (Hero, Featured Content, For Parents, Activities)
- `/gia-goneis` - For Parents hub (articles & recipes)
- `/gia-goneis/[slug]` - Article detail
- `/gia-goneis/recipes/[slug]` - Recipe detail
- `/drastiriotites` - Activities hub
- `/drastiriotites/[slug]` - Activity detail
- `/drastiriotites/printables/[slug]` - Printable detail
- `/age/[slug]` - Age group pages
- `/sxetika` - About page
- `/epikoinonia` - Contact page
- `/support` - Donation/support page
- `/donate` - Dedicated donation page
- `/privacy` - Privacy Policy
- `/terms` - Terms & Conditions
- `/studio` - Sanity Studio (content management)
- `/admin/dashboard` - Admin dashboard (protected)
- `/admin/submissions` - Submission management (protected)

---

## 🔐 Admin Dashboard

### Setup
1. Create admin user in Supabase Auth
2. Set `user_metadata.role = "admin"`
3. Login at `/auth/login`
4. Access dashboard at `/admin/dashboard`

### Features
- View all user submissions
- Filter by type, status, search
- Reply to submissions (creates Q&A draft in Sanity)
- Archive/delete submissions
- View dashboard statistics
- Access Sanity Studio

### Workflow
1. User submits question/feedback → stored in Supabase
2. Admin receives email notification
3. Admin reviews in dashboard
4. Admin replies → creates Q&A draft in Sanity
5. Admin publishes from Sanity Studio
6. Q&A appears on contact page

---

## 📊 Analytics & Tracking

### Google Analytics
- Setup: Add `NEXT_PUBLIC_GA_ID` to `.env.local`
- Cookie consent required
- Tracks page views, events, conversions

### View Tracking
- Automatic tracking on all content pages
- Bot detection (excludes crawlers)
- Session-based (anonymous)
- View counts displayed on detail pages
- Database: `content_views` table

---

## 🎨 Design System

### Colors
- **Primary Pink:** `#FF6B9D`
- **Secondary Blue:** `#4ECDC4`
- **Accent Yellow:** `#FFD93D`
- **Background Light:** `#F7F7F7`
- **Nav Dark:** `#1a1f3a`

### Responsive Breakpoints
- **Mobile:** < 1024px (hamburger menu)
- **Desktop:** ≥ 1024px (full navigation)

### Typography
- **Sans:** Inter (body text)
- **Display:** Poppins (headings)

---

## 🔄 Recent Refactoring (Dec 2025)

### Completed
- ✅ **Phase 1:** Documentation reorganization (9 → 2 root files)
- ✅ **Phase 2:** Utility consolidation (9 → 5 files)
- ✅ **Phase 3:** Infrastructure optimization (Sanity config split)

### Improvements
- Consolidated constants into `lib/constants.ts`
- Merged utility functions (content, forms, sanity)
- Split Sanity config (public/server) for better security
- Added server-only guards
- Improved code documentation

### File Structure
- **Constants:** All in `lib/constants.ts`
- **Utilities:** `lib/utils/content.ts`, `lib/utils/forms.ts`, `lib/utils/sanity.ts`
- **Sanity Config:** `lib/sanity/config.public.ts`, `lib/sanity/config.server.ts`

---

## 🐛 Known Issues

- TypeScript errors temporarily bypassed in `next.config.ts` (pre-existing issues in article pages)
- Requires investigation and proper fixes

---

## 📚 Additional Resources

### Documentation
- **README.md** - Quick start guide
- **DEVELOPER_GUIDE.md** - Detailed development guide

### External Docs
- [Next.js Docs](https://nextjs.org/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Build Commands
- Build: `npm run build`
- Start: `npm run start`
- Node: 18+

### Production Checklist
- [ ] Run database migrations
- [ ] Set all environment variables
- [ ] Test production build
- [ ] Verify all pages load
- [ ] Test form submissions
- [ ] Review security settings

---

## 📝 License

All rights reserved.

---

**Built with ❤️ for parents and children**


