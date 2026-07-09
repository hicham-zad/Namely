-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-create profile (users row) when a new auth user signs up via OAuth.
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Function that fires on new auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, gender_preference, style_tags, origin_filters)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)  -- fallback: use email prefix as display name
    ),
    'both',
    '{}',
    '{}'
  )
  ON CONFLICT (id) DO NOTHING;  -- safe to run multiple times, won't duplicate
  RETURN NEW;
END;
$$;

-- 2. Trigger that calls the function on every new auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill: create profiles for any auth users who signed in already
--    but don't have a row in public.profiles yet
INSERT INTO public.profiles (id, display_name, gender_preference, style_tags, origin_filters)
SELECT
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ),
  'both',
  '{}',
  '{}'
FROM auth.users au
LEFT JOIN public.profiles pu ON pu.id = au.id
WHERE pu.id IS NULL;  -- only insert if not already existing
