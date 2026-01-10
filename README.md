# Μικροί Μαθητές — Parent Hub

Modern Parent Hub built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **CMS:** Sanity
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (recommended)

## 📋 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account
- Supabase account

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file (see `.env.example` for template):

**Required:**
- `SANITY_PROJECT_ID` - Your Sanity project ID
- `SANITY_DATASET` - Dataset name (usually "production")
- `SANITY_API_VERSION` - API version (default: "2024-03-01")
- `SANITY_REVALIDATE_SECRET` - Secret for webhook revalidation
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

**Optional:**
- `SANITY_TOKEN` - Read token for drafts
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_SITE_URL` - Production site URL

## 🗄️ Database Setup

### Run Migrations

Before deploying, run these migrations in Supabase Dashboard → SQL Editor:

1. `supabase/migrations/create-newsletter-subscriptions.sql`
2. `supabase/migrations/create-content-views.sql` (if using analytics)

## 🏗️ Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Deployment

**Vercel (Recommended):**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

**Other Platforms:**
- Build command: `npm run build`
- Start command: `npm run start`
- Node version: 18+

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── gia-goneis/        # For Parents section
│   ├── drastiriotites/    # Activities section
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── ...
├── lib/                  # Utilities and content layer
│   ├── content/         # Content provider (Sanity)
│   ├── sanity/          # Sanity client and queries
│   ├── supabase/        # Supabase client
│   ├── analytics/       # Analytics utilities
│   └── utils/           # Utilities (logger, etc.)
├── hooks/               # React hooks
├── sanity/              # Sanity Studio configuration
└── supabase/            # Database migrations
```

## ✅ Features

### Content Management
- ✅ Articles, Recipes, Activities, Printables
- ✅ Age groups, Categories, Tags
- ✅ Q&A system
- ✅ Featured content system
- ✅ Sanity Studio embedded at `/studio`

### User Features
- ✅ Contact forms (Video Ideas, Feedback, Q&A)
- ✅ Newsletter subscription
- ✅ Server-side search & filtering
- ✅ Server-side pagination
- ✅ Age group filtering
- ✅ Category filtering

### Technical
- ✅ Error handling on all pages
- ✅ Loading states with skeleton components
- ✅ Cookie consent (GDPR compliant)
- ✅ Content tracking system
- ✅ Production-safe logging
- ✅ SEO optimization
- ✅ Responsive design

## 📄 Pages

- `/` - Homepage
- `/gia-goneis` - For Parents hub
- `/gia-goneis/[slug]` - Article detail
- `/gia-goneis/recipes/[slug]` - Recipe detail
- `/drastiriotites` - Activities hub
- `/drastiriotites/[slug]` - Activity detail
- `/drastiriotites/printables/[slug]` - Printable detail
- `/age/[slug]` - Age group pages
- `/sxetika` - About page
- `/epikoinonia` - Contact page
- `/privacy` - Privacy Policy
- `/terms` - Terms & Conditions
- `/studio` - Sanity Studio (content management)

## 🔧 Development

### Access Sanity Studio

Visit `http://localhost:3000/studio` to manage content.

### API Routes

- `POST /api/newsletter` - Newsletter subscription
- `POST /api/submissions` - Form submissions
- `POST /api/analytics/views` - Content view tracking
- `GET /api/analytics/views` - Get view counts
- `POST /api/revalidate` - Revalidate pages (webhook)

## 📚 Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview and summary
- [Developer Guide](DEVELOPER_GUIDE.md) - Detailed development guide and best practices

## 🚀 Production Checklist

Before deploying to production:

- [ ] Run database migrations in Supabase
- [ ] Set all environment variables
- [ ] Test production build (`npm run build`)
- [ ] Verify all pages load correctly
- [ ] Test form submissions
- [ ] Test search/filtering
- [ ] Review security settings

## 📝 License

All rights reserved.

---

**Built with ❤️ for parents and children**
# Trigger deployment test
# Test deployment
# Final deployment test
