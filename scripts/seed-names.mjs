#!/usr/bin/env node
/**
 * scripts/seed-names.mjs
 *
 * Generates rich, SEO-optimised content for the pilot 10 baby name pages
 * using OpenAI, then upserts them into the Supabase `name_pages` table.
 *
 * Usage:
 *   node scripts/seed-names.mjs
 *
 * Env vars required (already in .env.local):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY
 */

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ── Config ────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}
if (!OPENAI_API_KEY) {
  console.error("❌  Missing OPENAI_API_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ── Pilot seed data (SSA 2023 verified) ───────────────────────────────────────
// SSA source: https://www.ssa.gov/oact/babynames/  (2023 data, released May 2024)

const PILOT_NAMES = [
  {
    slug: "olivia",
    name: "Olivia",
    gender: "girl",
    origin: "Latin",
    pronunciation_ipa: "əˈlɪv.i.ə",
    pronunciation_text: "oh-LIV-ee-uh",
    syllables: 4,
    nicknames: ["Liv", "Livvy", "Olive", "Lia"],
    ssa_rank: 1,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context:
      "Has held the #1 or #2 spot for girls every year since 2019, making it the defining name of its generation.",
    similar_names: ["luna", "aurora", "emma", "isla", "violet", "eleanor", "sophia"],
    sibling_names: { boys: ["Liam", "Oliver", "Noah", "Elijah"], girls: ["Charlotte", "Emma", "Ava", "Isla"] },
  },
  {
    slug: "liam",
    name: "Liam",
    gender: "boy",
    origin: "Irish",
    pronunciation_ipa: "liːm",
    pronunciation_text: "LEEM",
    syllables: 1,
    nicknames: ["Li"],
    ssa_rank: 1,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context:
      "Held the #1 boy name in the US from 2017 to 2023, the longest streak for any name this century.",
    similar_names: ["noah", "oliver", "ethan", "aiden", "finn", "logan", "caleb"],
    sibling_names: { boys: ["Noah", "Oliver", "Elijah"], girls: ["Olivia", "Emma", "Charlotte", "Sophia"] },
  },
  {
    slug: "luna",
    name: "Luna",
    gender: "girl",
    origin: "Latin",
    pronunciation_ipa: "ˈluː.nə",
    pronunciation_text: "LOO-nuh",
    syllables: 2,
    nicknames: ["Lou", "Lulu"],
    ssa_rank: 2,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context:
      "Climbed from #757 in 2010 to #2 by 2023, one of the fastest ascents in SSA history — fuelled by the nature-name and celestial-name wave.",
    similar_names: ["aurora", "stella", "nova", "celeste", "lyra", "selene", "isla"],
    sibling_names: { boys: ["Orion", "Leo", "Felix", "Jasper"], girls: ["Aurora", "Stella", "Nova", "Violet"] },
  },
  {
    slug: "noah",
    name: "Noah",
    gender: "boy",
    origin: "Hebrew",
    pronunciation_ipa: "ˈnoʊ.ə",
    pronunciation_text: "NOH-uh",
    syllables: 2,
    nicknames: ["No", "Noe"],
    ssa_rank: 2,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context:
      "Topped the US charts from 2013 to 2016 and has remained in the top 3 ever since, a fixture of the biblical-name revival.",
    similar_names: ["liam", "elijah", "caleb", "ezra", "jonah", "miles", "eli"],
    sibling_names: { boys: ["Elijah", "Liam", "Oliver"], girls: ["Olivia", "Emma", "Ava", "Charlotte"] },
  },
  {
    slug: "emma",
    name: "Emma",
    gender: "girl",
    origin: "Germanic",
    pronunciation_ipa: "ˈɛm.ə",
    pronunciation_text: "EM-uh",
    syllables: 2,
    nicknames: ["Em", "Emmy"],
    ssa_rank: 4,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context:
      "Dominated the US top 3 for girls between 2008 and 2021, a reign of over a decade, and remains firmly in the top 5.",
    similar_names: ["olivia", "ava", "amelia", "mia", "ella", "sophia", "grace"],
    sibling_names: { boys: ["Liam", "Noah", "Oliver", "Henry"], girls: ["Olivia", "Ava", "Sophia", "Charlotte"] },
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    gender: "girl",
    origin: "French",
    pronunciation_ipa: "ˈʃɑːr.lət",
    pronunciation_text: "SHAR-lut",
    syllables: 3,
    nicknames: ["Charlie", "Lottie", "Char", "Carly"],
    ssa_rank: 3,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context:
      "Surged into the top 5 after 2014 and continued climbing, buoyed by royal associations and the vintage-revival trend.",
    similar_names: ["eleanor", "olivia", "victoria", "penelope", "beatrice", "cecelia", "clara"],
    sibling_names: { boys: ["Henry", "William", "Theodore", "Oliver"], girls: ["Olivia", "Eleanor", "Violet", "Isla"] },
  },
  {
    slug: "oliver",
    name: "Oliver",
    gender: "boy",
    origin: "Latin",
    pronunciation_ipa: "ˈɒl.ɪ.vər",
    pronunciation_text: "OL-ih-ver",
    syllables: 3,
    nicknames: ["Ollie", "Oli"],
    ssa_rank: 3,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context:
      "Rose from outside the top 100 in 2000 to a top-3 fixture by 2020 — the signature boy name of the 2020s vintage revival.",
    similar_names: ["liam", "noah", "theo", "henry", "august", "felix", "jasper"],
    sibling_names: { boys: ["Henry", "Theodore", "Felix", "Jasper"], girls: ["Olivia", "Charlotte", "Violet", "Isla"] },
  },
  {
    slug: "sophia",
    name: "Sophia",
    gender: "girl",
    origin: "Greek",
    pronunciation_ipa: "soʊˈfiː.ə",
    pronunciation_text: "so-FEE-uh",
    syllables: 3,
    nicknames: ["Sophie", "Sofie", "Soph"],
    ssa_rank: 7,
    ssa_year: 2023,
    trend_direction: "falling",
    trend_context:
      "After reaching #1 in 2011–2013, Sophia has gradually slipped to the top 10, though it remains a perennial classic.",
    similar_names: ["olivia", "isabella", "aurora", "elena", "clara", "lucia", "victoria"],
    sibling_names: { boys: ["Alexander", "Sebastian", "Elijah", "Adrian"], girls: ["Olivia", "Isabella", "Emma", "Ava"] },
  },
  {
    slug: "elijah",
    name: "Elijah",
    gender: "boy",
    origin: "Hebrew",
    pronunciation_ipa: "ɪˈlaɪ.dʒə",
    pronunciation_text: "ih-LY-juh",
    syllables: 3,
    nicknames: ["Eli", "Lij"],
    ssa_rank: 4,
    ssa_year: 2023,
    trend_direction: "rising",
    trend_context:
      "Steadily rose from the 40s in 2010 to the top 4 by 2023, part of the wider resurgence of Old Testament names.",
    similar_names: ["noah", "isaiah", "ezra", "eli", "malachi", "caleb", "josiah"],
    sibling_names: { boys: ["Noah", "Isaiah", "Ezra", "Caleb"], girls: ["Aria", "Delilah", "Hannah", "Naomi"] },
  },
  {
    slug: "ava",
    name: "Ava",
    gender: "girl",
    origin: "Latin",
    pronunciation_ipa: "ˈeɪ.və",
    pronunciation_text: "AY-vuh",
    syllables: 2,
    nicknames: ["Avi"],
    ssa_rank: 5,
    ssa_year: 2023,
    trend_direction: "stable",
    trend_context:
      "Entered the top 5 in 2005 and has stayed there for nearly two decades, making it one of the most enduring short girl names of the era.",
    similar_names: ["emma", "mia", "isla", "eva", "nova", "aria", "nora"],
    sibling_names: { boys: ["Liam", "Noah", "Oliver", "Ethan"], girls: ["Emma", "Olivia", "Mia", "Isla"] },
  },
];

// ── AI prompt for each name ────────────────────────────────────────────────────

function buildPrompt(n) {
  return `You are a baby name expert writing SEO content for matchbabynames.com.
Generate rich, genuinely useful content for the baby name "${n.name}" (${n.gender}'s name, ${n.origin} origin).

Return ONLY a valid JSON object with exactly these keys — no markdown, no code fences, no extra text:

{
  "meaning_short": "A single complete sentence giving the core meaning of ${n.name}. Must be self-contained — an AI answer engine should be able to lift this sentence verbatim.",
  "meaning_long": "Three paragraphs of genuine prose (separated by \\n\\n) covering: (1) etymology and linguistic roots, (2) cultural/historical context and how the name spread, (3) modern usage and connotations. Do NOT repeat the quick-facts block — add depth. No marketing fluff.",
  "middle_names": {
    "classic": ["4 classic middle name pairings that flow well with ${n.name}"],
    "modern": ["4 modern/fresh middle name pairings"],
    "one_syllable": ["4 punchy one-syllable middle names"],
    "family_friendly": ["4 middle names that work as family name bridges"]
  },
  "famous_namesakes": [
    {"name": "Full Name", "known_for": "Brief description (10-15 words max)"}
  ],
  "personality_note": "2-3 sentences describing: what kind of parent chooses ${n.name}, what aesthetic or era it fits, and what makes this name choice distinctive. This is the ONLY section allowed to have brand voice — the rest must be factual. Make it specific to ${n.name}, not generic."
}

Rules:
- famous_namesakes: include only real, verifiable people. If fewer than 2 exist, return an empty array [].
- middle_names: each array should have exactly 4 entries, each is a first+middle combo like "${n.name} Rose" or "${n.name} James".
- meaning_short: must begin with "${n.name} is" or "${n.name} means" and be a complete, citable sentence.
- personality_note: must be unique to ${n.name} — it should not be copy-pasteable onto any other name page.
- Return only valid JSON. No trailing commas.`;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function generateNameContent(nameData) {
  console.log(`  🤖  Generating content for ${nameData.name}…`);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a baby name expert. Always respond with valid JSON only — no markdown fences, no explanatory text.",
      },
      { role: "user", content: buildPrompt(nameData) },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

async function seedNames() {
  console.log("🚀  Starting name page seeder — pilot 10 names\n");

  let successCount = 0;
  let errorCount = 0;

  for (const nameData of PILOT_NAMES) {
    try {
      console.log(`\n📝  Processing: ${nameData.name} (slug: ${nameData.slug})`);

      // Generate AI content
      const ai = await generateNameContent(nameData);

      // Compose the full row
      const row = {
        slug: nameData.slug,
        name: nameData.name,
        gender: nameData.gender,
        origin: nameData.origin,
        meaning_short: ai.meaning_short,
        meaning_long: ai.meaning_long,
        pronunciation_ipa: nameData.pronunciation_ipa,
        pronunciation_text: nameData.pronunciation_text,
        syllables: nameData.syllables,
        nicknames: nameData.nicknames,
        ssa_rank: nameData.ssa_rank,
        ssa_year: nameData.ssa_year,
        trend_direction: nameData.trend_direction,
        trend_context: nameData.trend_context,
        middle_names: ai.middle_names,
        similar_names: nameData.similar_names,
        sibling_names: nameData.sibling_names,
        famous_namesakes:
          ai.famous_namesakes && ai.famous_namesakes.length > 0
            ? ai.famous_namesakes
            : null,
        personality_note: ai.personality_note,
        status: "published",
        updated_at: new Date().toISOString(),
      };

      // Upsert into Supabase (update if slug already exists)
      const { error } = await supabase
        .from("name_pages")
        .upsert(row, { onConflict: "slug" });

      if (error) {
        console.error(`  ❌  Supabase error for ${nameData.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`  ✅  ${nameData.name} seeded (SSA rank #${nameData.ssa_rank})`);
        successCount++;
      }

      // Rate-limit: 1 second between OpenAI calls
      if (PILOT_NAMES.indexOf(nameData) < PILOT_NAMES.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      console.error(`  ❌  Failed to process ${nameData.name}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅  Done. ${successCount} seeded, ${errorCount} failed.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Run: node scripts/qa-name-batch.mjs --batch pilot`);
  console.log(`  2. Visit: http://localhost:3000/names/luna`);
  console.log(`  3. Submit sitemap to GSC: https://matchbabynames.com/sitemap.xml`);
}

seedNames().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
