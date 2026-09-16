#!/usr/bin/env node
/**
 * scripts/queue-names.mjs
 *
 * Seeds the names_queue table with names to be processed by the daily cron job.
 * Run this whenever you want to add new names to the generation pipeline.
 *
 * Usage:
 *   node scripts/queue-names.mjs              # queue the default set below
 *   node scripts/queue-names.mjs --dry-run    # preview without writing
 *
 * Idempotent — skips slugs already in names_queue or name_pages.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Names to queue ─────────────────────────────────────────────────────────────
// Add new names here. priority: higher = processed sooner by the cron.
// All SSA data below is from 2023 (released May 2024).

const NAMES_TO_QUEUE = [
  // ── Girls Top 20 (post-pilot) ──────────────────────────────────────────────
  {
    slug: "mia",
    name: "Mia",
    gender: "girl",
    origin: "Latin/Scandinavian",
    pronunciation_ipa: "ˈmiː.ə",
    pronunciation_text: "MEE-uh",
    syllables: 2,
    nicknames: ["Mi"],
    ssa_rank: 6,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context: "Has held the top 10 for girls since 2009, beloved for its brevity and international appeal.",
    similar_names: ["ava", "emma", "isla", "aria", "nova", "eva", "luna"],
    sibling_names: { boys: ["Liam", "Noah", "Oliver", "Ethan"], girls: ["Ava", "Emma", "Olivia", "Luna"] },
    priority: 90,
  },
  {
    slug: "amelia",
    name: "Amelia",
    gender: "girl",
    origin: "Germanic",
    pronunciation_ipa: "əˈmiː.li.ə",
    pronunciation_text: "uh-MEE-lee-uh",
    syllables: 4,
    nicknames: ["Amy", "Mia", "Mel", "Lia"],
    ssa_rank: 8,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Climbed from outside the top 20 in 2000 to a top-10 fixture, carried by the vintage-name revival.",
    similar_names: ["emma", "olivia", "aurora", "eleanor", "violet", "clara", "isla"],
    sibling_names: { boys: ["Oliver", "Henry", "Theodore", "William"], girls: ["Charlotte", "Olivia", "Eleanor", "Violet"] },
    priority: 88,
  },
  {
    slug: "isabella",
    name: "Isabella",
    gender: "girl",
    origin: "Italian/Hebrew",
    pronunciation_ipa: "ˌɪz.əˈbɛl.ə",
    pronunciation_text: "iz-uh-BEL-uh",
    syllables: 5,
    nicknames: ["Bella", "Izzy", "Belle", "Isa"],
    ssa_rank: 9,
    ssa_year: 2023,
    trend_direction: "falling",
    trend_context: "Held #1 for girls 2008–2010 before Sophia eclipsed it; still a consistent top-10 classic.",
    similar_names: ["sophia", "elena", "aurora", "lucia", "eleanor", "victoria", "arabella"],
    sibling_names: { boys: ["Sebastian", "Alexander", "Gabriel", "Mateo"], girls: ["Sophia", "Olivia", "Elena", "Aurora"] },
    priority: 87,
  },
  {
    slug: "evelyn",
    name: "Evelyn",
    gender: "girl",
    origin: "Old English",
    pronunciation_ipa: "ˈɛv.ə.lɪn",
    pronunciation_text: "EV-uh-lin",
    syllables: 3,
    nicknames: ["Evie", "Eve", "Lyn"],
    ssa_rank: 10,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Surged from #50 in 2010 to the top 10 by 2018, a star of the grandma-chic revival.",
    similar_names: ["eleanor", "violet", "clara", "hazel", "audrey", "penelope", "beatrice"],
    sibling_names: { boys: ["Oliver", "Henry", "Theodore", "Jasper"], girls: ["Charlotte", "Eleanor", "Violet", "Hazel"] },
    priority: 86,
  },
  {
    slug: "harper",
    name: "Harper",
    gender: "girl",
    origin: "Old English",
    pronunciation_ipa: "ˈhɑːr.pər",
    pronunciation_text: "HAR-per",
    syllables: 2,
    nicknames: ["Harp", "Harpy"],
    ssa_rank: 11,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Spiked after 2011 as surname-style names surged, and has remained in the top 15 for girls.",
    similar_names: ["avery", "scarlett", "quinn", "reagan", "riley", "piper", "peyton"],
    sibling_names: { boys: ["Liam", "Logan", "Hudson", "Carter"], girls: ["Scarlett", "Avery", "Quinn", "Riley"] },
    priority: 85,
  },

  // ── Boys Top 20 (post-pilot) ───────────────────────────────────────────────
  {
    slug: "james",
    name: "James",
    gender: "boy",
    origin: "Hebrew/Latin",
    pronunciation_ipa: "dʒeɪmz",
    pronunciation_text: "JAYMZ",
    syllables: 1,
    nicknames: ["Jim", "Jimmy", "Jamie", "Jay"],
    ssa_rank: 5,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Consistently top-5 over multiple decades and now surging back after a brief dip — the ultimate timeless classic.",
    similar_names: ["henry", "william", "oliver", "charles", "theodore", "george", "edward"],
    sibling_names: { boys: ["Henry", "William", "Oliver", "Charles"], girls: ["Charlotte", "Eleanor", "Olivia", "Emma"] },
    priority: 90,
  },
  {
    slug: "henry",
    name: "Henry",
    gender: "boy",
    origin: "Germanic",
    pronunciation_ipa: "ˈhɛn.ri",
    pronunciation_text: "HEN-ree",
    syllables: 2,
    nicknames: ["Hank", "Harry", "Hen"],
    ssa_rank: 6,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Rose from #75 in 2000 to a top-10 fixture by 2020, the gold standard of the vintage-boy-name revival.",
    similar_names: ["oliver", "theodore", "william", "george", "arthur", "felix", "jasper"],
    sibling_names: { boys: ["Oliver", "Theodore", "William", "George"], girls: ["Charlotte", "Eleanor", "Violet", "Evelyn"] },
    priority: 89,
  },
  {
    slug: "lucas",
    name: "Lucas",
    gender: "boy",
    origin: "Latin/Greek",
    pronunciation_ipa: "ˈluː.kəs",
    pronunciation_text: "LOO-kus",
    syllables: 2,
    nicknames: ["Luke", "Luca"],
    ssa_rank: 7,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context: "Entered the top 10 around 2018 and has remained steady, prized for its pan-European feel.",
    similar_names: ["luca", "leo", "julian", "sebastian", "roman", "felix", "august"],
    sibling_names: { boys: ["Luca", "Leo", "Julian", "Sebastian"], girls: ["Luna", "Sofia", "Olivia", "Mia"] },
    priority: 88,
  },
  {
    slug: "mason",
    name: "Mason",
    gender: "boy",
    origin: "Old French/English",
    pronunciation_ipa: "ˈmeɪ.sən",
    pronunciation_text: "MAY-sun",
    syllables: 2,
    nicknames: ["Mase"],
    ssa_rank: 8,
    ssa_year: 2023,
    trend_direction: "falling",
    trend_context: "Hit #2 in 2011–2012 during the occupational-name boom; now settling into a reliable top-10 position.",
    similar_names: ["logan", "jackson", "carter", "hunter", "tyler", "ethan", "ryan"],
    sibling_names: { boys: ["Logan", "Jackson", "Carter", "Hunter"], girls: ["Olivia", "Emma", "Ava", "Harper"] },
    priority: 87,
  },
  {
    slug: "ethan",
    name: "Ethan",
    gender: "boy",
    origin: "Hebrew",
    pronunciation_ipa: "ˈiː.θən",
    pronunciation_text: "EE-thun",
    syllables: 2,
    nicknames: ["Eth"],
    ssa_rank: 9,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context: "Topped the charts in 2008–2010 and has remained a top-10 staple — the defining boy name of the millennial-parent era.",
    similar_names: ["liam", "noah", "aiden", "caleb", "logan", "nathan", "joshua"],
    sibling_names: { boys: ["Liam", "Noah", "Aiden", "Caleb"], girls: ["Emma", "Olivia", "Ava", "Sophia"] },
    priority: 86,
  },

  // ── Trending names ─────────────────────────────────────────────────────────
  {
    slug: "aurora",
    name: "Aurora",
    gender: "girl",
    origin: "Latin",
    pronunciation_ipa: "ɔːˈrɔːr.ə",
    pronunciation_text: "aw-ROR-uh",
    syllables: 4,
    nicknames: ["Rora", "Rori", "Aura"],
    ssa_rank: 12,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Surged from #60 in 2015 to top 15 by 2023, powered by the celestial-name wave and Disney associations.",
    similar_names: ["luna", "stella", "nova", "celeste", "lyra", "isla", "violet"],
    sibling_names: { boys: ["Orion", "Leo", "Felix", "Jasper"], girls: ["Luna", "Stella", "Nova", "Violet"] },
    priority: 85,
  },
  {
    slug: "theodore",
    name: "Theodore",
    gender: "boy",
    origin: "Greek",
    pronunciation_ipa: "ˈθiː.ə.dɔːr",
    pronunciation_text: "THEE-uh-dor",
    syllables: 4,
    nicknames: ["Theo", "Teddy", "Ted"],
    ssa_rank: 10,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context: "Climbed from outside the top 50 in 2010 to the top 10 by 2022, the crown jewel of the vintage-boy-name revival.",
    similar_names: ["oliver", "henry", "sebastian", "august", "felix", "jasper", "arthur"],
    sibling_names: { boys: ["Oliver", "Henry", "Felix", "Arthur"], girls: ["Charlotte", "Eleanor", "Violet", "Hazel"] },
    priority: 84,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────

const isDryRun = process.argv.includes("--dry-run");

async function queueNames() {
  console.log(`\n🗂  Name Queue Seeder${isDryRun ? " (DRY RUN)" : ""}\n`);
  console.log(`📋  ${NAMES_TO_QUEUE.length} names to process\n`);

  // Check which slugs already exist in name_pages or names_queue
  const slugs = NAMES_TO_QUEUE.map((n) => n.slug);

  const [pagesRes, queueRes] = await Promise.all([
    supabase.from("name_pages").select("slug").in("slug", slugs),
    supabase.from("names_queue").select("slug, status").in("slug", slugs),
  ]);

  const publishedSlugs = new Set(
    (pagesRes.data ?? []).map((r) => r.slug)
  );
  const queuedSlugs = new Map(
    (queueRes.data ?? []).map((r) => [r.slug, r.status])
  );

  let inserted = 0;
  let skipped = 0;

  for (const nameData of NAMES_TO_QUEUE) {
    if (publishedSlugs.has(nameData.slug)) {
      console.log(`  ⏭  ${nameData.name} — already published, skipping`);
      skipped++;
      continue;
    }

    if (queuedSlugs.has(nameData.slug)) {
      console.log(
        `  ⏭  ${nameData.name} — already in queue (${queuedSlugs.get(nameData.slug)}), skipping`
      );
      skipped++;
      continue;
    }

    if (isDryRun) {
      console.log(`  🔍  [DRY RUN] Would queue: ${nameData.name} (priority: ${nameData.priority})`);
      inserted++;
      continue;
    }

    const { error } = await supabase.from("names_queue").insert({
      ...nameData,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  ❌  Failed to queue ${nameData.name}:`, error.message);
    } else {
      console.log(`  ✅  Queued: ${nameData.name} (priority: ${nameData.priority})`);
      inserted++;
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅  Done. ${inserted} queued, ${skipped} skipped.`);

  if (!isDryRun && inserted > 0) {
    console.log(`\nNext steps:`);
    console.log(`  1. Visit Supabase → Table Editor → names_queue to verify`);
    console.log(`  2. Trigger a manual test: curl -X POST http://localhost:3000/api/cron/generate-names -H "Authorization: Bearer <CRON_SECRET>"`);
    console.log(`  3. Check generation_runs table for the run log`);
  }
}

queueNames().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
