import type { ScreenshotKey } from "@/lib/app-links";

/**
 * Content for the /features/[slug] SEO pages — one page per feature inside the Namely app.
 * Each entry targets one primary keyword cluster so pages don't cannibalise each other
 * (or the existing intent-based landing pages such as /tinder-for-baby-names).
 */

export type FeatureIcon = "swipe" | "match" | "meaning" | "filter" | "sparkles" | "partner" | "list";

export interface FeatureSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: { title: string; text: string }[];
}

export interface FeatureFaq {
  q: string;
  a: string;
}

export interface Feature {
  slug: string;
  icon: FeatureIcon;
  /** Short label for nav, cards and breadcrumbs */
  name: string;
  /** One-line summary for the hub page and related cards */
  summary: string;
  /** <title> — kept under ~60 chars */
  metaTitle: string;
  /** Meta description — kept under ~158 chars */
  metaDescription: string;
  primaryKeyword: string;
  eyebrow: string;
  h1: string;
  intro: string;
  screenshot: ScreenshotKey;
  /** Floating chips around the hero screenshot */
  chips: [string, string, string];
  highlights: { title: string; text: string }[];
  sections: FeatureSection[];
  steps: { title: string; text: string }[];
  faqs: FeatureFaq[];
  related: string[];
  /** Existing intent landing page to cross-link to (internal linking) */
  landingLink?: { href: string; label: string };
}

