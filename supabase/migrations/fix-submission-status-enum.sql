-- Migration: Fix submission status column to allow all required statuses
-- This ensures "answered" and other statuses are valid values

-- First, check if there's an enum type and convert it to text
DO $$ 
BEGIN
  -- If enum type exists, we need to convert the column to text
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    -- First, remove the default (which depends on the enum)
    ALTER TABLE submissions ALTER COLUMN status DROP DEFAULT;
    
    -- Convert the column from enum to text using USING clause
    ALTER TABLE submissions ALTER COLUMN status TYPE TEXT USING status::TEXT;
    
    -- Now we can drop the enum type
    DROP TYPE IF EXISTS submission_status;
    
    -- Restore the default as text
    ALTER TABLE submissions ALTER COLUMN status SET DEFAULT 'new';
  END IF;
END $$;

-- Now ensure the status column allows all required values
-- Drop existing CHECK constraint if it exists
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Find and drop any existing CHECK constraint on status
  FOR r IN (
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'submissions'::regclass
      AND contype = 'c'
      AND conname LIKE '%status%'
  ) LOOP
    EXECUTE 'ALTER TABLE submissions DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- Add a new CHECK constraint that allows all required statuses
ALTER TABLE submissions
  ADD CONSTRAINT submissions_status_check 
  CHECK (status IN ('new', 'in_progress', 'answered', 'published', 'archived'));

-- Ensure default is set
ALTER TABLE submissions ALTER COLUMN status SET DEFAULT 'new';

-- Add comment
COMMENT ON COLUMN submissions.status IS 'Status: new, in_progress, answered, published, or archived';

