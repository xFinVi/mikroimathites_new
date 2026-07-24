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

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values (see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions)

**Required:**
- Sanity CMS credentials (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_TOKEN`)
- Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- NextAuth (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- Resend email (`RESEND_API_KEY`, `ADMIN_EMAIL`)

See `.env.example` for complete list with descriptions.

## 🗄️ Database Setup

### Run Migrations

Before deploying, run these migrations in Supabase Dashboard → SQL Editor:

1. `supabase/migrations/create-users-table.sql`
2. `supabase/migrations/create-content-views.sql`
3. `supabase/migrations/create-content-downloads.sql`
4. `supabase/migrations/create-newsletter-subscriptions.sql`
5. `supabase/migrations/create-submissions-table.sql`
6. `supabase/migrations/fix-submission-status-enum.sql`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions.

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

### Getting Started
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Setup guide and contribution guidelines
- **[.env.example](.env.example)** - Environment variables template

### Architecture & Development
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete system architecture (Sanity, Supabase, data flow)
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Detailed development guide and best practices
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and summary

### Deployment & Setup
- **[docs/DEPLOYMENT_HOSTINGER_VPS.md](docs/DEPLOYMENT_HOSTINGER_VPS.md)** - VPS deployment instructions
- **[docs/setup/sanity-webhook.md](docs/setup/sanity-webhook.md)** - Sanity webhook configuration
- **[docs/sanity-write-token-setup.md](docs/sanity-write-token-setup.md)** - Sanity write token setup

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
# Force deployment trigger
# Test zero-downtime deployment
# Test SSH timeout fix
