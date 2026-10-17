#!/usr/bin/env node
/**
 * scripts/seed-name-pages-batch-2.mjs
 *
 * Hand-written name pages for high-volume names that had no page yet
 * (luke, david, ezra, levi, caleb, theo). Content was written by hand, not generated.
 * Popularity: SSA 2025 national ranks (released May 2026), read from the SSA-sourced
 * Behind the Name US table.
 *
 * Usage:
 *   node scripts/seed-name-pages-batch-2.mjs            # dry run: validate + print, write nothing
 *   node scripts/seed-name-pages-batch-2.mjs --apply    # insert missing slugs as published
 *   node scripts/seed-name-pages-batch-2.mjs --apply --draft   # insert as draft instead
 *
 * Never overwrites: slugs that already exist in name_pages are skipped.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const SSA_YEAR = 2025;

const PAGES = [
  {
    slug: "luke",
    name: "Luke",
    gender: "boy",
    origin: "Greek",
    meaning_short: "Luke means 'man from Lucania', a region of southern Italy, and is the Greek-Latin name of the Gospel writer.",
    meaning_long:
      "Luke comes from the Greek Loukas, which meant 'man from Lucania', the mountainous region in what is now southern Italy. The place name is often linked to the Latin word lux, 'light', which is why many parents hear 'light' in the name, but the geographic meaning is the one scholars favour.\n\nThe name carries the weight of Saint Luke the Evangelist, traditionally the physician and companion of Paul who wrote the Gospel of Luke and the Acts of the Apostles. Through the Middle Ages he became the patron saint of doctors, artists and butchers, and the name spread across Europe in forms like Luc, Luca, Lukas and Lucas.\n\nToday Luke is a one-syllable name with a clean, friendly sound. It works equally well for a toddler and a surgeon, it is simple to spell and pronounce in most languages, and it has stayed in the US top 50 for years without feeling overused.",
    pronunciation_ipa: "luːk",
    pronunciation_text: "LOOK",
    syllables: 1,
    nicknames: ["Lukey", "Luko"],
    ssa_rank: 33,
    ssa_year: SSA_YEAR,
    trend_direction: "stable",
    trend_context: "Luke has held a place in the US top 50 for many years without large swings.",
    middle_names: {
      classic: ["Luke Alexander", "Luke Benjamin", "Luke Edward", "Luke Sebastian"],
      modern: ["Luke Jasper", "Luke Atlas", "Luke Beau", "Luke Rhodes"],
      one_syllable: ["Luke James", "Luke Scott", "Luke Grant", "Luke Blake"],
      family_friendly: ["Luke Andrew", "Luke Daniel", "Luke Thomas", "Luke Michael"],
    },
    similar_names: ["lucas", "henry", "james", "samuel", "asher", "daniel"],
    sibling_names: {
      boys: ["Henry", "Jack", "Samuel", "Miles"],
      girls: ["Clara", "Hazel", "Grace", "Lucy"],
    },
    famous_namesakes: [
      { name: "Luke Perry", known_for: "American actor best known for playing Dylan McKay on 'Beverly Hills, 90210'." },
      { name: "Luke Bryan", known_for: "American country singer and a judge on 'American Idol'." },
      { name: "Luke Wilson", known_for: "American actor from 'Legally Blonde' and 'The Royal Tenenbaums'." },
    ],
    personality_note:
      "Parents who choose Luke tend to want a name that is warm and uncomplicated but still has a long history behind it. Luke suits families who like biblical names without the formality of Matthew or Thomas, and its single syllable pairs easily with almost any surname, long or short.",
  },
  {
    slug: "david",
    name: "David",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "David means 'beloved' in Hebrew and is the name of the Bible's most famous king.",
    meaning_long:
      "David comes from the Hebrew name Dawid, which is generally understood to mean 'beloved'. It is closely related to the Hebrew word dod, meaning 'beloved' or 'uncle', and the idea of being cherished is built into the name at its root.\n\nIn the Bible, David is the shepherd boy who defeats the giant Goliath, becomes the second king of Israel and is traditionally credited with many of the Psalms. His story made David one of the most widely used names in Jewish, Christian and Muslim traditions, where he appears as Dawud. Saint David is also the patron saint of Wales, which gave rise to the Welsh forms Dewi and Dafydd.\n\nDavid was among the very top boys' names in the US through the middle of the twentieth century and has drifted down gradually since, which now makes it feel familiar and established but not trendy. It suits parents who want a name that is dignified, easy to say anywhere in the world and unlikely to date.",
    pronunciation_ipa: "ˈdeɪ.vɪd",
    pronunciation_text: "DAY-vid",
    syllables: 2,
    nicknames: ["Dave", "Davey", "Davy"],
    ssa_rank: 35,
    ssa_year: SSA_YEAR,
    trend_direction: "falling",
    trend_context: "David was once one of the most popular names in America and has declined slowly over several decades, though it remains in the top 50.",
    middle_names: {
      classic: ["David Alexander", "David James", "David William", "David Michael"],
      modern: ["David Everett", "David Rowan", "David Atlas", "David Wells"],
      one_syllable: ["David Paul", "David Lee", "David Grant", "David Cole"],
      family_friendly: ["David John", "David Robert", "David Thomas", "David Andrew"],
    },
    similar_names: ["daniel", "samuel", "james", "elias", "benjamin", "ezra"],
    sibling_names: {
      boys: ["Daniel", "Samuel", "Joshua", "Jonah"],
      girls: ["Hannah", "Rachel", "Sarah", "Naomi"],
    },
    famous_namesakes: [
      { name: "David Beckham", known_for: "English footballer who captained England and played for Manchester United and Real Madrid." },
      { name: "David Bowie", known_for: "English musician and actor known for 'Space Oddity' and the persona Ziggy Stardust." },
      { name: "David Attenborough", known_for: "British broadcaster and naturalist famous for his nature documentaries." },
    ],
    personality_note:
      "Parents who choose David are usually drawn to a name with real roots rather than a passing style. David sounds capable and kind at once, it is equally at home in a boardroom or a playground, and it has dozens of international forms (Dewi, Davide, Dawid) if you want to honour a heritage.",
  },
  {
    slug: "ezra",
    name: "Ezra",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Ezra means 'help' or 'helper' in Hebrew and is the name of the scribe who led the return from exile.",
    meaning_long:
      "Ezra is a Hebrew name, usually explained as a short form of Azaryah or Azariah, meaning 'God helps', or simply as the word for 'help'. Either way, the idea of helpfulness and support sits at the centre of the name.\n\nThe Book of Ezra in the Hebrew Bible tells of Ezra the priest and scribe, who led a group of Jews back from the Babylonian exile to Jerusalem and worked to restore the study of the Law. That scholarly image has stayed with the name: Ezra feels thoughtful, bookish and quietly confident.\n\nEzra was used in the English-speaking world by Puritans and was fairly rare in the twentieth century, apart from poet Ezra Pound. It has climbed steadily in the US since the 2000s and now sits firmly in the top 20, helped by its soft two-syllable sound, the trendy 'z', and the fact that it reads as both vintage and fresh.",
    pronunciation_ipa: "ˈɛz.rə",
    pronunciation_text: "EZ-ruh",
    syllables: 2,
    nicknames: ["Ez", "Ezzy"],
    ssa_rank: 20,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Ezra has risen steadily over the past two decades and now ranks among the top 20 boys' names in the US.",
    middle_names: {
      classic: ["Ezra James", "Ezra Alexander", "Ezra William", "Ezra Samuel"],
      modern: ["Ezra Atlas", "Ezra Jude", "Ezra Wilder", "Ezra Knox"],
      one_syllable: ["Ezra Blake", "Ezra Cole", "Ezra Gray", "Ezra Reid"],
      family_friendly: ["Ezra John", "Ezra Michael", "Ezra Joseph", "Ezra Thomas"],
    },
    similar_names: ["elijah", "silas", "asher", "elias", "noah", "milo"],
    sibling_names: {
      boys: ["Levi", "Asher", "Silas", "Jonah"],
      girls: ["Clementine", "Nora", "Ruth", "Willa"],
    },
    famous_namesakes: [
      { name: "Ezra Pound", known_for: "American poet and a leading figure of the modernist movement." },
      { name: "Ezra Koenig", known_for: "Lead singer of the American indie rock band Vampire Weekend." },
    ],
    personality_note:
      "Parents who choose Ezra tend to like names that feel literary and gentle without being fussy. Ezra suits families who want a biblical name that is less common than Elijah or Noah, and the soft ending leaves room for a strong, plain middle name.",
  },
  {
    slug: "levi",
    name: "Levi",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Levi means 'attached' or 'joined' in Hebrew and is the name of one of Jacob's twelve sons.",
    meaning_long:
      "Levi comes from the Hebrew Levi, which is generally explained as 'attached' or 'joined'. In Genesis, Leah names her third son Levi, hoping her husband will become attached to her, so the name began as an expression of belonging.\n\nLevi became the ancestor of the Levites, the tribe set apart for priestly and temple duties in ancient Israel, and it has been used as a given name among Jews and Christians ever since. In the nineteenth century it also took on a famous second life: Levi Strauss, the Bavarian-born merchant who co-founded the blue-jeans company in San Francisco, made the name instantly recognisable around the world.\n\nThat combination, ancient Hebrew roots plus an American, workwear association, gives Levi a relaxed, down-to-earth feel. It has been in the US top 15 for years and is easy to like: two syllables, a friendly long 'ee' sound, and no awkward spelling.",
    pronunciation_ipa: "ˈliː.vaɪ",
    pronunciation_text: "LEE-vy",
    syllables: 2,
    nicknames: ["Lev", "Lee", "Vi"],
    ssa_rank: 12,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Levi has climbed from the middle of the rankings to the top 15 over roughly two decades.",
    middle_names: {
      classic: ["Levi James", "Levi Alexander", "Levi William", "Levi Benjamin"],
      modern: ["Levi Atlas", "Levi Wilder", "Levi Knox", "Levi Beckett"],
      one_syllable: ["Levi Grant", "Levi Paul", "Levi Scott", "Levi Dean"],
      family_friendly: ["Levi John", "Levi Michael", "Levi Robert", "Levi Thomas"],
    },
    similar_names: ["asher", "elijah", "silas", "ezra", "noah", "milo"],
    sibling_names: {
      boys: ["Asher", "Eli", "Jude", "Micah"],
      girls: ["Hazel", "Ruth", "Eden", "Naomi"],
    },
    famous_namesakes: [
      { name: "Levi Strauss", known_for: "German-American businessman who co-founded the Levi Strauss & Co. blue-jeans brand." },
      { name: "Levi Stubbs", known_for: "Lead singer of the Motown group the Four Tops." },
    ],
    personality_note:
      "Parents who choose Levi usually want a biblical name with an easygoing, modern sound. Levi works for families who like Elijah or Asher but want something with a more casual feel, and the jeans connection gives it a friendly, grounded image that few other biblical names have.",
  },
  {
    slug: "caleb",
    name: "Caleb",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Caleb is a Hebrew name from Kalev, often explained as 'whole-hearted' or 'faithful', though some scholars read it as 'dog'.",
    meaning_long:
      "Caleb comes from the Hebrew Kalev. The meaning is debated: many sources give 'whole-hearted' or 'devoted', while the literal Hebrew word kelev means 'dog', a term that was a compliment in the ancient world for loyalty and faithfulness. Both readings point to the same quality, steady devotion.\n\nIn the Bible, Caleb is one of the twelve spies Moses sends into Canaan. He and Joshua alone bring back a hopeful report, and as a reward Caleb is the only man of his generation, apart from Joshua, to enter the Promised Land. His story made the name a symbol of faith and courage.\n\nCaleb was favoured by English Puritans and has never really left the American name pool. It peaked in the US around the early 2000s and has eased down since, which makes it feel familiar rather than fashionable. The two-syllable shape and the strong opening 'K' sound give it a confident, practical tone.",
    pronunciation_ipa: "ˈkeɪ.ləb",
    pronunciation_text: "KAY-lub",
    syllables: 2,
    nicknames: ["Cal", "Cale", "Caley"],
    ssa_rank: 58,
    ssa_year: SSA_YEAR,
    trend_direction: "falling",
    trend_context: "Caleb was far more popular in the early 2000s and has slipped gradually since, though it remains in the top 100.",
    middle_names: {
      classic: ["Caleb James", "Caleb Alexander", "Caleb William", "Caleb Joseph"],
      modern: ["Caleb Jasper", "Caleb Atlas", "Caleb Rhodes", "Caleb Wells"],
      one_syllable: ["Caleb Reid", "Caleb Grant", "Caleb Dean", "Caleb Scott"],
      family_friendly: ["Caleb John", "Caleb Michael", "Caleb Thomas", "Caleb Andrew"],
    },
    similar_names: ["elijah", "samuel", "daniel", "asher", "silas", "ethan"],
    sibling_names: {
      boys: ["Josiah", "Samuel", "Micah", "Jonah"],
      girls: ["Abigail", "Hannah", "Ruth", "Eliza"],
    },
    famous_namesakes: [
      { name: "Caleb Followill", known_for: "Lead singer of the American rock band Kings of Leon." },
      { name: "Caleb Carr", known_for: "American novelist and military historian, author of 'The Alienist'." },
      { name: "Caleb McLaughlin", known_for: "American actor who plays Lucas Sinclair in 'Stranger Things'." },
    ],
    personality_note:
      "Parents who choose Caleb tend to value loyalty and plain strength over novelty. Caleb appeals to families who like biblical names with a sturdy, no-nonsense sound, and its nickname Cal gives it a casual, adult-friendly shortening that suits a boy and the man he grows into.",
  },
  {
    slug: "theo",
    name: "Theo",
    gender: "boy",
    origin: "Greek",
    meaning_short: "Theo comes from the Greek theos, 'god', and is used as a short form of Theodore, Theodoric and Theophilus.",
    meaning_long:
      "Theo is a short form of several longer names that begin with the Greek element theos, meaning 'god'. The most common is Theodore, which combines theos with doron, 'gift', and means 'gift of God'. Theo can also stand in for Theodoric ('ruler of the people'), Theophilus ('beloved of God') and Theodosia.\n\nTheo has long been used as an affectionate short form: Theodore Roosevelt, the 26th US president, was known as Teddy, while Theo is the form many families prefer today. Vincent van Gogh's devoted brother and financial supporter was also named Theo, which gave the name an artistic association.\n\nIn the US, Theo is now used both as a nickname for Theodore, which sits in the top five, and as a given name in its own right, ranking in the top 100. Parents like its warmth, its easy pronunciation in almost any language and the way it feels friendly, a little vintage and entirely modern at once.",
    pronunciation_ipa: "ˈθiː.oʊ",
    pronunciation_text: "THEE-oh",
    syllables: 2,
    nicknames: ["Teddy", "Theodore"],
    ssa_rank: 82,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Theo has become a popular given name in its own right, on top of the wider rise of Theodore.",
    middle_names: {
      classic: ["Theo James", "Theo Alexander", "Theo William", "Theo Henry"],
      modern: ["Theo Atlas", "Theo Wilder", "Theo Jasper", "Theo Beckett"],
      one_syllable: ["Theo Blake", "Theo Grant", "Theo Cole", "Theo Reid"],
      family_friendly: ["Theo John", "Theo Michael", "Theo Thomas", "Theo Daniel"],
    },
    similar_names: ["theodore", "leo", "milo", "finn", "henry", "oliver"],
    sibling_names: {
      boys: ["Leo", "Milo", "Felix", "Jude"],
      girls: ["Nora", "Ivy", "Willa", "Clara"],
    },
    famous_namesakes: [
      { name: "Theo James", known_for: "English actor known for the 'Divergent' films and 'The White Lotus'." },
      { name: "Theo Walcott", known_for: "English footballer who played for Arsenal and England." },
      { name: "Theo van Gogh", known_for: "Dutch art dealer and the brother who supported Vincent van Gogh." },
    ],
    personality_note:
      "Parents who choose Theo often love Theodore but want something shorter and softer for everyday use. Theo gives you the option of a formal name for later, and it works well for families who want a global-friendly name that is easy to say in English, Spanish, Greek and German alike.",
  },
];

// ── Validation (mirrors scripts/qa-name-batch.mjs rules) ──────────────────────

const sentence = (t) => t && /[.!?]$/.test(t.trim()) && t.trim().split(/\s+/).length >= 5;
function validate(p) {
  const bad = [];
  if (!p.ssa_rank || !p.ssa_year) bad.push("ssa data missing");
  for (const f of ["meaning_short", "trend_context", "personality_note"]) if (!sentence(p[f])) bad.push(`${f} not a complete sentence`);
  if (!p.personality_note.includes(p.name)) bad.push("personality_note missing name");
  if (p.meaning_long.length < 200 || !p.meaning_long.includes("\n\n")) bad.push("meaning_long thin");
  if (!p.similar_names || p.similar_names.length < 4) bad.push("similar_names < 4");
  for (const g of ["classic", "modern", "one_syllable", "family_friendly"]) if (!p.middle_names[g] || p.middle_names[g].length < 2) bad.push(`middle_names.${g}`);
  if (!p.pronunciation_ipa || !p.pronunciation_text) bad.push("pronunciation");
  return bad;
}

const apply = process.argv.includes("--apply");
const asDraft = process.argv.includes("--draft");

let failed = false;
for (const p of PAGES) {
  const bad = validate(p);
  console.log(`${bad.length ? "❌" : "✅"} ${p.slug}${bad.length ? "  " + bad.join("; ") : ""}`);
  if (bad.length) failed = true;
}
if (failed) {
  console.error("Validation failed; nothing written.");
  process.exit(1);
}

if (!apply) {
  console.log(`\nDry run OK (${PAGES.length} pages). Re-run with --apply to insert.`);
  process.exit(0);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const { data: existing, error: readErr } = await supabase.from("name_pages").select("slug").in("slug", PAGES.map((p) => p.slug));
if (readErr) {
  console.error("Could not read name_pages:", readErr.message);
  process.exit(1);
}
const have = new Set(existing.map((r) => r.slug));

for (const p of PAGES) {
  if (have.has(p.slug)) {
    console.log(`⏭  ${p.slug} already exists; skipped`);
    continue;
  }
  const { error } = await supabase.from("name_pages").insert({ ...p, status: asDraft ? "draft" : "published" });
  console.log(error ? `❌ ${p.slug}: ${error.message}` : `✅ inserted ${p.slug} (${asDraft ? "draft" : "published"})`);
}
