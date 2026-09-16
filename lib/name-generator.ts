/**
 * lib/name-generator.ts
 *
 * Shared helpers for AI content generation + QA checks.
 * Used by the cron API route and can be imported by scripts.
 */

import OpenAI from "openai";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NameQueueRow {
  slug: string;
  name: string;
  gender: string;
  origin: string;
  pronunciation_ipa: string;
  pronunciation_text: string;
  syllables: number;
  nicknames: string[] | null;
  ssa_rank: number | null;
  ssa_year: number | null;
  trend_direction: string | null;
  trend_context: string | null;
  similar_names: string[] | null;
  sibling_names: { boys: string[]; girls: string[] } | null;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface GeneratedNameContent {
  meaning_short: string;
  meaning_long: string;
  middle_names: {
    classic: string[];
    modern: string[];
    one_syllable: string[];
    family_friendly: string[];
  };
  famous_namesakes: { name: string; known_for: string }[] | null;
  personality_note: string;
  faqs: FaqEntry[];
  meta_title: string;
  meta_description: string;
}

export interface QAResult {
  pass: boolean;
  reasons: string[];
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

export function buildNamePrompt(n: NameQueueRow): string {
  return `You are a baby name expert writing SEO content for matchbabynames.com.
Generate rich, genuinely useful content for the baby name "${n.name}" (${n.gender}'s name, ${n.origin} origin).

Return ONLY a valid JSON object with exactly these keys — no markdown, no code fences, no extra text:

{
  "meaning_short": "A single complete sentence giving the core meaning of ${n.name}. Must begin with '${n.name} is' or '${n.name} means'. An AI answer engine should be able to lift this sentence verbatim.",
  "meaning_long": "Three paragraphs of genuine prose (separated by \\n\\n) covering: (1) etymology and linguistic roots, (2) cultural/historical context and how the name spread, (3) modern usage and connotations. No marketing fluff. Min 300 words.",
  "middle_names": {
    "classic": ["4 classic middle name combos, e.g. '${n.name} Rose'"],
    "modern": ["4 modern/fresh middle name combos"],
    "one_syllable": ["4 punchy one-syllable middle name combos"],
    "family_friendly": ["4 middle names that work as family name bridges"]
  },
  "famous_namesakes": [
    {"name": "Full Name", "known_for": "Brief description (10-15 words max)"}
  ],
  "personality_note": "2-3 sentences describing: what kind of parent chooses ${n.name}, what aesthetic or era it fits, and what makes this name choice distinctive. Must mention '${n.name}' at least once. Must NOT be copy-pasteable onto any other name page.",
  "faqs": [
    {"question": "What does ${n.name} mean?", "answer": "Complete sentence answer (≥8 words, ends in punctuation)."},
    {"question": "How do you pronounce ${n.name}?", "answer": "Complete sentence answer with IPA and phonetic."},
    {"question": "Is ${n.name} a popular name?", "answer": "Complete sentence with current rank/trend data."},
    {"question": "What are good middle names for ${n.name}?", "answer": "Complete sentence listing 3-4 pairings."},
    {"question": "What is the origin of the name ${n.name}?", "answer": "Complete sentence covering etymology."}
  ],
  "meta_title": "Exactly: ${n.name} Name Meaning, Origin & Popularity | Namely — must be ≤60 characters",
  "meta_description": "A compelling 1-2 sentence summary for Google SERPs. Must mention meaning, origin, and popularity. ≤160 characters."
}

Rules:
- famous_namesakes: include only real, verifiable people. If fewer than 2 exist, return an empty array [].
- middle_names: each array must have exactly 4 entries.
- All FAQ answers must be complete sentences (≥8 words, end with . ! or ?).
- personality_note: unique to ${n.name} — cannot be reused on another name page.
- meta_title: ≤60 characters total.
- meta_description: ≤160 characters total.
- Return only valid JSON. No trailing commas.`;
}

// ── AI content generation ──────────────────────────────────────────────────────

export async function generateNameContent(
  nameData: NameQueueRow,
  openai: OpenAI
): Promise<GeneratedNameContent> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a baby name expert. Always respond with valid JSON only — no markdown fences, no explanatory text.",
      },
      { role: "user", content: buildNamePrompt(nameData) },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  if (!raw) throw new Error("OpenAI returned empty content");
  return JSON.parse(raw) as GeneratedNameContent;
}

