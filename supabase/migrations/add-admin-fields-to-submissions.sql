-- Migration: Add admin fields to existing submissions table
-- This migration is safe to run on existing tables
-- It only adds missing columns and ensures policies/triggers exist

-- Add admin management fields if they don't exist
DO $$ 
BEGIN
  -- Add admin_notes if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE submissions ADD COLUMN admin_notes TEXT;
  END IF;

  -- Add admin_reply if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' AND column_name = 'admin_reply'
  ) THEN
    ALTER TABLE submissions ADD COLUMN admin_reply TEXT;
  END IF;

  -- Add admin_reply_sent_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' AND column_name = 'admin_reply_sent_at'
  ) THEN
    ALTER TABLE submissions ADD COLUMN admin_reply_sent_at TIMESTAMPTZ;
  END IF;

  -- Add published_to_sanity if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' AND column_name = 'published_to_sanity'
  ) THEN
    ALTER TABLE submissions ADD COLUMN published_to_sanity BOOLEAN DEFAULT false;
  END IF;

  -- Add sanity_qa_item_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' AND column_name = 'sanity_qa_item_id'
  ) THEN
    ALTER TABLE submissions ADD COLUMN sanity_qa_item_id TEXT;
  END IF;

  -- Update status column constraint if needed (add new statuses)
  -- Note: We can't easily modify CHECK constraints, so we'll leave status as is
  -- If status column doesn't have the right default, we'll set it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'submissions' 
    AND column_name = 'status' 
    AND column_default = '''new''::text'
  ) THEN
    -- Status column exists, just ensure default is set for new rows
    ALTER TABLE submissions ALTER COLUMN status SET DEFAULT 'new';
  END IF;
END $$;

-- Create or replace the update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists, then create it
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure RLS is enabled
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Allow anonymous insert on submissions" ON submissions;
DROP POLICY IF EXISTS "Allow authenticated read on submissions" ON submissions;
DROP POLICY IF EXISTS "Allow authenticated update on submissions" ON submissions;

-- Recreate policies
CREATE POLICY "Allow anonymous insert on submissions"
  ON submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add indexes if they don't exist (using IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_topic ON submissions(topic) WHERE topic IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_submissions_type_status ON submissions(type, status, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE submissions IS 'Stores all user submissions (questions, feedback, video ideas, reviews)';
COMMENT ON COLUMN submissions.type IS 'Type of submission: video_idea, feedback, question, or review';
COMMENT ON COLUMN submissions.status IS 'Status: new, in_progress, answered, published, or archived';
COMMENT ON COLUMN submissions.admin_reply IS 'Admin reply/answer to the submission';
COMMENT ON COLUMN submissions.published_to_sanity IS 'Whether this Q&A was published to Sanity CMS';
COMMENT ON COLUMN submissions.sanity_qa_item_id IS 'Reference to the Sanity qaItem document ID if published';


