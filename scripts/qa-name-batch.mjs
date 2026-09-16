#!/usr/bin/env node
/**
 * scripts/qa-name-batch.mjs
 *
 * QA checklist validator for name page batches.
 * Run after every batch of names is seeded.
 *
 * Usage:
 *   node scripts/qa-name-batch.mjs                    # check all published names
 *   node scripts/qa-name-batch.mjs --batch pilot      # check pilot 10 names
 *   node scripts/qa-name-batch.mjs --slugs luna,liam  # check specific slugs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const PILOT_SLUGS = [
  "olivia", "liam", "luna", "noah", "emma",
  "charlotte", "oliver", "sophia", "elijah", "ava",
];

// ── Similarity check (Jaccard on word sets) ───────────────────────────────────

function jaccardSimilarity(a, b) {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.size / union.size;
}

// ── Check helpers ─────────────────────────────────────────────────────────────

function isCompleteSentence(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) && trimmed.split(/\s+/).length >= 5;
}

function checkFaqAnswers(row) {
  const faqFields = [
    { field: "meaning_short", label: "meaning_short (FAQ answer)" },
    { field: "trend_context", label: "trend_context (FAQ answer)" },
    { field: "personality_note", label: "personality_note" },
  ];
  const issues = [];
  for (const { field, label } of faqFields) {
    if (row[field] && !isCompleteSentence(row[field])) {
      issues.push(`  ⚠️  ${label} is not a complete sentence`);
    }
  }
  return issues;
}

// ── Main QA runner ────────────────────────────────────────────────────────────

async function runQA(slugs) {
  console.log(`\n🔍  QA Checklist — checking ${slugs ? slugs.length : "all"} name pages\n`);

  // Fetch rows
  let query = supabase.from("name_pages").select("*");
  if (slugs && slugs.length > 0) {
    query = query.in("slug", slugs);
  } else {
    query = query.eq("status", "published");
  }

  const { data: rows, error } = await query;
  if (error) {
    console.error("❌  Failed to fetch name pages:", error.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.warn("⚠️  No name pages found. Have you run the seeder?");
    process.exit(0);
  }

  console.log(`📋  Found ${rows.length} name page(s) to check\n`);

  const allIssues = {};
  let totalIssues = 0;

  // ─── Per-page checks ───────────────────────────────────────────────────────
  for (const row of rows) {
    const issues = [];

    // Check 1: SSA data present and traceable
    if (!row.ssa_rank || !row.ssa_year) {
      issues.push("  ❌  [POPULARITY] ssa_rank or ssa_year is missing — popularity data must trace to SSA");
    }
    if (row.ssa_year && row.ssa_year < 2020) {
      issues.push(`  ⚠️  [POPULARITY] ssa_year is ${row.ssa_year} — consider updating to 2023 data`);
    }

    // Check 2: Complete sentence FAQ answers
    const faqIssues = checkFaqAnswers(row);
    issues.push(...faqIssues);

    // Check 3: personality_note uniqueness marker — must mention the name itself
    if (row.personality_note && !row.personality_note.includes(row.name)) {
      issues.push(
        "  ⚠️  [UNIQUE CONTENT] personality_note doesn't mention the name — may not be sufficiently specific"
      );
    }

    // Check 4: meaning_long is substantive (>200 chars, multiple paragraphs)
    if (!row.meaning_long || row.meaning_long.length < 200) {
      issues.push("  ❌  [THIN CONTENT] meaning_long is too short (< 200 chars)");
    }
    if (row.meaning_long && !row.meaning_long.includes("\n\n")) {
      issues.push("  ⚠️  [CONTENT] meaning_long should have paragraph breaks (\\n\\n)");
    }

    // Check 5: Internal links (similar_names) must be non-empty
    if (!row.similar_names || row.similar_names.length < 4) {
      issues.push("  ❌  [INTERNAL LINKS] similar_names has fewer than 4 entries");
    }

    // Check 6: middle_names structured correctly
    if (!row.middle_names) {
      issues.push("  ❌  [CONTENT] middle_names is missing");
    } else {
      const groups = ["classic", "modern", "one_syllable", "family_friendly"];
      for (const g of groups) {
        if (!row.middle_names[g] || row.middle_names[g].length < 2) {
          issues.push(`  ⚠️  [CONTENT] middle_names.${g} has fewer than 2 entries`);
        }
      }
    }

    // Check 7: pronunciation both IPA and text
    if (!row.pronunciation_ipa || !row.pronunciation_text) {
      issues.push("  ❌  [PRONUNCIATION] IPA or phonetic spelling missing");
    }

    if (issues.length > 0) {
      allIssues[row.slug] = issues;
      totalIssues += issues.length;
    }
  }

  // ─── Cross-page similarity check ──────────────────────────────────────────
  console.log("🔁  Running cross-page similarity check (personality_note)…");
  const SIMILARITY_THRESHOLD = 0.70;
  const similarityIssues = [];

  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i];
      const b = rows[j];

      // Check personality_note similarity
      if (a.personality_note && b.personality_note) {
        const sim = jaccardSimilarity(a.personality_note, b.personality_note);
        if (sim > SIMILARITY_THRESHOLD) {
          similarityIssues.push(
            `  ❌  personality_note similarity ${(sim * 100).toFixed(0)}% between ${a.name} and ${b.name}`
          );
        }
      }

      // Check meaning_long similarity
      if (a.meaning_long && b.meaning_long) {
        const sim = jaccardSimilarity(a.meaning_long, b.meaning_long);
        if (sim > SIMILARITY_THRESHOLD) {
          similarityIssues.push(
            `  ❌  meaning_long similarity ${(sim * 100).toFixed(0)}% between ${a.name} and ${b.name}`
          );
        }
      }
    }
  }

  // ─── Dead link check (similar_names slugs must exist in DB) ───────────────
  console.log("🔗  Checking internal links (similar_names)…");
  const allSlugsInDB = new Set(rows.map((r) => r.slug));
  const deadLinkIssues = [];

  for (const row of rows) {
    if (row.similar_names) {
      for (const linkedSlug of row.similar_names) {
        if (!allSlugsInDB.has(linkedSlug)) {
          deadLinkIssues.push(
            `  ⚠️  ${row.name} links to /names/${linkedSlug} which is NOT in DB yet (safe to resolve in future batch)`
          );
        }
      }
    }
  }

  // ─── Report ────────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("                    QA REPORT");
  console.log("═══════════════════════════════════════════════════════\n");

  if (Object.keys(allIssues).length === 0 && similarityIssues.length === 0 && deadLinkIssues.length === 0) {
    console.log("🎉  All checks passed! Batch is ready to ship.\n");
  } else {
    // Per-page issues
    for (const [slug, issues] of Object.entries(allIssues)) {
      const row = rows.find((r) => r.slug === slug);
      console.log(`\n📄  ${row?.name} (/names/${slug}):`);
      for (const issue of issues) console.log(issue);
    }

    // Similarity issues
    if (similarityIssues.length > 0) {
      console.log("\n📊  Similarity Issues:");
      for (const issue of similarityIssues) console.log(issue);
    }

    // Dead links
    if (deadLinkIssues.length > 0) {
      console.log("\n🔗  Dead Internal Links (future batch — not blocking):");
      for (const issue of deadLinkIssues) console.log(issue);
    }
  }

  const blocking = totalIssues + similarityIssues.filter((i) => i.includes("❌")).length;
  console.log("\n───────────────────────────────────────────────────────");
  console.log(`Total blocking issues: ${blocking}`);
  console.log(`Dead link warnings (non-blocking): ${deadLinkIssues.length}`);
  console.log("───────────────────────────────────────────────────────\n");

  if (blocking > 0) {
    console.log("❌  QA FAILED — fix blocking issues before shipping this batch.");
    process.exit(1);
  } else {
    console.log("✅  QA PASSED — batch is ready to ship.");
  }
}

// ── CLI arg parsing ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let slugsToCheck = null;

const batchIdx = args.indexOf("--batch");
if (batchIdx !== -1 && args[batchIdx + 1] === "pilot") {
  slugsToCheck = PILOT_SLUGS;
}

const slugsIdx = args.indexOf("--slugs");
if (slugsIdx !== -1 && args[slugsIdx + 1]) {
  slugsToCheck = args[slugsIdx + 1].split(",").map((s) => s.trim());
}

runQA(slugsToCheck).catch((err) => {
  console.error("Fatal QA error:", err);
  process.exit(1);
});
