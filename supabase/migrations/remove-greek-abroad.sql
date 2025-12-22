-- Migration: Remove greek_abroad from enums
-- Run this in Supabase SQL Editor if your database already has these enum values
-- This is safe to run even if the values don't exist (IF EXISTS prevents errors)

-- Note: PostgreSQL doesn't support DROP VALUE directly in older versions
-- If you get an error, you may need to recreate the enum types
-- This migration assumes PostgreSQL 12+ which supports ALTER TYPE ... DROP VALUE

-- Remove greek_abroad from age_group_slug enum
DO $$ 
BEGIN
  -- Check if the value exists before trying to remove it
  IF EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'greek_abroad' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'age_group_slug')
  ) THEN
    -- For PostgreSQL 12+, we can use ALTER TYPE ... DROP VALUE
    -- For older versions, you'll need to recreate the enum
    ALTER TYPE age_group_slug DROP VALUE IF EXISTS 'greek_abroad';
  END IF;
END $$;

-- Remove greek_abroad from submission_topic enum
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'greek_abroad' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'submission_topic')
  ) THEN
    ALTER TYPE submission_topic DROP VALUE IF EXISTS 'greek_abroad';
  END IF;
END $$;

-- Alternative approach if DROP VALUE doesn't work:
-- You'll need to recreate the enum types (this is more complex and requires
-- dropping and recreating the table, so only use if DROP VALUE fails)

