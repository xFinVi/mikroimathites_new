# Contributing to Μικροί Μαθητές

Thank you for your interest in contributing! This guide will help you get set up and understand how to contribute to the project.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Sanity account** (free tier works) - [Sign up](https://www.sanity.io/)
- **Supabase account** (free tier works) - [Sign up](https://supabase.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mikroimathites_new.git
cd mikroimathites_new
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# See "Environment Variables" section below for details
```

### 4. Set Up Sanity CMS

1. **Create a Sanity project:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Create a new project
   - Note your Project ID

2. **Get API tokens:**
   - Go to **API** → **Tokens**
   - Create a token with **Editor** role (for write access)
   - Copy the token to `SANITY_TOKEN` in `.env.local`

3. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_TOKEN=your-write-token
   ```

4. **Access Sanity Studio:**
   - Run `npm run dev`
   - Visit `http://localhost:3000/studio`
   - Create your content types and add some test content

### 5. Set Up Supabase Database

1. **Create a Supabase project:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for it to finish provisioning

2. **Get API credentials:**
   - Go to **Settings** → **API**
   - Copy your **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy your **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **Important:** Use `service_role` key, not `anon` key

3. **Run database migrations:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run migrations in order from `supabase/migrations/`:
     - `create-users-table.sql`
     - `create-content-views.sql`
     - `create-content-downloads.sql`
     - `create-newsletter-subscriptions.sql`
     - `create-submissions-table.sql`
     - `fix-submission-status-enum.sql`

4. **Create admin user (optional):**
   - See `docs/setup/` for admin user creation guide

### 6. Set Up Email Service (Resend)

1. **Create Resend account:**
   - Go to [resend.com](https://resend.com/)
   - Sign up (free tier works)

2. **Get API key:**
   - Go to **API Keys**
   - Create a new API key
   - Copy to `RESEND_API_KEY` in `.env.local`

3. **Set admin email:**
   ```env
   ADMIN_EMAIL=your-email@example.com
   ```

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

---

## 📋 Environment Variables

See `.env.example` for a complete template. Here's what you need:

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Sanity Manage → Project Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Usually `production` |
| `SANITY_TOKEN` | Sanity write token | Sanity Manage → API → Tokens |
| `SANITY_REVALIDATE_SECRET` | Webhook secret | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `NEXTAUTH_SECRET` | NextAuth secret | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` (dev) |
| `RESEND_API_KEY` | Resend API key | Resend Dashboard → API Keys |
| `ADMIN_EMAIL` | Admin email address | Your email |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense client ID |
| `NEXT_PUBLIC_SITE_URL` | Production site URL |

---

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router (pages & API routes)
│   ├── api/               # API endpoints
│   ├── admin/             # Admin dashboard (protected)
│   ├── gia-goneis/        # For Parents section
│   ├── drastiriotites/    # Activities section
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── ...
├── lib/                  # Utilities and libraries
│   ├── content/          # Content fetching (Sanity)
│   ├── sanity/           # Sanity client & queries
│   ├── supabase/         # Supabase client
│   ├── analytics/        # Analytics utilities
│   └── ...
├── hooks/                # React hooks
├── sanity/               # Sanity Studio configuration
├── supabase/             # Database migrations
└── docs/                 # Documentation
```

---

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - Complete system architecture and how everything connects
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Detailed development guide and best practices
- **[Deployment Guide](docs/DEPLOYMENT_HOSTINGER_VPS.md)** - VPS deployment instructions
- **[Sanity Setup](docs/setup/sanity-webhook.md)** - Sanity webhook configuration

---

## 🔧 Development Workflow

### Making Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write code following existing patterns
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes:**
   ```bash
   # Run linter
   npm run lint

   # Build to check for errors
   npm run build
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Then create a Pull Request on GitHub
   ```

### Code Style

- **TypeScript:** Use TypeScript for all new files
- **Formatting:** Use Prettier (configured in project)
- **Linting:** Follow ESLint rules (configured in project)
- **Components:** Use functional components with hooks
- **Naming:** Use descriptive names, follow existing conventions

### Testing

- Test locally before pushing
- Check that pages load correctly
- Test form submissions
- Verify API routes work
- Check mobile responsiveness

---

## 🐛 Troubleshooting

### "Sanity client not configured"

- Check `.env.local` exists and has `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Verify values don't have quotes or extra spaces
- Restart dev server after changing `.env.local`

### "Supabase admin client not initialized"

- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Verify you're using `service_role` key, not `anon` key
- Check Supabase project is active

### "NextAuth secret missing"

- Generate a secret: `openssl rand -base64 32`
- Add to `.env.local` as `NEXTAUTH_SECRET`
- Restart dev server

### Build errors

- Run `npm install` to ensure dependencies are up to date
- Check Node.js version: `node --version` (should be 18+)
- Clear `.next` folder: `rm -rf .next` then rebuild

### Port already in use

- Change port: `npm run dev -- -p 3001`
- Or kill process on port 3000

---

## 📝 Commit Message Guidelines

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add newsletter subscription form
fix: resolve mobile menu icon alignment
docs: update architecture documentation
refactor: simplify content fetching logic
```

---

## 🎯 Areas for Contribution

- **Bug fixes** - Fix issues reported in GitHub Issues
- **New features** - Implement features from roadmap
- **Documentation** - Improve docs, add examples
- **Performance** - Optimize queries, reduce bundle size
- **Accessibility** - Improve ARIA labels, keyboard navigation
- **Testing** - Add tests for critical paths

---

## ❓ Getting Help

- **Documentation:** Check `docs/` folder and `ARCHITECTURE.md`
- **Issues:** Search existing GitHub Issues
- **Questions:** Open a GitHub Discussion

---

## 📄 License

All rights reserved.

---

**Thank you for contributing to Μικροί Μαθητές!** 🎉
