#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  console.log("Fetching up to 100 top names from 'names' table...");

  // 1. Get already processed slugs to avoid duplicates
  const { data: processed } = await supabase.from("name_pages").select("slug");
  const processedSlugs = new Set((processed || []).map(r => r.slug));

  // 2. Get top 200 names (to have enough after filtering)
  const { data: names, error } = await supabase
    .from("names")
    .select("*")
    .order("popularity_rank", { ascending: true, nullsFirst: false })
    .limit(200);

  if (error) {
    console.error("Error fetching names:", error);
    process.exit(1);
  }

  // 3. Filter out already processed ones
  const toQueue = [];
  for (const n of names) {
    if (toQueue.length >= 100) break;
    const slug = n.normalized_name?.toLowerCase() || n.name.toLowerCase();
    if (!processedSlugs.has(slug)) {
      toQueue.push({
        slug,
        name: n.name,
        gender: n.gender || "unisex",
        origin: n.origin || "Unknown",
        pronunciation_ipa: "", // not available in names table
        pronunciation_text: n.pronunciation_hint || "",
        syllables: n.syllable_count || 1,
        ssa_rank: n.popularity_rank,
        ssa_year: 2023,
        status: "pending",
        priority: 50 // default
      });
      processedSlugs.add(slug); // prevent duplicates within the batch
    }
  }

  console.log(`Found ${toQueue.length} names to queue.`);

  // 4. Insert into names_queue
  if (toQueue.length > 0) {
    const { error: insertErr } = await supabase.from("names_queue").upsert(toQueue, { onConflict: "slug", ignoreDuplicates: true });
    if (insertErr) {
      console.error("Failed to insert into queue:", insertErr);
    } else {
      console.log(`✅ Successfully queued ${toQueue.length} names from the database!`);
    }
  }
}

run();
