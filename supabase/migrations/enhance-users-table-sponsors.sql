-- Migration: Add sponsor-related fields to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_sponsor BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sponsor_application_id UUID REFERENCES sponsor_applications(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_is_sponsor ON users(is_sponsor);
CREATE INDEX IF NOT EXISTS idx_users_sponsor_application_id ON users(sponsor_application_id) 
  WHERE sponsor_application_id IS NOT NULL;

-- Add comments
COMMENT ON COLUMN users.is_sponsor IS 'Indicates if user is a sponsor';
COMMENT ON COLUMN users.sponsor_application_id IS 'Reference to sponsor application';

