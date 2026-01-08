-- Migration: Create is_admin() helper function
-- This function checks if the current user is an admin by reading from app_metadata
-- Uses auth.jwt() to read from app_metadata.user_role (users CANNOT self-update)
-- This prevents privilege escalation attacks

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Read from JWT app_metadata (custom claims) - secure, users cannot modify
  user_role := (auth.jwt() -> 'app_metadata' ->> 'user_role');
  
  -- Return true if role is 'admin'
  RETURN user_role = 'admin';
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.is_admin() IS 'Checks if current user is admin by reading from app_metadata.user_role. Users cannot self-update app_metadata, preventing privilege escalation.';

