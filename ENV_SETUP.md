# Environment Variables Setup

## Required Variables

You only need **2 variables** for the MVP:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Important Notes

1. **File Name**: Must be `.env.local` (with a dot at the start)
2. **Service Role Key**: Should NOT have "service=" prefix - just the JWT token
3. **No Quotes**: Don't wrap values in quotes
4. **No Spaces**: No spaces around the `=` sign

## Your Current Setup

I noticed your `env.local` file has:
- ✅ Correct URL
- ⚠️ Service key has "service=" prefix - **remove this!**

**Wrong:**
```bash
SUPABASE_SERVICE_ROLE_KEY=service=your_key_here
```

**Correct:**
```bash
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

## How to Fix

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Make sure it's named `.env.local` (with dot at start)
3. Remove the "service=" prefix from SUPABASE_SERVICE_ROLE_KEY
4. Save the file
5. Restart your dev server: `npm run dev`

## Test Connection

After fixing, test the connection:
1. Visit: http://localhost:3000/api/test-supabase
2. You should see a success message if everything works

## Other Variables (Not Needed for MVP)

The following are NOT needed for the forms to work:
- ❌ `publuishable keys` - Not used
- ❌ `secrete key` - Not used  
- ❌ `anon` - Not used

Only the 2 variables above are needed!