export const FEATURES: Feature[] = [
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "swipe-baby-names",
    icon: "swipe",
    name: "Swipe Baby Names",
    summary: "A swipe-to-decide name card for every baby name — like it or pass in a second.",
    metaTitle: "Swipe Baby Names App — Like or Pass in One Tap | Namely",
    metaDescription:
      "Swipe through baby names one card at a time. See meaning, origin and pronunciation on every card, undo mistakes, and never see the same name twice.",
    primaryKeyword: "swipe baby names app",
    eyebrow: "Swipe to decide",
    h1: "Swipe Baby Names, One Beautiful Card at a Time",
    intro:
      "Scrolling through endless lists of baby names is exhausting. Namely turns the search into a quick, focused decision: one name, one card, one swipe. Swipe right on names you love, left on names that aren't for you, and let the app keep track of everything — so you can work through dozens of names in the time it takes to drink a coffee.",
    screenshot: "swipe",
    chips: ["Meaning on every card", "Undo any swipe", "No repeats"],
    highlights: [
      { title: "One name at a time", text: "A single, distraction-free card makes it easy to react honestly instead of skimming a list." },
      { title: "Context on the card", text: "Meaning, origin, pronunciation and style tags appear right on the card before you decide." },
      { title: "Undo in one tap", text: "Swiped too fast? Bring the last name straight back with the undo button." },
      { title: "Never the same name twice", text: "Names you've already judged are removed from your queue for good." },
    ],
    sections: [
      {
        id: "why-swiping-works",
        heading: "Why swiping is the fastest way to choose a baby name",
        paragraphs: [
          "Most baby name websites show you hundreds of names on one page. That sounds helpful, but in practice it causes decision fatigue: after the first fifty names everything starts to blur together, and you end up remembering only the first few you read.",
          "Swiping fixes that by asking a single question at a time — do I like this name, yes or no? Your gut reaction is usually the most honest signal you have, and a swipe captures it instantly. Because the decision is so small, you can comfortably review a whole list of names in a few minutes, and you can stop and pick up again whenever you have a spare moment.",
          "Namely was designed around this idea from day one. Every name gets its own full-screen card with a large serif headline, so you can see — and say — the name properly before you decide.",
        ],
      },
      {
        id: "whats-on-each-card",
        heading: "What you see on every name card",
        paragraphs: [
          "A name is more than how it looks. Each card in Namely gives you just enough context to make a confident choice without leaving the swipe flow:",
        ],
        bullets: [
          { title: "Pronunciation", text: "A phonetic guide such as /ah-MAH-rah/ so you know exactly how a name is said." },
          { title: "Meaning", text: "The core meaning of the name, for example Amara — “grace”." },
          { title: "Origin", text: "Where the name comes from, such as Igbo, Latin, Greek, Hebrew or Irish." },
          { title: "Gender", text: "Clearly labelled as a girl, boy or unisex name." },
          { title: "Style tags", text: "Quick descriptors like soft, rare, classic, modern, short or strong." },
        ],
      },
      {
        id: "swipe-with-your-partner",
        heading: "Swipe on your own, match together",
        paragraphs: [
          "Swiping is even better when there are two of you. Once you link with your partner, you each swipe privately on your own phone. Your partner never sees the names you passed on, and you never see theirs — the only names either of you find out about are the ones you both swiped right on.",
          "That privacy matters. It means you can pass on a name your partner's family loves without starting a debate, and you can like an unusual name without worrying about how it sounds out loud. When you both say yes, Namely celebrates the match and saves it to your shared Matches list.",
        ],
      },
      {
        id: "a-queue-that-keeps-moving",
        heading: "A queue that keeps moving forward",
        paragraphs: [
          "The home screen always shows how many names are left in your current list, with a progress bar so you can see how far you've come. When you finish a list, generate a fresh one tailored to your preferences — names you've already swiped won't come back, so every list feels new.",
          "Changed your mind about a name you passed on a moment ago? The undo button brings back the previous card so a quick thumb never costs you a name you love.",
        ],
      },
    ],
    steps: [
      { title: "Download Namely", text: "Install the free app on iPhone or Android and set your basic preferences." },
      { title: "Tap Start swiping", text: "Your first list of names is ready on the Discover screen." },
      { title: "Swipe right or left", text: "Heart the names you love, pass on the rest, and undo if you change your mind." },
      { title: "Check your matches", text: "Names you and your partner both liked appear in Matches automatically." },
    ],
    faqs: [
      { q: "How do I swipe baby names in Namely?", a: "Open the Discover tab and tap Start swiping. Swipe right or tap the heart to like a name, swipe left or tap the cross to pass. Every liked name is saved to your Likes list." },
      { q: "Can I undo a swipe?", a: "Yes. Tap the undo arrow next to the like and pass buttons to bring back the last name you swiped." },
      { q: "Will I see the same baby name again?", a: "No. Once you've swiped on a name it's removed from your queue, and newly generated lists skip names you've already judged." },
      { q: "Can my partner see the names I swiped left on?", a: "No. Your swipes are private. Your partner only ever sees names that you both liked." },
      { q: "Do I need a partner to use the swipe feature?", a: "No. You can swipe and build your Likes list on your own, then invite your partner whenever you're ready." },
    ],
    related: ["baby-name-matching", "baby-name-meanings", "ai-baby-name-generator"],
    landingLink: { href: "/tinder-for-baby-names", label: "Looking for a Tinder-style baby name app?" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "baby-name-matching",
    icon: "match",
    name: "Partner Name Matching",
    summary: "See only the names you and your partner both love — instantly, with no arguments.",
    metaTitle: "Baby Name Matcher for Couples — Match With Your Partner | Namely",
    metaDescription:
      "Namely's baby name matcher reveals a match only when you and your partner both like a name. Private votes, instant matches and a shared shortlist.",
    primaryKeyword: "baby name matcher",
    eyebrow: "Instant matches",
    h1: "The Baby Name Matcher That Ends the Debate",
    intro:
      "Choosing a baby name together shouldn't feel like a negotiation. With Namely, you and your partner each vote privately, and a name only appears as a match when you've both said yes. No vetoes to defend, no awkward \"you hate all my names\" moments — just a growing list of names you genuinely agree on.",
    screenshot: "matches",
    chips: ["Private votes", "Real-time matches", "Shared shortlist"],
    highlights: [
      { title: "Matches only on mutual likes", text: "A name is revealed only when both partners have liked it independently." },
      { title: "Votes stay private", text: "Neither of you sees the names the other passed on, so there's no pressure." },
      { title: "Instant notifications", text: "The match appears the moment the second partner likes the name." },
      { title: "One shared list", text: "Every match is saved with its meaning, origin and style tags for easy comparison." },
    ],
    sections: [
      {
        id: "how-matching-works",
        heading: "How baby name matching works",
        paragraphs: [
          "Namely's matching is simple by design. Both partners link their accounts, then swipe through baby names on their own phones. Every like is recorded privately. As soon as the same name has been liked by both of you, Namely creates a match and shows it to you both.",
          "Because matches are calculated from two independent decisions, they're honest. Nobody liked a name to keep the peace, and nobody had to talk the other into it. What you end up with is a shortlist built entirely from common ground.",
        ],
      },
      {
        id: "why-private-votes",
        heading: "Why private voting leads to better names",
        paragraphs: [
          "When couples go through a book of baby names together, one person usually reads a name aloud and the other reacts — often to the reaction rather than the name. Over time, one partner's favourites can dominate simply because they spoke up first or pushed harder.",
          "Private votes remove that dynamic completely:",
        ],
        bullets: [
          { title: "No defending your vetoes", text: "Passing on a name is silent. Your partner never learns which names you rejected." },
          { title: "No people-pleasing", text: "You only like names you actually like, because nobody is watching." },
          { title: "No winner by default", text: "A name can't make the list just because one person wore the other down." },
          { title: "Fewer arguments", text: "Conversations start from names you already agree on, which keeps them positive." },
        ],
      },
      {
        id: "your-matches-list",
        heading: "Your Matches list: a shortlist you both agree on",
        paragraphs: [
          "Every match lands in the Matches tab, showing the name alongside its meaning, origin and style tags — for example Olivia (“olive tree”, Latin, classic, nature) or Theo (“gift of God”, Greek, short, classic). The home screen keeps a live count, so you can watch your shortlist grow.",
          "Tap any match to see the full name profile with pronunciation, popularity and length. Star the ones that stand out to build a final shortlist when it's time to decide.",
        ],
      },
      {
        id: "from-matches-to-the-one",
        heading: "From a list of matches to the one",
        paragraphs: [
          "Most couples find that a handful of matches is all it takes to start a meaningful conversation. Say the names out loud with your surname, try them with possible middle names, and imagine calling them across a playground. Because every name on the list is already something you both like, narrowing down becomes the fun part instead of the hard part.",
        ],
      },
    ],
    steps: [
      { title: "Link with your partner", text: "Share your invite link or 6-letter code — your partner joins in seconds." },
      { title: "Swipe separately", text: "Each of you likes or passes on names in your own time, on your own phone." },
      { title: "Get matched", text: "When you both like the same name, Namely shows the match to both of you." },
      { title: "Shortlist and decide", text: "Star your favourite matches and talk through the names you already agree on." },
    ],
    faqs: [
      { q: "What is a baby name matcher?", a: "A baby name matcher lets two people vote on names separately and shows only the names they both like. Namely is a baby name matcher built specifically for couples." },
      { q: "Does my partner need the app to match?", a: "Yes. Both partners install Namely and link accounts. It works across iPhone and Android, so you don't need the same type of phone." },
      { q: "Can my partner see the names I didn't like?", a: "No. Passed names are never shared. Only mutual likes are revealed as matches." },
      { q: "How fast do matches appear?", a: "Instantly. The match is created as soon as the second partner likes the name, and it appears for both of you." },
      { q: "Can we match on names we added from different lists?", a: "Yes. Matches are based on the name itself, so if you both like the same name it becomes a match regardless of which list it came from." },
    ],
    related: ["partner-sync", "baby-name-shortlist", "swipe-baby-names"],
    landingLink: { href: "/baby-name-app-no-fighting", label: "See how Namely helps couples avoid name arguments" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "baby-name-meanings",
    icon: "meaning",
    name: "Name Meanings & Origins",
    summary: "Meaning, origin, pronunciation, popularity and length for every baby name.",
    metaTitle: "Baby Name Meanings, Origins & Pronunciation | Namely App",
    metaDescription:
      "Know what every baby name means before you choose it. Namely shows meaning, origin, pronunciation, popularity, syllables and style for each name.",
    primaryKeyword: "baby name meanings and origins",
    eyebrow: "Know every name",
    h1: "Baby Name Meanings, Origins & Pronunciation in One Place",
    intro:
      "A name is a story your child will carry for life. Namely gives every baby name a complete profile — what it means, where it comes from, how to say it, how popular it is and how it sounds — so you can choose with confidence instead of guessing.",
    screenshot: "meanings",
    chips: ["Meaning", "Origin", "Pronunciation"],
    highlights: [
      { title: "Clear meanings", text: "A short, plain-English meaning for every name — no digging through forums." },
      { title: "Cultural origins", text: "See whether a name is Latin, Greek, Hebrew, Irish, Igbo and many more." },
      { title: "How to say it", text: "Phonetic pronunciation guides like /oh-LIV-ee-uh/ remove the guesswork." },
      { title: "Popularity & length", text: "Know how common a name is, plus its syllables and letter count." },
    ],
    sections: [
      {
        id: "why-meaning-matters",
        heading: "Why the meaning of a baby name matters",
        paragraphs: [
          "Many parents want a name that sounds beautiful and means something too. A meaning can honour a family value, a heritage or a hope you have for your child — and it's one of the first things people ask about when they hear a new baby's name.",
          "Knowing the meaning also protects you from surprises. Some names that sound lovely carry meanings you might not choose on purpose, while others have a hidden depth that makes them even more special. Namely puts that knowledge in front of you at the exact moment you're deciding.",
        ],
      },
      {
        id: "full-name-profile",
        heading: "What's inside every name profile",
        paragraphs: ["Tap any name — in your Likes, your Matches or while swiping — to open its full profile:"],
        bullets: [
          { title: "Meaning", text: "The core meaning in a few words, e.g. Olivia — “olive tree”, Leo — “lion”, Noah — “rest, comfort”." },
          { title: "Origin", text: "The language or culture the name comes from, shown with a flag or symbol for quick scanning." },
          { title: "Pronunciation", text: "A phonetic spelling that shows stressed syllables, so you can say the name correctly." },
          { title: "Popularity", text: "Whether a name is very popular, rising, or still rare." },
          { title: "Length", text: "Number of syllables and letters — useful when pairing first, middle and last names." },
          { title: "Style", text: "Tags like classic, nature, modern, soft, strong or biblical that describe the feel of the name." },
        ],
      },
      {
        id: "origins-and-heritage",
        heading: "Explore names from cultures around the world",
        paragraphs: [
          "Namely's catalogue spans many origins, from timeless Latin, Greek and Hebrew names to Irish, Scandinavian, African, Arabic and Asian names. Seeing the origin on every card makes it easy to find names that reflect your family's heritage — or to discover beautiful names from cultures you hadn't considered.",
          "If heritage is important to you, combine the origin information with Namely's filters to focus your lists on the origins you care about most.",
        ],
      },
      {
        id: "pronunciation",
        heading: "Never mispronounce a name again",
        paragraphs: [
          "Names like Amara, Saoirse, Niamh or Anaïs are gorgeous on paper but easy to get wrong out loud. Namely includes a pronunciation guide on every name card so you and your partner hear the name the same way before you vote. It's a small detail that prevents a lot of \"oh, I thought it was said differently\" moments later.",
        ],
      },
    ],
    steps: [
      { title: "Swipe or search", text: "Find names on the Discover screen or search your Likes." },
      { title: "Read the card", text: "See meaning, origin and pronunciation at a glance while swiping." },
      { title: "Open the profile", text: "Tap a name for popularity, length and style details." },
      { title: "Star the keepers", text: "Save the names whose stories you love to your shortlist." },
    ],
    faqs: [
      { q: "Does Namely show the meaning of every baby name?", a: "Yes. Every name in Namely includes a meaning, origin and pronunciation guide, along with popularity, length and style tags in the full profile." },
      { q: "Where do the name meanings come from?", a: "Meanings and origins are compiled from established etymology and naming references, then written in short, plain English so they're easy to read on a phone." },
      { q: "Can I find names from a specific culture or origin?", a: "Yes. Each name shows its origin, and you can set origin preferences when generating new lists so they focus on the cultures you care about." },
      { q: "Can I look up name meanings without the app?", a: "You can browse our free baby name directory on this website for detailed meanings, origins and popularity. The app adds swiping, matching and personalised lists." },
    ],
    related: ["baby-name-filters", "swipe-baby-names", "baby-name-shortlist"],
    landingLink: { href: "/names", label: "Browse the free baby name directory" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "baby-name-filters",
    icon: "filter",
    name: "Gender, Style & Origin Filters",
    summary: "Filter baby names by boy, girl or unisex, style, origin, length and more.",
    metaTitle: "Filter Baby Names by Gender, Style & Origin | Namely App",
    metaDescription:
      "Find classic, unique or gender-neutral baby names faster. Filter by boy, girl or unisex, style, origin, length and starting letter in the Namely app.",
    primaryKeyword: "filter baby names by origin",
    eyebrow: "Classic, unique, gender neutral",
    h1: "Filter Baby Names by Gender, Style and Origin",
    intro:
      "Every family has its own taste. Some want a timeless classic, others a rare name nobody else at nursery will have, and many are looking for something gender neutral. Namely's filters shape every list around what you actually want — so you spend your time on names that fit, not scrolling past ones that never will.",
    screenshot: "filters",
    chips: ["Boys · Girls · Unisex", "Classic to rare", "Any origin"],
    highlights: [
      { title: "Boy, girl or unisex", text: "Focus on one gender, both, or names that work for any child." },
      { title: "Style that fits you", text: "Classic, modern, elegant, rare, nature, short, strong, soft and more." },
      { title: "Origins you love", text: "Choose the cultures and languages your names should come from." },
      { title: "Fine-tune the details", text: "Length, starting letter and names to avoid keep lists relevant." },
    ],
    sections: [
      {
        id: "why-filters",
        heading: "Why filtering baby names saves hours",
        paragraphs: [
          "There are tens of thousands of baby names in use around the world. Without filters, most of the names you see won't suit your style, your surname or your heritage — and each one costs a little attention to dismiss.",
          "Namely's preferences work upstream. Instead of hiding names after the fact, they shape which names get picked for your lists in the first place, so the names on your cards are already a good fit.",
        ],
      },
      {
        id: "available-filters",
        heading: "Every way you can filter names",
        paragraphs: ["Set these preferences when you generate a list, and adjust them whenever your taste evolves:"],
        bullets: [
          { title: "Gender", text: "Boy names, girl names, unisex names, or a mix — perfect if you don't know the sex yet." },
          { title: "Style", text: "Classic, elegant, modern, rare, nature-inspired, short, strong, soft, biblical and other moods." },
          { title: "Origin", text: "Latin, Greek, Hebrew, Irish, Italian, Scandinavian, African, Arabic and many more." },
          { title: "Length", text: "Prefer short and punchy or long and lyrical? Set a length that pairs with your surname." },
          { title: "Starting letter", text: "Looking for a name that begins with a specific letter to honour someone? Easy." },
          { title: "Names to avoid", text: "Rule out names that belong to exes, relatives or anyone else you'd rather not echo." },
        ],
      },
      {
        id: "filter-your-likes",
        heading: "Filter and search your Likes",
        paragraphs: [
          "Filters aren't just for new names. In the Likes tab you can switch between All, Boys, Girls and Unisex with one tap and search your saved names by text. Each liked name keeps its meaning, origin and style tags, so it's easy to compare — for example Rowan (“little red one”, Irish, nature), Quinn (“wise”, Irish, modern) or Avery (“ruler of the elves”, English, classic).",
        ],
      },
      {
        id: "gender-neutral-names",
        heading: "Built for gender-neutral and surprise pregnancies",
        paragraphs: [
          "If you're waiting to find out — or simply love names that work for any child — the Unisex filter surfaces names that feel natural for boys and girls alike. Combine it with a style like modern or nature to discover names such as Rowan, Quinn, Riley or Avery that you might otherwise miss.",
        ],
      },
    ],
    steps: [
      { title: "Tap Generate a new list", text: "Open the preferences sheet from the Discover screen." },
      { title: "Choose gender, style and origins", text: "Pick as many or as few as you like." },
      { title: "Add the details", text: "Optionally set length, starting letter and names to avoid." },
      { title: "Show me names", text: "Your personalised list is ready to swipe in seconds." },
    ],
    faqs: [
      { q: "Can I filter baby names by origin?", a: "Yes. When you generate a list you can choose one or more origins, such as Latin, Greek, Irish or Hebrew, and Namely will focus on names from those cultures." },
      { q: "Does Namely have gender-neutral baby names?", a: "Yes. Choose Unisex in your preferences, or filter your Likes by Unisex, to see names that suit any child." },
      { q: "Can I exclude certain names?", a: "Yes. Add names to your avoid list and they won't appear in your future name lists." },
      { q: "Can my partner and I have different filters?", a: "Yes. Each partner sets their own preferences. Namely's AI generator can also take both of your styles into account when building a list." },
    ],
    related: ["ai-baby-name-generator", "baby-name-meanings", "baby-name-shortlist"],
    landingLink: { href: "/gender-neutral-baby-names-app", label: "Explore gender-neutral baby names" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-baby-name-generator",
    icon: "sparkles",
    name: "AI Baby Name Generator",
    summary: "Fresh, personalised lists of 30 names that blend both partners' tastes.",
    metaTitle: "AI Baby Name Generator — Personalised for Two | Namely",
    metaDescription:
      "Generate fresh lists of baby names with AI. Namely picks 30 names based on gender, style and origin — and blends both partners' tastes into one list.",
    primaryKeyword: "ai baby name generator",
    eyebrow: "Powered by AI",
    h1: "An AI Baby Name Generator That Knows Both of You",
    intro:
      "Generic name generators give everyone the same suggestions. Namely's AI baby name generator builds a fresh list of 30 names around your preferences — gender, style and origins — and takes both partners' tastes into account, so every list feels like it was picked just for your family.",
    screenshot: "generator",
    chips: ["30 names per list", "Blends both tastes", "Always fresh"],
    highlights: [
      { title: "Personalised lists", text: "Every list is built from your chosen gender, styles and origins." },
      { title: "Designed for two", text: "The generator considers both partners' preferences, not just one." },
      { title: "Never repetitive", text: "Names you've already swiped are skipped, so each list is genuinely new." },
      { title: "Ready in seconds", text: "Tap Show me names and start swiping immediately." },
    ],
    sections: [
      {
        id: "how-the-ai-works",
        heading: "How Namely's AI baby name generator works",
        paragraphs: [
          "When you tap Generate a new list, Namely looks at the preferences you've set — gender, style and origins — and picks 30 names that fit. It's not a random shuffle: the generator balances well-loved names with less common finds that match the same feel, so your list has both familiar favourites and pleasant surprises.",
          "If you're linked with a partner, Namely takes both of your styles into account. That means the list leans toward names you're both likely to enjoy, which leads to more matches and fewer wasted swipes.",
        ],
      },
      {
        id: "why-ai",
        heading: "Why use AI to find baby names?",
        paragraphs: [
          "Traditional baby name lists are static — the same top 100 names, sorted the same way, for everyone. AI makes it possible to explore a much bigger space of names while still staying close to your taste.",
        ],
        bullets: [
          { title: "Breadth", text: "Discover names from more origins and styles than you'd find in a single book or chart." },
          { title: "Relevance", text: "Lists are shaped around your preferences instead of global popularity." },
          { title: "Freshness", text: "Generate a new list whenever you want — no more re-reading the same names." },
          { title: "Fairness", text: "Blending both partners' styles keeps the search balanced from the very first list." },
        ],
      },
      {
        id: "generator-plus-matching",
        heading: "The generator and matching work together",
        paragraphs: [
          "The AI generator decides which names you see; the matching system decides which ones make your shortlist. Together they turn a vague \"we should think about names\" into a clear process: generate a list, swipe through it, see your matches, repeat.",
          "Each new list skips names you've already judged, so the more you swipe, the more the experience moves forward instead of going in circles.",
        ],
      },
      {
        id: "tips",
        heading: "Tips for getting the best AI-generated names",
        paragraphs: [
          "Start broad — two or three styles and a couple of origins — and swipe through a full list before narrowing down. Once you notice a pattern in the names you like (say, short nature names), adjust your preferences to match and generate again. Small changes to style or origin can produce a surprisingly different list.",
        ],
      },
    ],
    steps: [
      { title: "Tap Generate a new list", text: "From the Discover screen, open the generator." },
      { title: "Check your preferences", text: "Confirm gender, styles and origins — or adjust them first." },
      { title: "Tap Show me names", text: "Namely builds 30 personalised names in seconds." },
      { title: "Swipe and repeat", text: "Swipe the list, see your matches, and generate again any time." },
    ],
    faqs: [
      { q: "Is Namely's AI baby name generator free?", a: "Namely is free to download. Unlimited AI-generated name lists are part of Namely Premium, which costs $6.99/week and can be cancelled any time in the App Store or Google Play." },
      { q: "How many names does the AI generate?", a: "Each generated list contains 30 names picked for you based on your gender, style and origin preferences." },
      { q: "Does the generator consider my partner's taste?", a: "Yes. When you're linked, Namely takes both partners' styles into account so the list suits you both." },
      { q: "Will the AI suggest names I've already seen?", a: "No. Names you've already swiped on are skipped, so every list is fresh." },
      { q: "Can I use the generator for boy, girl and unisex names?", a: "Yes. Choose boys, girls, unisex or any combination in your preferences before generating." },
    ],
    related: ["baby-name-filters", "baby-name-matching", "swipe-baby-names"],
    landingLink: { href: "/baby-name-generator-for-couples", label: "Read more about our baby name generator for couples" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "partner-sync",
    icon: "partner",
    name: "Partner Linking & Sync",
    summary: "Link with your partner once and stay in sync across iPhone and Android.",
    metaTitle: "Share Baby Names With Your Partner — Real-Time Sync | Namely",
    metaDescription:
      "Link with your partner using an invite link or 6-letter code. Namely keeps your baby name likes and matches in sync across iPhone and Android in real time.",
    primaryKeyword: "share baby names with partner app",
    eyebrow: "Better together",
    h1: "Share Baby Names With Your Partner, in Real Time",
    intro:
      "Notes-app lists, screenshots in group chats, names scribbled on the back of a receipt — sharing baby name ideas is usually messy. Namely links you and your partner once, then keeps everything in sync automatically, whether you're on the same sofa or in different time zones, on iPhone or Android.",
    screenshot: "home",
    chips: ["6-letter invite code", "iOS + Android", "Live sync"],
    highlights: [
      { title: "Link in seconds", text: "Send an invite link or share a 6-letter code — that's it." },
      { title: "Works across platforms", text: "One partner on iPhone, the other on Android? No problem." },
      { title: "Real-time sync", text: "Likes and matches update instantly on both phones." },
      { title: "Link once, stay linked", text: "No re-linking every session — your connection persists." },
    ],
    sections: [
      {
        id: "how-linking-works",
        heading: "How partner linking works",
        paragraphs: [
          "After you install Namely, you'll find your personal invite code in the app. Send your partner the invite link, or read them the 6-letter code. They open Namely, enter the code, and your accounts are connected instantly.",
          "Your partner doesn't even need an account beforehand — the invite link walks them through getting set up and joining you in one go.",
        ],
      },
      {
        id: "what-syncs",
        heading: "What stays in sync between you",
        paragraphs: ["Once linked, Namely keeps the important things shared — and the private things private:"],
        bullets: [
          { title: "Matches", text: "Every name you both liked appears on both phones the moment it's created." },
          { title: "Match count", text: "The home screen shows a live count of your shared matches." },
          { title: "Shared preferences", text: "The AI generator can blend both partners' styles into one list." },
          { title: "Private swipes", text: "Individual likes and passes stay on your own phone until they become a match." },
        ],
      },
      {
        id: "cross-platform",
        heading: "Made for mixed iPhone and Android couples",
        paragraphs: [
          "Plenty of couples don't share a phone platform, and many baby name apps quietly ignore that. Namely is available on both the App Store and Google Play, and a linked couple works exactly the same regardless of which phone each of you has.",
        ],
      },
      {
        id: "long-distance",
        heading: "Perfect for busy schedules and long distances",
        paragraphs: [
          "You don't need to sit down together to make progress. Swipe on your commute, during a lunch break or late at night — your partner will see new matches the next time they open the app. It's a gentle, low-pressure way to keep the conversation going through the months of pregnancy.",
        ],
      },
    ],
    steps: [
      { title: "Install Namely", text: "Download the app on iPhone or Android." },
      { title: "Find your invite code", text: "Copy your invite link or 6-letter code from the app." },
      { title: "Send it to your partner", text: "They open the link or enter the code to join you." },
      { title: "Start matching", text: "Swipe separately — matches sync to both phones instantly." },
    ],
    faqs: [
      { q: "How do I link with my partner in Namely?", a: "Share your invite link or 6-letter code from the app. Your partner opens the link or enters the code, and your accounts are linked immediately." },
      { q: "Can we link if one of us has an iPhone and the other has Android?", a: "Yes. Namely works across iOS and Android, and linked partners get the same experience on both." },
      { q: "Does my partner need to create an account first?", a: "No. The invite link guides a new user through sign-up and links them to you in the same flow." },
      { q: "Do we have to re-link every time?", a: "No. Once linked, you stay connected across sessions until one of you chooses to unlink." },
    ],
    related: ["baby-name-matching", "baby-name-shortlist", "ai-baby-name-generator"],
    landingLink: { href: "/best-baby-name-app-for-couples", label: "Why couples call Namely the best baby name app" },
  },

  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: "baby-name-shortlist",
    icon: "list",
    name: "Likes, Matches & Shortlist",
    summary: "Every liked name, every match and your starred favourites — organised and searchable.",
    metaTitle: "Baby Name List & Shortlist App — Likes and Favourites | Namely",
    metaDescription:
      "Keep every baby name you love in one place. Namely saves your likes, shared matches and starred favourites in a searchable, filterable shortlist.",
    primaryKeyword: "baby name list app",
    eyebrow: "Your shortlist",
    h1: "Your Baby Name List and Shortlist, Beautifully Organised",
    intro:
      "Somewhere between the first name you liked and the name on the birth certificate, there are dozens of maybes. Namely keeps every one of them organised: a Likes list for the names you love, a Matches list for the names you both love, and stars for the ones that make your heart skip.",
    screenshot: "filters",
    chips: ["Searchable likes", "Shared matches", "Starred favourites"],
    highlights: [
      { title: "Every like saved", text: "Each name you swipe right on is kept in your Likes list automatically." },
      { title: "Matches in one place", text: "Names you both liked live together in a shared Matches tab." },
      { title: "Star your favourites", text: "Mark the front-runners so your final shortlist is always one tap away." },
      { title: "Search and filter", text: "Find any saved name by text or by Boys, Girls and Unisex." },
    ],
    sections: [
      {
        id: "three-lists",
        heading: "Three lists that turn maybes into a decision",
        paragraphs: ["Namely organises your name search into three simple layers, each one closer to the final answer:"],
        bullets: [
          { title: "Likes", text: "Every name you personally liked — your private long list." },
          { title: "Matches", text: "Names both you and your partner liked — your shared shortlist." },
          { title: "Starred", text: "The matches you've marked as favourites — your final contenders." },
        ],
      },
      {
        id: "likes",
        heading: "Your Likes: a searchable long list",
        paragraphs: [
          "The Likes tab shows how many names you've fallen for and lists each one with its meaning, origin and style tags. Use the search bar to find a name instantly, or switch between All, Boys, Girls and Unisex to compare like with like.",
          "The home screen also shows your most recently liked names as quick chips, so a name you loved this morning is never more than a tap away.",
        ],
      },
      {
        id: "matches-and-stars",
        heading: "Matches and stars: your shortlist",
        paragraphs: [
          "Every match appears in the Matches tab with the same rich details as your likes. Tap the star next to a match to mark it as a favourite. When you open the full profile you'll see pronunciation, popularity, syllables and letter count, plus a Star this name button — perfect for comparing your top few side by side.",
        ],
      },
      {
        id: "how-many-names",
        heading: "How many names should be on your shortlist?",
        paragraphs: [
          "There's no perfect number, but many couples find that three to five starred names is the sweet spot: enough to keep options open, few enough to talk through properly. Some parents even wait to meet their baby before choosing between their final two. Namely keeps your shortlist safe until you're ready.",
        ],
      },
    ],
    steps: [
      { title: "Like names as you swipe", text: "Each heart adds the name to your Likes list." },
      { title: "Collect matches", text: "Names you both liked appear in Matches automatically." },
      { title: "Star your favourites", text: "Tap the star on the matches you love most." },
      { title: "Decide together", text: "Review your starred names and choose the one." },
    ],
    faqs: [
      { q: "Where are my liked baby names saved?", a: "Every name you like is saved in the Likes tab. You can search it and filter by Boys, Girls or Unisex." },
      { q: "What's the difference between Likes and Matches?", a: "Likes are names you liked on your own. Matches are names that both you and your partner liked." },
      { q: "Can I star or favourite a name?", a: "Yes. Tap the star on any match, or use the Star this name button on the full name profile." },
      { q: "Will I lose my list if I change phones?", a: "No. Your likes and matches are tied to your account, so they're restored when you sign in on a new device." },
    ],
    related: ["baby-name-matching", "baby-name-meanings", "partner-sync"],
    landingLink: { href: "/pregnancy-baby-name-app", label: "Namely for expecting parents" },
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
