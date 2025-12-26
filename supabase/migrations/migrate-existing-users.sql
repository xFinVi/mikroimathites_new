-- Migration: Migrate existing users from auth.users to users table
-- Run this AFTER create-users-table.sql to backfill existing users
-- This is idempotent - safe to run multiple times

-- Insert users from auth.users that don't exist in users table yet
INSERT INTO public.users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  CASE 
    WHEN au.raw_user_meta_data->>'role' = 'admin' OR 
         (au.raw_user_meta_data->>'isAdmin')::boolean = true 
    THEN 'admin'
    ELSE 'user'
  END
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Update existing users' roles if they're admin in user_metadata but not in users table
UPDATE public.users u
SET role = 'admin'
FROM auth.users au
WHERE u.id = au.id
  AND u.role = 'user'
  AND (
    au.raw_user_meta_data->>'role' = 'admin' OR 
    (au.raw_user_meta_data->>'isAdmin')::boolean = true
  );

-- Add comment
COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth users. Roles: admin, user. Run migrate-existing-users.sql to backfill existing users.';

