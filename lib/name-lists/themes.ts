import type { NameListPage } from "./types";

const UPDATED = "2026-10-16";

export const THEME_PAGES: NameListPage[] = [
  // ── LOVE ────────────────────────────────────────────────────────────────────
  {
    slug: "love",
    kind: "theme",
    title: "Baby Names That Mean Love: {n} Names With Meanings",
    metaTitle: "Baby Names That Mean Love: {n} Girl, Boy & Unisex Names",
    metaDescription:
      "{n} baby names that mean love, beloved or dear, from Amy and David to Carys and Aroha. Meanings, origins and the story behind each name.",
    kicker: "Names that mean love",
    intro: [
      "Names that mean love, beloved or dear are among the most meaningful you can give a child: they say what you feel in a single word. This list collects {n} of them across a dozen languages, from classics like David and Amy to rarer picks like Carys, Habib and Aroha.",
      "Every meaning here is traced to the name's source language. Where scholars disagree about an etymology, we say so instead of picking the prettiest answer. Names are grouped by gender, with a short note on how each one feels in everyday use.",
    ],
    featured: ["Amy", "David", "Carys", "Priya", "Amadeus", "Aroha"],
    tips: [
      {
        heading: "Look for the root, not just the translation",
        body: "Many love names share a Latin root: amare, 'to love'. Amy, Amanda, Amabel, Amadeus and Amato all grow from it. Welsh gives you cariad and carys, Hebrew gives you ahava and david, and Sanskrit gives you priya and prem. Choosing the language that matches your family background gives the name a second layer of meaning.",
      },
      {
        heading: "Check the 'dear' vs 'love' distinction",
        body: "Some names mean 'beloved' (David, Habib, Mahbub), some mean 'loved' or 'worthy of love' (Amanda, Mabel), and some mean 'love' itself (Carys, Ahava, Prem). They read differently: 'beloved' describes the child, while 'love' names the feeling. Neither is better; pick the one you would want to say out loud.",
      },
      {
        heading: "Say it with your surname",
        body: "Vowel-heavy love names such as Amy, Aimée and Amado pair well with consonant-heavy surnames, while longer names like Amadeus can overwhelm a long surname. Say the full name aloud a few times before you commit.",
      },
    ],
    names: [
      // Girls
      { name: "Amy", gender: "girl", origin: "Old French", meaning: "beloved (from Old French amée, 'loved one')", note: "Short, warm and instantly familiar; a classic that never feels dated." },
      { name: "Amanda", gender: "girl", origin: "Latin", meaning: "worthy of love; 'she who must be loved'", note: "Coined as a literary name in the 17th century and loved ever since." },
      { name: "Amabel", gender: "girl", origin: "Latin", meaning: "lovable (from amabilis)", note: "A medieval gem, softer and rarer than Mabel." },
      { name: "Mabel", gender: "girl", origin: "Latin", meaning: "lovable (short form of Amabel)", note: "Vintage charm with a bright, friendly sound." },
      { name: "Aimée", gender: "girl", origin: "French", meaning: "beloved", note: "The elegant French sibling of Amy; pronounced eh-MAY." },
      { name: "Amoret", gender: "girl", origin: "Latin / English", meaning: "little love", note: "A rare literary name from Spenser's 'The Faerie Queene'." },
      { name: "Carys", gender: "girl", origin: "Welsh", meaning: "love (from the Welsh word câr, 'to love')", note: "Fresh, lyrical and quietly distinctive outside Wales." },
      { name: "Cariad", gender: "girl", origin: "Welsh", meaning: "love, darling", note: "Also an everyday Welsh term of endearment." },
      { name: "Cara", gender: "girl", origin: "Italian", meaning: "dear, beloved (Irish Gaelic cara also means 'friend')", note: "Two languages, two sweet meanings, and a very short name." },
      { name: "Carina", gender: "girl", origin: "Italian", meaning: "dear little one", note: "Also the name of a constellation, which adds a starry bonus." },
      { name: "Priya", gender: "girl", origin: "Sanskrit", meaning: "beloved, dear", note: "Widely used across India and in diaspora families; easy to say everywhere." },
      { name: "Esme", gender: "girl", origin: "Old French", meaning: "esteemed, loved (from Old French esmer, 'to esteem')", note: "Quietly literary, with a soft ending that feels modern." },
      { name: "Davina", gender: "girl", origin: "Hebrew (via Scottish)", meaning: "beloved (feminine form of David)", note: "A Scottish favourite that deserves wider use." },
      { name: "Habiba", gender: "girl", origin: "Arabic", meaning: "beloved, sweetheart", note: "A warm, widely loved name across the Arabic-speaking world." },
      { name: "Ahava", gender: "girl", origin: "Hebrew", meaning: "love", note: "Pronounced ah-HAH-vah; the Hebrew word for love, used as a given name." },
      { name: "Mila", gender: "girl", origin: "Slavic", meaning: "dear, gracious (from mil, 'dear')", note: "Short and sweet; works easily across languages." },
      { name: "Agapi", gender: "girl", origin: "Greek", meaning: "love (agape, selfless love)", note: "The Greek word for unconditional love; Agape is the English spelling." },
      // Boys
      { name: "David", gender: "boy", origin: "Hebrew", meaning: "beloved (from dod, 'beloved')", note: "One of the most enduring boys' names in history, borne by a king." },
      { name: "Amadeus", gender: "boy", origin: "Latin", meaning: "love of God", note: "Made famous by Mozart; bold but musical." },
      { name: "Amato", gender: "boy", origin: "Italian", meaning: "beloved", note: "Rare, warm and distinctly Italian." },
      { name: "Amado", gender: "boy", origin: "Spanish", meaning: "beloved", note: "A tender Spanish name with a confident sound." },
      { name: "Aimé", gender: "boy", origin: "French", meaning: "loved", note: "Masculine counterpart of Aimée, pronounced eh-MAY." },
      { name: "Philo", gender: "boy", origin: "Greek", meaning: "love (philos, 'loving, dear')", note: "Short and scholarly, from the same root as 'philosophy'." },
      { name: "Dewi", gender: "boy", origin: "Welsh", meaning: "beloved (Welsh form of David)", note: "The name of Wales's patron saint, Dewi Sant." },
      { name: "Habib", gender: "boy", origin: "Arabic", meaning: "beloved, dear one", note: "A very common name that is also a term of affection." },
      { name: "Mahbub", gender: "boy", origin: "Arabic / Persian", meaning: "beloved", note: "Also spelled Mahboob; common across South Asia and the Middle East." },
      { name: "Prem", gender: "boy", origin: "Sanskrit", meaning: "love, affection", note: "Short and bright, and easy to pronounce in English." },
      // Unisex
      { name: "Aroha", gender: "unisex", origin: "Māori", meaning: "love, compassion", note: "A central Māori value, used as a given name for any child." },
      { name: "Kama", gender: "unisex", origin: "Sanskrit", meaning: "love, desire", note: "Rooted in Hindu tradition; a brief, striking sound." },
      { name: "Mehr", gender: "unisex", origin: "Persian", meaning: "love, kindness (also 'sun')", note: "A beautiful dual meaning that suits any child." },
      { name: "Preet", gender: "unisex", origin: "Punjabi / Hindi", meaning: "love, affection", note: "Common in Sikh families, often paired with Kaur or Singh." },
    ],
    faqs: [
      { q: "What is the most popular baby name that means love?", a: "David and Amy are the two most widely used names that mean 'beloved'. David is Hebrew and has been a top boys' name for centuries; Amy comes from Old French and is one of the most familiar girls' names in English-speaking countries." },
      { q: "What are rare baby names that mean love?", a: "Carys (Welsh), Amoret (English literary), Ahava (Hebrew), Aroha (Māori) and Amato (Italian) are all uncommon but easy to pronounce, and each translates directly to 'love' or 'beloved'." },
      { q: "Are there gender-neutral names that mean love?", a: "Yes. Aroha (Māori), Kama (Sanskrit), Mehr (Persian) and Preet (Punjabi) all work for any child and mean love or affection." },
      { q: "Which languages have the most love names?", a: "Latin, Hebrew, Arabic, Welsh and Sanskrit all give you several choices. Latin's amare gives Amy, Amanda and Amadeus; Hebrew gives David and Ahava; Arabic gives Habib and Habiba." },
    ],
    updated: UPDATED,
  },

  // ── LIGHT ───────────────────────────────────────────────────────────────────
  {
    slug: "light",
    kind: "theme",
    title: "Baby Names That Mean Light: {n} Bright Names With Meanings",
    metaTitle: "Baby Names That Mean Light: {n} Bright Girl & Boy Names",
    metaDescription:
      "{n} baby names that mean light, bright or shining, from Lucy and Clara to Noor and Lior. Meanings, origins and notes on each name.",
    kicker: "Names that mean light",
    intro: [
      "Names that mean light, bright or radiant are a favourite for parents who want a hopeful, uplifting name. This list gathers {n} of them from Latin, Hebrew, Arabic, Sanskrit, Russian and Spanish, with a clear meaning and a short note for each.",
      "We only include names whose root meaning is light, brightness or dawn, and we flag the cases where an etymology is debated, such as Helena. Names are grouped by gender, with unisex picks at the end.",
    ],
    featured: ["Lucy", "Clara", "Noor", "Lucian", "Aurora", "Lior"],
    tips: [
      {
        heading: "Latin lux gives you the biggest family",
        body: "Lucy, Lucia, Lucille, Lucius and Lucian all grow from Latin lux, 'light'. Luca and Lucas come from the related place-name Lucania, which is often linked to light. If you want a classic that is easy to spell everywhere, start here.",
      },
      {
        heading: "Consider dawn and sun names too",
        body: "Aurora (dawn), Elio and Helios (sun) and Surya (sun) live in the same family of meaning. They are more distinctive than the lux names and feel warmer in tone.",
      },
      {
        heading: "Pick a language your family can pronounce",
        body: "Noor, Zahra and Anwar (Arabic), Lior and Uriel (Hebrew), Svetlana (Russian) and Deepika (Sanskrit) all carry a lovely light meaning, but pronunciation varies. Check how relatives will say it before you commit.",
      },
    ],
    names: [
      // Girls
      { name: "Lucy", gender: "girl", origin: "Latin", meaning: "light (from lux)", note: "Friendly, timeless and easy to love; a steady top-100 name." },
      { name: "Lucia", gender: "girl", origin: "Latin / Italian", meaning: "light", note: "The Italian and Spanish form, with a softer, more romantic sound." },
      { name: "Lucille", gender: "girl", origin: "French", meaning: "light (French form of Lucia)", note: "Vintage glamour, as in Lucille Ball." },
      { name: "Clara", gender: "girl", origin: "Latin", meaning: "bright, clear", note: "A gentle, clear-sounding classic." },
      { name: "Claire", gender: "girl", origin: "French", meaning: "bright, clear (French form of Clara)", note: "Crisp and polished, with a French spelling." },
      { name: "Aurora", gender: "girl", origin: "Latin", meaning: "dawn", note: "Named for the Roman goddess of the sunrise; also the northern lights." },
      { name: "Phoebe", gender: "girl", origin: "Greek", meaning: "bright, radiant (from phoibos)", note: "Cheerful and literary, with a Titan goddess in the background." },
      { name: "Liora", gender: "girl", origin: "Hebrew", meaning: "my light", note: "Melodic and easy to say; Lior is the unisex form." },
      { name: "Ora", gender: "girl", origin: "Hebrew", meaning: "light", note: "Short and simple, with a clear Hebrew meaning." },
      { name: "Orly", gender: "girl", origin: "Hebrew", meaning: "light for me", note: "Playful and distinctive; common in Israel." },
      { name: "Noor", gender: "girl", origin: "Arabic", meaning: "light", note: "Widely loved across Arabic, Persian and Urdu-speaking communities." },
      { name: "Zahra", gender: "girl", origin: "Arabic", meaning: "radiant, shining, blossom", note: "A name with deep cultural significance, easy to say in English." },
      { name: "Luz", gender: "girl", origin: "Spanish", meaning: "light", note: "A traditional Spanish name, often paired with Maria." },
      { name: "Svetlana", gender: "girl", origin: "Slavic", meaning: "light, bright, pure", note: "A strong Russian classic with the nickname Lana." },
      { name: "Deepika", gender: "girl", origin: "Sanskrit", meaning: "little lamp, light", note: "From deepa, 'lamp'; common in India, with the nickname Deepi." },
      // Boys
      { name: "Lucius", gender: "boy", origin: "Latin", meaning: "light", note: "A Roman family name with a distinctly bookish feel." },
      { name: "Lucian", gender: "boy", origin: "Latin", meaning: "light", note: "Sounds fresh without being strange." },
      { name: "Luca", gender: "boy", origin: "Italian", meaning: "man from Lucania (often linked to lux, light)", note: "Quick, friendly and popular across Europe." },
      { name: "Uriel", gender: "boy", origin: "Hebrew", meaning: "God is my light", note: "The name of an archangel; bold and spiritual." },
      { name: "Ori", gender: "boy", origin: "Hebrew", meaning: "my light", note: "Short, modern and easy to pronounce." },
      { name: "Lior", gender: "boy", origin: "Hebrew", meaning: "my light", note: "Works equally well for any child; two syllables, one clear meaning." },
      { name: "Nuri", gender: "boy", origin: "Arabic", meaning: "my light, luminous", note: "A gentle Arabic and Turkish name with a bright sound." },
      { name: "Anwar", gender: "boy", origin: "Arabic", meaning: "more luminous, brighter", note: "Common in the Muslim world, with a confident rhythm." },
      { name: "Zahir", gender: "boy", origin: "Arabic", meaning: "radiant, shining, brilliant", note: "Distinctive yet easy to say; the same root as Zahra." },
      { name: "Elio", gender: "boy", origin: "Italian / Greek", meaning: "sun (from Greek helios)", note: "Vowel-rich and sunny; popularised by the novel 'Call Me by Your Name'." },
      { name: "Helios", gender: "boy", origin: "Greek", meaning: "sun", note: "The Greek sun god; bold and unmistakable." },
      { name: "Surya", gender: "boy", origin: "Sanskrit", meaning: "sun", note: "The Hindu sun deity; also used for girls in some regions." },
      // Unisex
      { name: "Kiran", gender: "unisex", origin: "Sanskrit", meaning: "ray of light, beam", note: "Used for boys and girls across India." },
      { name: "Jyoti", gender: "unisex", origin: "Sanskrit", meaning: "light, flame", note: "Widely used for girls, and also for boys in some families." },
      { name: "Lux", gender: "unisex", origin: "Latin", meaning: "light", note: "Ultra-short and modern; a bold choice for any gender." },
    ],
    faqs: [
      { q: "What is the most popular baby name that means light?", a: "Lucy is the best-known girls' name meaning light, and Lucas and Luca are very popular for boys, although Lucas technically means 'man from Lucania', a place name often linked to lux. Noor is the most widely used light name in Arabic-speaking regions." },
      { q: "What are unique names that mean light?", a: "Liora, Orly, Uriel, Zahir, Lux and Deepika are all uncommon in the US but have a clear 'light' meaning and are easy to say." },
      { q: "What's the difference between names meaning light and names meaning dawn?", a: "Light names (Lucy, Noor, Lior) describe brightness itself, while dawn names (Aurora) and sun names (Elio, Surya) describe where that light comes from. They are often chosen together for the same sentiment." },
      { q: "Is Helena a name that means light?", a: "Possibly. Helena is often linked to the Greek helene, 'torch' or 'bright', but scholars debate the origin, so we list Helios and other names whose meaning is certain." },
    ],
    updated: UPDATED,
  },

  // ── MOON ────────────────────────────────────────────────────────────────────
  {
    slug: "moon",
    kind: "theme",
    title: "Baby Names That Mean Moon: {n} Celestial Names With Meanings",
    metaTitle: "Baby Names That Mean Moon: {n} Girl, Boy & Unisex Names",
    metaDescription:
      "{n} baby names that mean moon or moonlight, from Luna and Selene to Chandra and Mani. Meanings, origins and the stories behind each name.",
    kicker: "Names that mean moon",
    intro: [
      "Moon names are some of the most evocative a child can have: calm, luminous and tied to the cycles of nature. This list covers {n} names that mean moon, moonlight or a full moon, plus the moon goddesses Artemis and Diana, drawn from Latin, Greek, Sanskrit, Arabic, Persian, Japanese, Swahili, Hawaiian and Nahuatl.",
      "Luna is the best-known, but the moon appears in many languages as a name. Each entry below gives you the meaning, the origin and a quick note on how the name feels in everyday use.",
    ],
    featured: ["Luna", "Selene", "Chandra", "Ayla", "Badr", "Mani"],
    tips: [
      {
        heading: "Luna is common now, so consider the alternatives",
        body: "Luna has been a top-ten girls' name in the US for several years. If you want the moon without a class full of Lunas, look at Selene (Greek), Chandni (Hindi), Kamaria (Swahili) or Mahina (Hawaiian), which are all rarer and just as beautiful.",
      },
      {
        heading: "Moon names exist for boys too",
        body: "Badr ('full moon' in Arabic), Mani (the Norse moon god) and Soma (Sanskrit) are strong, uncommon boys' options, and Hilal, Qamar, Yue and Chandra work for any child.",
      },
      {
        heading: "Pair a moon name with a sun or star name for siblings",
        body: "Moon names pair well with Elio or Surya (sun) and Stella or Estelle (star). A celestial sibling set feels intentional without being matchy.",
      },
    ],
    names: [
      // Girls
      { name: "Luna", gender: "girl", origin: "Latin", meaning: "moon", note: "The Roman moon goddess; a modern favourite that also feels timeless." },
      { name: "Selene", gender: "girl", origin: "Greek", meaning: "moon (the Greek moon goddess)", note: "Dreamier and rarer than Luna, with the nickname Lena." },
      { name: "Selena", gender: "girl", origin: "Greek", meaning: "moon (variant of Selene)", note: "A familiar, easy-to-spell take on Selene." },
      { name: "Artemis", gender: "girl", origin: "Greek", meaning: "meaning uncertain (Greek goddess of the moon and the hunt)", note: "Strong and mythic, with a long literary history." },
      { name: "Diana", gender: "girl", origin: "Latin", meaning: "divine (Roman goddess associated with the moon and the hunt)", note: "A regal classic with a moon-goddess backstory." },
      { name: "Chandni", gender: "girl", origin: "Hindi", meaning: "moonlight", note: "Lyrical and common in India; pronounced CHUND-nee." },
      { name: "Ayla", gender: "girl", origin: "Turkish", meaning: "moonlight, halo around the moon", note: "Short, modern and one of the most widely used moon names." },
      { name: "Mahtab", gender: "girl", origin: "Persian", meaning: "moonlight", note: "Literally 'the glow of the moon' (mah + tab)." },
      { name: "Tsukiko", gender: "girl", origin: "Japanese", meaning: "moon child (tsuki, 'moon' + ko, 'child')", note: "Delicate and traditional." },
      { name: "Kamaria", gender: "girl", origin: "Swahili", meaning: "like the moon, moonlight", note: "Bright and rhythmic, with African roots." },
      { name: "Mahina", gender: "girl", origin: "Hawaiian", meaning: "moon", note: "Soft-sounding and meaningful; the word for 'moon' in Hawaiian." },
      { name: "Meztli", gender: "girl", origin: "Nahuatl", meaning: "moon", note: "An Aztec (Nahuatl) name that is rare and easy to love." },
      // Boys
      { name: "Badr", gender: "boy", origin: "Arabic", meaning: "full moon", note: "A beloved Arabic name, with a strong one-syllable sound." },
      { name: "Mani", gender: "boy", origin: "Norse", meaning: "moon (the Norse personification of the moon)", note: "Short and mythic; also an Indian name with a different meaning." },
      { name: "Soma", gender: "boy", origin: "Sanskrit", meaning: "moon (also a sacred drink in Vedic texts)", note: "Used as a given name in India and Hungary." },
      // Unisex
      { name: "Chandra", gender: "unisex", origin: "Sanskrit", meaning: "moon, shining", note: "Used for boys in India and for girls in the West." },
      { name: "Hilal", gender: "unisex", origin: "Arabic", meaning: "crescent moon", note: "Common in Turkey and across the Muslim world." },
      { name: "Qamar", gender: "unisex", origin: "Arabic", meaning: "moon", note: "A poetic favourite; used for boys and girls." },
      { name: "Yue", gender: "unisex", origin: "Chinese", meaning: "moon (月)", note: "Short and widely used; the meaning depends on the character chosen." },
      { name: "Lunar", gender: "unisex", origin: "English", meaning: "of the moon", note: "A modern word name; bold and rare." },
    ],
    faqs: [
      { q: "What is the most popular baby name that means moon?", a: "Luna is by far the most popular, and has been a top-ten girls' name in the US in recent years. Ayla, a Turkish name meaning 'moonlight', is another common choice." },
      { q: "What are unique baby names that mean moon?", a: "Selene, Chandni, Kamaria, Mahina, Meztli and Mahtab are all uncommon in the US and have a clear moon meaning." },
      { q: "Are there boy names that mean moon?", a: "Yes. Badr ('full moon', Arabic), Mani (Norse) and Soma (Sanskrit) are boys' names, and Chandra, Hilal, Qamar and Yue work for any child." },
      { q: "Is Diana a moon name?", a: "Diana means 'divine' in Latin, but she was the Roman goddess of the moon and the hunt, so the association with the moon is strong. We list her as a moon-goddess name, not a direct translation of 'moon'." },
    ],
    updated: UPDATED,
  },
];
