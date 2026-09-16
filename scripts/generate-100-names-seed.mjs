#!/usr/bin/env node
/**
 * scripts/generate-100-names-seed.mjs
 *
 * Uses OpenAI to generate 100 new popular names and inserts them directly
 * into the names_queue table.
 */

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !OPENAI_API_KEY) {
  console.error("❌  Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const batches = [
  { gender: "girl", count: 25, desc: "Top 20 to 45 most popular girls names in the US (2023 data)" },
  { gender: "girl", count: 25, desc: "Top 46 to 70 most popular girls names in the US (2023 data)" },
  { gender: "boy", count: 25, desc: "Top 20 to 45 most popular boys names in the US (2023 data)" },
  { gender: "boy", count: 25, desc: "Top 46 to 70 most popular boys names in the US (2023 data)" },
];

async function generateAndQueue() {
  console.log("🚀  Starting generation of 100 new names...");
  let totalInserted = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n⏳ Generating batch ${i + 1}/4: ${batch.count} ${batch.gender}s (${batch.desc})...`);
    
    const prompt = `You are a baby name expert database generator.
Provide exactly ${batch.count} ${batch.gender} names matching this criteria: "${batch.desc}".
Do NOT include names that are already extremely common like Olivia, Liam, Emma, Noah, Charlotte, Oliver, Amelia, Mia, James, Henry, etc. as they are already processed.

Return ONLY a valid JSON object with a "names" array. Each item must have exactly these keys (no extra keys):
{
  "slug": "lowercase name",
  "name": "Titlecase Name",
  "gender": "${batch.gender}",
  "origin": "Short origin string (e.g., Latin, Greek, Hebrew)",
  "pronunciation_ipa": "IPA notation",
  "pronunciation_text": "Phonetic spelling (e.g., AY-vuh)",
  "syllables": integer,
  "nicknames": ["array", "of", "strings"],
  "ssa_rank": integer (approx 2023 rank),
  "ssa_year": 2023,
  "trend_direction": "rising", "falling", or "stable",
  "trend_context": "One short sentence describing its popularity trend.",
  "similar_names": ["slug1", "slug2", "slug3", "slug4"],
  "sibling_names": { "boys": ["Name1", "Name2", "Name3", "Name4"], "girls": ["Name1", "Name2", "Name3", "Name4"] },
  "priority": integer (random between 50 and 80)
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You output valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const data = JSON.parse(content);
      
      if (!data.names || !Array.isArray(data.names)) {
        console.error("❌ Invalid response format from OpenAI");
        continue;
      }

      // Filter out any slugs already in DB just in case
      const slugs = data.names.map(n => n.slug);
      const [pagesRes, queueRes] = await Promise.all([
        supabase.from("name_pages").select("slug").in("slug", slugs),
        supabase.from("names_queue").select("slug").in("slug", slugs),
      ]);
      const existing = new Set([
        ...(pagesRes.data || []).map(r => r.slug),
        ...(queueRes.data || []).map(r => r.slug)
      ]);

      const toInsert = data.names
        .filter(n => !existing.has(n.slug))
        .map(n => ({
          ...n,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

      if (toInsert.length > 0) {
        const { error } = await supabase.from("names_queue").insert(toInsert);
        if (error) {
          console.error(`❌ Failed to insert batch ${i+1}:`, error.message);
        } else {
          console.log(`✅ Inserted ${toInsert.length} names! (Skipped ${data.names.length - toInsert.length} duplicates)`);
          totalInserted += toInsert.length;
        }
      } else {
        console.log(`⚠️ All ${data.names.length} names in this batch were duplicates.`);
      }
      
    } catch (err) {
      console.error(`❌ Batch ${i+1} failed:`, err.message);
    }
  }

  console.log(`\n🎉 Done! Added ${totalInserted} new names to the queue.`);
}

generateAndQueue();
