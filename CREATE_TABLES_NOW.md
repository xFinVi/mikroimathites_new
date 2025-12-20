# 🚨 Create Database Tables Now

## The Error

```
Could not find the table 'public.submissions' in the schema cache
```

This means the database tables don't exist yet. You need to create them!

## Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Copy the SQL Schema

1. Open the file: `supabase/schema-submissions.sql` from this project
2. **Select ALL** the contents (Cmd/Ctrl + A)
3. **Copy** (Cmd/Ctrl + C)

### Step 3: Paste and Run

1. Go back to Supabase SQL Editor
2. **Paste** the SQL (Cmd/Ctrl + V)
3. Click **Run** button (or press Cmd/Ctrl + Enter)
4. Wait for "Success. No rows returned" message

### Step 4: Verify Tables Created

1. In Supabase dashboard, click **Table Editor** (left sidebar)
2. You should see:
   - ✅ `submissions` table
   - ✅ `submission_answers` table

### Step 5: Test Again

1. Go back to: http://localhost:3000/epikoinonia
2. Submit a test form
3. Check Supabase → **Table Editor** → `submissions` table
4. Your submission should appear! 🎉

## What the SQL Creates

- ✅ Enum types (submission_type, submission_status, age_group_slug, submission_topic)
- ✅ `submissions` table (stores all form submissions)
- ✅ `submission_answers` table (stores Q&A answers)
- ✅ Indexes (for fast queries)
- ✅ Triggers (auto-update timestamps)
- ✅ RLS policies (security rules)

## Troubleshooting

### "Relation already exists"
- Tables already created - that's fine!
- Just test the form now

### "Permission denied"
- Make sure you're using the SQL Editor (not a restricted view)
- You should have admin access to your project

### Still getting errors?
- Check Supabase dashboard → **Logs** for more details
- Verify you're in the correct project
- Make sure the SQL ran successfully

## Next Steps After Tables Are Created

1. ✅ Test form submission at `/epikoinonia`
2. ✅ View data in Supabase Table Editor
3. ✅ Set up admin view (optional, later)

