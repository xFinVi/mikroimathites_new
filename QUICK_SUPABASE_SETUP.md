# Quick Supabase Setup Guide

## ✅ Step 1: Fix Environment Variables

Your `.env.local` file should look like this (remove the "service=" prefix from the key):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** 
- The file must be named `.env.local` (with a dot at the start)
- The `SUPABASE_SERVICE_ROLE_KEY` should NOT have "service=" prefix
- Only these 2 variables are needed

## ✅ Step 2: Create Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase/schema-submissions.sql` from this project
6. Copy the entire contents
7. Paste into the SQL Editor
8. Click **Run** (or press Cmd/Ctrl + Enter)
9. You should see "Success. No rows returned"

## ✅ Step 3: Verify Tables Were Created

1. In Supabase dashboard, click **Table Editor**
2. You should see two tables:
   - `submissions`
   - `submission_answers`
3. Click on `submissions` to see its structure

## ✅ Step 4: Test the Connection

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/epikoinonia

3. Try submitting a test form (any tab)

4. Check Supabase dashboard → **Table Editor** → `submissions` table
   - You should see your test submission!

## ✅ That's It!

You now have:
- ✅ Database tables created
- ✅ Forms connected to Supabase
- ✅ Data being saved

## Troubleshooting

### "Supabase is not configured"
- Check `.env.local` file exists (with dot at start)
- Restart dev server after adding variables
- Verify variable names match exactly

### "Table does not exist"
- Run the SQL schema again
- Check SQL Editor for any errors
- Verify you're in the correct project

### Forms not submitting
- Check browser console for errors
- Check Supabase dashboard → Logs
- Verify RLS policies allow inserts

## Next Steps

- View submissions in Supabase dashboard
- Set up admin view (optional)
- Add email notifications (optional)

