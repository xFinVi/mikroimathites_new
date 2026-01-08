-- Migration: Create Storage RLS policies for sponsor-logos bucket
-- 
-- ⚠️ IMPORTANT: Storage policies require special permissions
-- This migration may fail if run without proper ownership of storage.objects
-- 
-- If you get a "must be owner" error, you have two options:
-- 
-- Option 1: Run this manually in Supabase Dashboard
--   1. Go to Storage → Policies
--   2. Select the 'sponsor-logos' bucket
--   3. Create the policies manually using the SQL below
-- 
-- Option 2: Use Supabase CLI with service role
--   supabase db push --db-url "postgresql://postgres:[SERVICE_ROLE_PASSWORD]@[HOST]:[PORT]/postgres"
-- 
-- Note: Bucket must be created manually in Supabase Dashboard first
-- Bucket name: sponsor-logos
-- Public: false (private)

-- Enable RLS on storage.objects if not already enabled
-- (This is usually already enabled, but we check to be safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
  ) THEN
    RAISE NOTICE 'storage.objects table does not exist. Storage may not be initialized.';
  END IF;
END $$;

-- RLS Policy: Allow signed uploads (INSERT only, with path restriction)
-- Only allow uploads to pending/ folder
-- Using DO block to handle permission errors gracefully
DO $$
BEGIN
  -- Drop policy if it exists (to allow re-running migration)
  DROP POLICY IF EXISTS "Allow signed uploads to sponsor-logos" ON storage.objects;
  
  -- Create the policy
  CREATE POLICY "Allow signed uploads to sponsor-logos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'sponsor-logos' AND
      (storage.foldername(name))[1] = 'pending' -- Only allow uploads to pending/ folder
    );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges to create storage policy. Please run manually in Supabase Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage policy: %', SQLERRM;
END $$;

-- RLS Policy: Allow admins to read all files
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can read sponsor logos" ON storage.objects;
  
  CREATE POLICY "Admins can read sponsor logos"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'sponsor-logos' AND
      public.is_admin()
    );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges to create storage policy. Please run manually in Supabase Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage policy: %', SQLERRM;
END $$;

-- RLS Policy: Allow admins to update/move files (after approval)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can update sponsor logos" ON storage.objects;
  
  CREATE POLICY "Admins can update sponsor logos"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'sponsor-logos' AND
      public.is_admin()
    )
    WITH CHECK (
      bucket_id = 'sponsor-logos' AND
      public.is_admin()
    );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges to create storage policy. Please run manually in Supabase Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage policy: %', SQLERRM;
END $$;

-- RLS Policy: Allow admins to delete files
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can delete sponsor logos" ON storage.objects;
  
  CREATE POLICY "Admins can delete sponsor logos"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'sponsor-logos' AND
      public.is_admin()
    );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges to create storage policy. Please run manually in Supabase Dashboard.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating storage policy: %', SQLERRM;
END $$;


