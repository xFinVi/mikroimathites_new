# ⚠️ Environment Variable Fix Needed

## The Problem

Your `.env.local` file has a placeholder value:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url  ❌ This is a placeholder!
```

## The Fix

Replace `your_url` with your actual Supabase project URL:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abqefajosdwcakypnbhd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicWVmYWpvc2R3Y2FreXBuYmhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIwMzgwNywiZXhwIjoyMDgxNzc5ODA3fQ.ZoZ891mJVTCEQtQqX1k15y1QD48hWGDDaV_0WdBL3DY
```

## Steps

1. Open `.env.local` file
2. Find the line: `NEXT_PUBLIC_SUPABASE_URL=your_url`
3. Replace `your_url` with: `https://abqefajosdwcakypnbhd.supabase.co`
4. Save the file
5. **Restart your dev server** (important!)

## Verify

After fixing, restart the server and check:
- Visit: http://localhost:3000/api/test-supabase
- Should show success message

## Your Correct .env.local Should Look Like:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abqefajosdwcakypnbhd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicWVmYWpvc2R3Y2FreXBuYmhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIwMzgwNywiZXhwIjoyMDgxNzc5ODA3fQ.ZoZ891mJVTCEQtQqX1k15y1QD48hWGDDaV_0WdBL3DY
```

**No quotes, no spaces, no "service=" prefix!**

