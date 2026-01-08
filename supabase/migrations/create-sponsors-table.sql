-- Migration: Create sponsors table
-- Stores approved sponsors (synced to Sanity for public display)
-- NO public SELECT policy - sensitive fields (contact_email) protected
-- Homepage fetches from Sanity only (safe fields)

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES sponsor_applications(id),
  user_id UUID REFERENCES users(id),
  
  -- Sponsor Information (from application)
  company_name TEXT NOT NULL,
  logo_url TEXT, -- Sanity CDN URL after sync
  website TEXT,
  contact_email TEXT, -- Sensitive - not exposed to public
  category TEXT CHECK (category IN ('education', 'health', 'local', 'tech', 'other')),
  sponsor_type TEXT CHECK (sponsor_type IN ('business', 'individual', 'organization')),
  tier TEXT NOT NULL DEFAULT 'standard' 
    CHECK (tier IN ('premium', 'standard', 'community')),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Sanity Sync
  sanity_document_id TEXT UNIQUE, -- Unique to prevent duplicates
  last_synced_to_sanity TIMESTAMPTZ,
  sync_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (sync_status IN ('pending', 'synced', 'failed')),
  
  -- Dates
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsors_is_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_sponsors_sync_status ON sponsors(sync_status);
CREATE INDEX IF NOT EXISTS idx_sponsors_sanity_document_id ON sponsors(sanity_document_id) 
  WHERE sanity_document_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sponsors_application_id ON sponsors(application_id);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: Do NOT expose sensitive fields (contact_email) to public
-- Homepage fetches from Sanity only (which has safe fields only)
-- Database table remains admin-only

-- Admins can view all sponsors (using is_admin() helper)
CREATE POLICY "Admins can view all sponsors"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins can update sponsors
CREATE POLICY "Admins can update sponsors"
  ON sponsors
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can insert sponsors
CREATE POLICY "Admins can insert sponsors"
  ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Note: Service role (supabaseAdmin) bypasses RLS automatically

-- Add comments for documentation
COMMENT ON TABLE sponsors IS 'Stores approved sponsors. Admin-only access. Public data fetched from Sanity.';
COMMENT ON COLUMN sponsors.contact_email IS 'Sensitive field - not synced to Sanity, not exposed to public';
COMMENT ON COLUMN sponsors.sanity_document_id IS 'Reference to Sanity document (for idempotent sync)';

