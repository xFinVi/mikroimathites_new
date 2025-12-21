# Μικροί Μαθητές — Parent Hub

Modern Parent Hub built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **CMS:** Sanity
- **Database:** Supabase

## Getting Started

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

Create a `.env.local` file with:

**Sanity:**
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_TOKEN` (optional)
- `SANITY_REVALIDATE_SECRET`

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Analytics (optional):**
- `NEXT_PUBLIC_GA_ID`

## Project Status

### ✅ Completed Features

- **Foundation:** Next.js 16, TypeScript, Tailwind CSS, Design System
- **Pages:** Home, For Parents, Activities, About, Contact
- **CMS Integration:** Sanity Studio embedded, all content types configured
- **Content Pages:** Articles, Activities, Recipes, Printables with detail pages
- **Forms:** Unified contact form (Video Ideas, Feedback, Q&A) submitting to Supabase
- **Search & Filters:** Age, category, and type filtering with URL params
- **SEO:** Dynamic sitemap, robots.txt, metadata optimization
- **UI Components:** Accordion FAQ, card layouts, responsive navigation
- **Admin:** Basic admin view for submissions

### 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── lib/                  # Utilities and content layer
│   ├── content/         # Content provider (Sanity)
│   └── sanity/          # Sanity client and queries
├── sanity/               # Sanity Studio configuration
└── scripts/              # Utility scripts
```

## Build

```bash
npm run build
npm start
```

## Access Sanity Studio

Visit `http://localhost:3000/studio` to manage content.
