/**
 * scripts/import-articles.mjs
 * One-time runner: imports all generated .md articles into Supabase as drafts.
 * Uploads matching .webp images to Supabase Storage bucket "blog-images".
 *
 * Usage:
 *   node scripts/import-articles.mjs
 *
 * Run from: /Users/Apple/Desktop/BabyName/namely-web
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";
import { marked } from "marked";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, "../.env.local") });

marked.setOptions({ gfm: true, breaks: false });

// ── Config ────────────────────────────────────────────────────────────────────

const ARTICLES_DIR = join(__dirname, "../../blog-automation/output/articles");
const IMAGES_DIR = join(__dirname, "../../blog-automation/output/images");
const BUCKET = "blog-images";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const [, yamlBlock, body] = match;
  const meta = {};

  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    meta[key] = rawVal.replace(/^["']|["']$/g, "");
  }

  return { meta, body: body.trim() };
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!existsSync(ARTICLES_DIR)) {
  console.error(`❌ Articles directory not found: ${ARTICLES_DIR}`);
  console.error("   Run blog_automation.py first to generate articles.");
  process.exit(1);
}

const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
console.log(`\n🚀 Importing ${files.length} articles into Supabase...\n`);

let success = 0;
const errors = [];

for (const file of files) {
  const slug = basename(file, ".md");
  const mdPath = join(ARTICLES_DIR, file);
  const imgPath = join(IMAGES_DIR, `${slug}.webp`);

  console.log(`── ${slug}`);

  // 1. Upload image to Supabase Storage
  let featured_image_url = null;
  if (existsSync(imgPath)) {
    const buffer = readFileSync(imgPath);

    // Check if already uploaded
    const { data: listed } = await supabase.storage
      .from(BUCKET)
      .list("", { search: `${slug}.webp` });

    if (listed && listed.some((f) => f.name === `${slug}.webp`)) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${slug}.webp`);
      featured_image_url = data.publicUrl;
      console.log(`  ⏭  Image already uploaded`);
    } else {
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(`${slug}.webp`, buffer, { contentType: "image/webp", upsert: true });

      if (uploadErr) {
        console.warn(`  ⚠️  Image upload warning: ${uploadErr.message}`);
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${slug}.webp`);
      featured_image_url = data.publicUrl;
      console.log(`  📸 Image → ${featured_image_url}`);
    }
  } else {
    console.log(`  ⚠️  No image found at ${imgPath}`);
  }

  // 2. Parse article
  const raw = readFileSync(mdPath, "utf-8");
  const { meta, body } = parseFrontmatter(raw);

  if (!meta.title || !meta.slug) {
    errors.push(`${file}: Missing title or slug in frontmatter`);
    console.error(`  ❌ Missing frontmatter fields`);
    continue;
  }

  // 3. Render markdown to HTML
  const content_html = marked.parse(body);

  // 4. Parse keywords
  const keywords = meta.keywords
    ? meta.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  // 5. Upsert into blog_posts (status: draft — cron-job.org publishes daily)
  const { error: upsertErr } = await supabase
    .from("blog_posts")
    .upsert(
      {
        slug: meta.slug || slug,
        title: meta.title,
        description: meta.description || "",
        content_md: body,
        content_html,
        featured_image_url,
        topic: meta.topic || "",
        keywords,
        reading_time: meta.readingTime || meta.reading_time || "",
        status: "draft",
        published_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

  if (upsertErr) {
    errors.push(`${slug}: ${upsertErr.message}`);
    console.error(`  ❌ Upsert failed: ${upsertErr.message}`);
  } else {
    success++;
    console.log(`  ✅ Imported as draft: "${meta.title}"`);
  }
}

console.log("\n═══════════════════════════════════════════");
console.log(`✅ Successfully imported: ${success}/${files.length}`);
if (errors.length > 0) {
  console.log(`❌ Errors (${errors.length}):`);
  errors.forEach((e) => console.log(`   - ${e}`));
}
console.log("═══════════════════════════════════════════");
console.log("\nNext step: set up cron-job.org to call:");
console.log("  POST https://matchbabynames.com/api/blog/publish-next-draft");
console.log("  Header: x-blog-admin-secret: <your BLOG_ADMIN_SECRET>\n");
