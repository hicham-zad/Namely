-- ============================================================
-- Namely Blog — Supabase SQL Setup
-- Run once in the Supabase SQL Editor
-- ============================================================

-- 1. Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text UNIQUE NOT NULL,
  title              text NOT NULL,
  description        text,
  content_md         text,
  content_html       text,
  featured_image_url text,
  topic              text,
  keywords           text[],
  reading_time       text,
  status             text DEFAULT 'draft'
                          CHECK (status IN ('draft', 'published')),
  published_at       timestamptz,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

-- 2. Indexes for fast list queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON blog_posts (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_topic
  ON blog_posts (topic);

-- 3. Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. Drop policies if they exist (makes script re-runnable)
DROP POLICY IF EXISTS "Public read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Service role full access" ON blog_posts;

-- 5. Public can SELECT published posts only
CREATE POLICY "Public read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- 6. Service role has full access (used by Next.js server-side with service key)
CREATE POLICY "Service role full access"
  ON blog_posts FOR ALL
  USING (auth.role() = 'service_role');

-- 7. Supabase Storage bucket: run this AFTER creating the bucket in the dashboard
--    Dashboard → Storage → New Bucket → Name: blog-images → Public: YES

-- 8. Verify table was created
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
