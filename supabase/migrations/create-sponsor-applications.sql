-- Migration: Create sponsor_applications table
-- Stores sponsor application submissions from the public form

CREATE TABLE IF NOT EXISTS sponsor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Applicant Information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  
  -- Sponsor Details
  category TEXT CHECK (category IN ('education', 'health', 'local', 'tech', 'other')),
  sponsor_type TEXT CHECK (sponsor_type IN ('business', 'individual', 'organization')),
  description TEXT,
  tagline TEXT,
  
  -- Logo Upload (private bucket, signed URLs)
  logo_storage_path TEXT, -- Path in Supabase Storage (private bucket)
  logo_file_name TEXT, -- Original filename (for reference only)
  logo_mime_type TEXT, -- Validated MIME type
  logo_file_size INTEGER, -- File size in bytes
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'payment_pending')),
  admin_notes TEXT,
  
  -- Payment Information (for future)
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  payment_amount DECIMAL(10, 2),
  payment_provider TEXT CHECK (payment_provider IN ('paypal', 'stripe', 'manual')),
  payment_reference TEXT, -- External payment ID (for idempotency)
  
  -- Dates
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_status ON sponsor_applications(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_contact_email ON sponsor_applications(contact_email);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_submitted_at ON sponsor_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_payment_reference ON sponsor_applications(payment_reference) 
  WHERE payment_reference IS NOT NULL; -- Partial index for payment lookups

-- Unique constraint: One application per email per day
-- Using a unique index with expression (PostgreSQL doesn't allow functions in table constraints)
-- DATE_TRUNC is immutable when used with a fixed timezone (UTC)
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_per_day 
  ON sponsor_applications(contact_email, DATE_TRUNC('day', (submitted_at AT TIME ZONE 'UTC')));

-- Enable RLS
ALTER TABLE sponsor_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Secure - No USING (true) catch-all)

-- Public can INSERT (anyone can apply)
CREATE POLICY "Public can submit applications"
  ON sponsor_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can SELECT (view applications)
-- Uses is_admin() helper to avoid RLS recursion
CREATE POLICY "Admins can view all applications"
  ON sponsor_applications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only admins can UPDATE (approve/reject)
-- Uses is_admin() helper to avoid RLS recursion
CREATE POLICY "Admins can update applications"
  ON sponsor_applications
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Note: Service role (supabaseAdmin) bypasses RLS automatically, so no policy needed

-- Add comments for documentation
COMMENT ON TABLE sponsor_applications IS 'Stores sponsor application submissions. Public can insert, only admins can view/update.';
COMMENT ON COLUMN sponsor_applications.logo_storage_path IS 'Path in Supabase Storage private bucket (sponsor-logos)';
COMMENT ON COLUMN sponsor_applications.payment_reference IS 'External payment ID for idempotency (used in Solution 2)';

