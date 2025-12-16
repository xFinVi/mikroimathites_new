# Μικροί Μαθητές — Parent Hub

Modern Parent Hub built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **CMS:** Sanity (to be configured)
- **Database:** Supabase (to be configured)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── container.tsx
│   └── layout/            # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── lib/
│   ├── utils.ts           # Utility functions (cn helper)
│   └── design-tokens.ts   # Design system tokens
└── public/                # Static assets
```

## Design System

### Colors

- **Primary Pink:** `#FF6B9D`
- **Secondary Blue:** `#4ECDC4`
- **Accent Yellow:** `#FFD93D`
- **Accent Green:** `#95E1D3`
- **Accent Orange:** `#FFA07A`

### Typography

- **Primary Font:** Inter (with Greek support)
- **Display Font:** Poppins (optional)

### Spacing

4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

## Git Workflow

- `main` - Production branch
- `develop` - Development/testing branch
- `task-*` - Feature branches for each task

## Current Status

**Task 1: Project Foundation + Design System** (In Progress)
- ✅ Next.js 16 project initialized
- ✅ Tailwind CSS configured
- ✅ shadcn/ui installed
- ✅ Design tokens created
- ✅ Base components (Button, Card, Input, Container)
- ✅ Layout components (Header, Footer, Navigation)
- ✅ Fonts configured (Inter with Greek support)

## Next Steps

- Complete Task 1 testing
- Start Task 2: Core Pages Structure