// ── QA checks ──────────────────────────────────────────────────────────────────

/** Jaccard similarity on word sets (0–1). */
export function jaccardSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/** Returns true if text ends in sentence-ending punctuation and has ≥5 words. */
function isCompleteSentence(text: string | null | undefined): boolean {
  if (!text || typeof text !== "string") return false;
  const t = text.trim();
  return /[.!?]$/.test(t) && t.split(/\s+/).length >= 5;
}

/**
 * Run all QA checks on a generated name row before publishing.
 *
 * @param n - The name queue row (source data)
 * @param ai - The AI-generated content
 * @param last100PersonalityNotes - personality_note values from last 100 published names
 */
export function runQAChecks(
  n: NameQueueRow,
  ai: GeneratedNameContent,
  last100PersonalityNotes: string[]
): QAResult {
  const reasons: string[] = [];

  // 1. Required fields non-empty
  const required: [string, string | null | undefined][] = [
    ["meaning_short", ai.meaning_short],
    ["meaning_long", ai.meaning_long],
    ["personality_note", ai.personality_note],
    ["meta_title", ai.meta_title],
    ["meta_description", ai.meta_description],
    ["pronunciation_ipa", n.pronunciation_ipa],
    ["pronunciation_text", n.pronunciation_text],
  ];
  for (const [field, val] of required) {
    if (!val || val.trim().length === 0) {
      reasons.push(`Missing required field: ${field}`);
    }
  }

  // 2. meaning_short is a complete sentence
  if (!isCompleteSentence(ai.meaning_short)) {
    reasons.push(
      "meaning_short is not a complete sentence (needs ≥5 words and end punctuation)"
    );
  }

  // 3. meaning_long is substantive (≥200 chars, has paragraph breaks)
  if (!ai.meaning_long || ai.meaning_long.length < 200) {
    reasons.push("meaning_long too short (<200 chars)");
  }
  if (ai.meaning_long && !ai.meaning_long.includes("\n\n")) {
    reasons.push("meaning_long missing paragraph breaks (\\n\\n)");
  }

  // 4. personality_note mentions the name
  if (ai.personality_note && !ai.personality_note.includes(n.name)) {
    reasons.push(`personality_note doesn't mention the name "${n.name}"`);
  }

  // 5. personality_note uniqueness — Jaccard < 70% vs last 100 published
  const SIMILARITY_THRESHOLD = 0.7;
  for (const existing of last100PersonalityNotes) {
    const sim = jaccardSimilarity(ai.personality_note, existing);
    if (sim > SIMILARITY_THRESHOLD) {
      reasons.push(
        `personality_note is ${(sim * 100).toFixed(0)}% similar to an existing published note (threshold: 70%)`
      );
      break; // one failure is enough
    }
  }

  // 6. FAQs — must have 4–5 entries, all complete sentences
  if (!ai.faqs || ai.faqs.length < 4) {
    reasons.push(`faqs must have at least 4 entries (got ${ai.faqs?.length ?? 0})`);
  } else {
    ai.faqs.forEach((faq, i) => {
      if (!isCompleteSentence(faq.answer)) {
        reasons.push(
          `FAQ[${i}] answer is not a complete sentence: "${faq.answer?.substring(0, 60)}…"`
        );
      }
      if (!faq.question || faq.question.trim().length === 0) {
        reasons.push(`FAQ[${i}] question is empty`);
      }
    });
  }

  // 7. middle_names structure
  if (!ai.middle_names) {
    reasons.push("middle_names is missing");
  } else {
    const groups = ["classic", "modern", "one_syllable", "family_friendly"] as const;
    for (const g of groups) {
      if (!ai.middle_names[g] || ai.middle_names[g].length < 2) {
        reasons.push(`middle_names.${g} has fewer than 2 entries`);
      }
    }
  }

  // 8. meta_title length
  if (ai.meta_title && ai.meta_title.length > 60) {
    reasons.push(
      `meta_title too long (${ai.meta_title.length} chars, max 60)`
    );
  }

  // 9. meta_description length
  if (ai.meta_description && ai.meta_description.length > 160) {
    reasons.push(
      `meta_description too long (${ai.meta_description.length} chars, max 160)`
    );
  }

  return { pass: reasons.length === 0, reasons };
}
