#!/usr/bin/env node
/**
 * scripts/seed-name-pages-batch-3.mjs
 *
 * Hand-written name pages for high-volume names that had no page yet and are not
 * pending in names_queue (amelia, maeve, aria, nova, hazel, isla, luca, jack, aaron,
 * isaac, owen, nathan). Content was written by hand, not generated.
 * Popularity: SSA 2025 national ranks (released May 2026), read from the SSA-sourced
 * Behind the Name US table.
 *
 * Usage:
 *   node scripts/seed-name-pages-batch-3.mjs            # dry run: validate + print, write nothing
 *   node scripts/seed-name-pages-batch-3.mjs --apply    # insert missing slugs as published
 *   node scripts/seed-name-pages-batch-3.mjs --apply --draft   # insert as draft instead
 *
 * Never overwrites: slugs that already exist in name_pages are skipped, and so are
 * slugs pending in names_queue (the daily cron upserts and would replace hand-written copy).
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const SSA_YEAR = 2025;

const PAGES = [
  {
    slug: "amelia",
    name: "Amelia",
    gender: "girl",
    origin: "Germanic",
    meaning_short: "Amelia comes from the Germanic word amal, meaning 'work', and is often described as 'industrious'.",
    meaning_long:
      "Amelia is a Germanic name built on the element amal, which meant 'work' or 'effort', so the name carries the idea of industry and perseverance. It is often confused with Emilia and Aemilia, which come from a Roman family name and mean 'rival', but the two names have separate roots and only overlap in sound.\n\nThe name reached English speakers in the eighteenth century, when it was used by the Hanoverian royal family (Princess Amelia, the daughter of George II) and in Henry Fielding's 1751 novel 'Amelia'. In the twentieth century the aviator Amelia Earhart gave it a bold, adventurous image that has stayed with it ever since.\n\nToday Amelia is among the top five girls' names in the US. It is long enough to feel elegant and stately, yet it shortens easily to Millie, Mia, Amy or Lia, so a child can choose how formal she wants to be.",
    pronunciation_ipa: "əˈmiː.li.ə",
    pronunciation_text: "uh-MEE-lee-uh",
    syllables: 4,
    nicknames: ["Millie", "Mia", "Amy", "Lia"],
    ssa_rank: 4,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Amelia has climbed steadily over the past few decades and now ranks in the top five.",
    middle_names: {
      classic: ["Amelia Rose", "Amelia Grace", "Amelia Jane", "Amelia Elizabeth"],
      modern: ["Amelia Wren", "Amelia Sage", "Amelia Pearl", "Amelia Wilde"],
      one_syllable: ["Amelia Faith", "Amelia Claire", "Amelia Jade", "Amelia Rae"],
      family_friendly: ["Amelia Marie", "Amelia Ann", "Amelia Lynn", "Amelia Catherine"],
    },
    similar_names: ["olivia", "charlotte", "mia", "emma", "ava", "nora"],
    sibling_names: {
      boys: ["Henry", "Theodore", "Oliver", "Jack"],
      girls: ["Charlotte", "Eleanor", "Hazel", "Violet"],
    },
    famous_namesakes: [
      { name: "Amelia Earhart", known_for: "American aviator who was the first woman to fly solo across the Atlantic Ocean." },
      { name: "Amelia Bloomer", known_for: "American women's rights advocate and newspaper editor of the nineteenth century." },
    ],
    personality_note:
      "Parents who choose Amelia like a name that feels graceful but not fragile. Amelia suits families who want a traditional, well-known name with a built-in nickname, and the adventurous legacy of Amelia Earhart gives it more spirit than other long, formal girls' names.",
  },
  {
    slug: "maeve",
    name: "Maeve",
    gender: "girl",
    origin: "Irish",
    meaning_short: "Maeve is the anglicised form of the Irish Medb and is usually translated 'she who intoxicates'.",
    meaning_long:
      "Maeve is the modern spelling of the Old Irish name Medb, which is related to the word for mead and is usually translated as 'intoxicating' or 'she who intoxicates'. Medb is a legendary queen of Connacht in the Ulster Cycle, the most famous of the ancient Irish epics, where she leads an army in the cattle raid told in the 'Táin Bó Cúailnge'.\n\nBecause of that ancestry, Maeve has long been used in Ireland as a strong, proud and slightly mischievous name. The writer Maeve Binchy made it familiar to readers around the world in the late twentieth century, and it has been a favourite outside Ireland ever since.\n\nIn the US, Maeve has risen steadily and now ranks among the top 100 girls' names. It is short, easy to say and has a clear, bright sound that pairs well with both formal and relaxed middle names.",
    pronunciation_ipa: "meɪv",
    pronunciation_text: "MAYV",
    syllables: 1,
    nicknames: ["Mae", "Maevie"],
    ssa_rank: 76,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Maeve has risen steadily over the past two decades and now sits in the top 100.",
    middle_names: {
      classic: ["Maeve Elizabeth", "Maeve Catherine", "Maeve Margaret", "Maeve Rose"],
      modern: ["Maeve Wilder", "Maeve Juniper", "Maeve Eden", "Maeve Marlowe"],
      one_syllable: ["Maeve Claire", "Maeve Jane", "Maeve Faith", "Maeve Rae"],
      family_friendly: ["Maeve Anne", "Maeve Louise", "Maeve Marie", "Maeve Grace"],
    },
    similar_names: ["nora", "hannah", "lila", "maya", "estelle", "genevieve"],
    sibling_names: {
      boys: ["Finn", "Rowan", "Declan", "Callum"],
      girls: ["Nora", "Ivy", "Clara", "Imogen"],
    },
    famous_namesakes: [
      { name: "Maeve Binchy", known_for: "Irish novelist and journalist, author of 'Circle of Friends' and 'Tara Road'." },
      { name: "Maeve Brennan", known_for: "Irish-born American short-story writer and longtime staff writer at The New Yorker." },
    ],
    personality_note:
      "Parents who choose Maeve usually want an Irish name with real mythology behind it. Maeve suits families who like names that are short and strong but not common, and the legend of Queen Medb gives the name a confident, queenly backstory that fits a spirited child.",
  },
  {
    slug: "aria",
    name: "Aria",
    gender: "girl",
    origin: "Italian",
    meaning_short: "Aria is an Italian word meaning 'air', and in music it means a solo song in an opera.",
    meaning_long:
      "Aria comes straight from the Italian word for 'air', and in music it came to mean a melody, specifically a song for one voice in an opera or oratorio. As a given name it is therefore a musical one: parents often choose it for its sound and the sense of a song carried on air.\n\nThere are other roots that overlap with the same spelling. Aria is also used as a short form of names ending in -aria or -ariana, and in Persian-speaking communities Arya means 'noble'. Because the name is spelled the same in so many languages, it is easy to say and spell almost anywhere.\n\nAria has climbed steadily since the 2000s, thanks to its short, open sound. It now sits comfortably in the top 30 and feels modern but not odd.",
    pronunciation_ipa: "ˈɑː.ri.ə",
    pronunciation_text: "AH-ree-uh",
    syllables: 3,
    nicknames: ["Ari", "Ria"],
    ssa_rank: 26,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Aria has risen quickly since the 2000s and now ranks in the top 30.",
    middle_names: {
      classic: ["Aria Rose", "Aria Grace", "Aria Elizabeth", "Aria Jane"],
      modern: ["Aria Wren", "Aria Sage", "Aria Skye", "Aria Wilde"],
      one_syllable: ["Aria Claire", "Aria Faith", "Aria Jade", "Aria Joy"],
      family_friendly: ["Aria Marie", "Aria Lynn", "Aria Anne", "Aria Nicole"],
    },
    similar_names: ["luna", "mia", "lila", "maya", "nora", "ava"],
    sibling_names: {
      boys: ["Leo", "Milo", "Ezra", "Kai"],
      girls: ["Luna", "Nova", "Willow", "Hazel"],
    },
    famous_namesakes: [
      { name: "Aria Montgomery", known_for: "Fictional character in the TV series 'Pretty Little Liars'." },
    ],
    personality_note:
      "Parents who choose Aria tend to love music and want a name that sounds like a song. Aria suits families who like short, vowel-rich names such as Mia and Luna but want something with a clearer meaning, and its easy pronunciation in English, Spanish and Italian is a practical bonus.",
  },
  {
    slug: "nova",
    name: "Nova",
    gender: "girl",
    origin: "Latin",
    meaning_short: "Nova is the Latin word for 'new', and in astronomy it names a star that suddenly flares in brightness.",
    meaning_long:
      "Nova is the feminine form of the Latin adjective novus, meaning 'new'. In astronomy a nova is a star that suddenly becomes much brighter and then fades, and the word came into wide use after Tycho Brahe's 1573 book 'De nova stella', 'on the new star'. The same Latin root gives us 'novel', 'novice' and 'renovate'.\n\nAs a given name Nova combines two appealing ideas: new beginnings and a bright star. Nova Scotia, the Canadian province whose name means 'New Scotland', also gives it a geographic note, and the same Latin root gives names such as Novella and Novalie.\n\nNova has risen quickly in recent years alongside other celestial names such as Luna and Stella. It is short, bright and easy to pronounce, with a modern feel that still has a clear classical meaning.",
    pronunciation_ipa: "ˈnoʊ.və",
    pronunciation_text: "NOH-vuh",
    syllables: 2,
    nicknames: ["Novi", "Nov"],
    ssa_rank: 46,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Nova has risen quickly in recent years and now ranks in the top 50 girls' names.",
    middle_names: {
      classic: ["Nova Elizabeth", "Nova Grace", "Nova Rose", "Nova Jane"],
      modern: ["Nova Wren", "Nova Sage", "Nova Wilde", "Nova Juniper"],
      one_syllable: ["Nova Claire", "Nova Faith", "Nova Jade", "Nova Joy"],
      family_friendly: ["Nova Marie", "Nova Anne", "Nova Lynn", "Nova Catherine"],
    },
    similar_names: ["luna", "estelle", "aria", "lila", "maya", "nora"],
    sibling_names: {
      boys: ["Atlas", "Kai", "Rowan", "Milo"],
      girls: ["Luna", "Stella", "Aurora", "Ivy"],
    },
    famous_namesakes: null,
    personality_note:
      "Parents who choose Nova are usually drawn to a name that means fresh starts and looks to the sky. Nova suits families who like celestial names but find Luna too popular, and its short, two-syllable shape gives it a confident, modern ring that works well with a longer middle name.",
  },
  {
    slug: "hazel",
    name: "Hazel",
    gender: "girl",
    origin: "English",
    meaning_short: "Hazel is an English nature name for the hazel tree and its nuts, as well as a warm greenish-brown eye colour.",
    meaning_long:
      "Hazel comes from the Old English word hæsel, the name of the hazel tree. It is a straightforward nature name, like Rose or Ivy, and has also been used for the greenish-brown colour of eyes and nuts.\n\nThe hazel tree has a long place in folklore. In Celtic myth, hazelnuts were said to hold wisdom, and the Irish tale of the Salmon of Knowledge describes a salmon that gained all the world's knowledge by eating nuts from nine hazel trees. In many traditions hazel branches were also used for divining rods and as symbols of protection.\n\nHazel was very popular in the early twentieth century, faded in the middle of the century and has climbed back since the 2000s. Today it is a top-25 girls' name, a vintage choice that feels warm and quietly stylish.",
    pronunciation_ipa: "ˈheɪ.zəl",
    pronunciation_text: "HAY-zul",
    syllables: 2,
    nicknames: ["Haze", "Hazey"],
    ssa_rank: 21,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Hazel has made a strong comeback since the 2000s and now ranks in the top 25 girls' names.",
    middle_names: {
      classic: ["Hazel Rose", "Hazel Grace", "Hazel Jane", "Hazel Elizabeth"],
      modern: ["Hazel Wren", "Hazel Juniper", "Hazel Sage", "Hazel Wilde"],
      one_syllable: ["Hazel Claire", "Hazel Faith", "Hazel Jade", "Hazel Joy"],
      family_friendly: ["Hazel Marie", "Hazel Anne", "Hazel Lynn", "Hazel Louise"],
    },
    similar_names: ["nora", "lila", "olivia", "maya", "hannah", "luna"],
    sibling_names: {
      boys: ["Henry", "Theodore", "Silas", "Wyatt"],
      girls: ["Violet", "Ivy", "Willow", "Clara"],
    },
    famous_namesakes: [
      { name: "Hazel Scott", known_for: "Trinidad-born American jazz and classical pianist and actress." },
    ],
    personality_note:
      "Parents who choose Hazel love vintage names with an earthy, gentle feel. Hazel suits families who like nature names but want one with deep roots in English tradition, and the hazel-wisdom myth gives it a thoughtful, storybook meaning.",
  },
  {
    slug: "isla",
    name: "Isla",
    gender: "girl",
    origin: "Scottish",
    meaning_short: "Isla is a Scottish name taken from the island of Islay and from the River Isla; it is pronounced 'EYE-luh'.",
    meaning_long:
      "Isla (pronounced EYE-luh) is a Scottish name that comes from Islay, the island in the Inner Hebrides, and from the River Isla in eastern Scotland. In Spanish, isla also means 'island', so the name has a clear meaning in two languages.\n\nIt began as a place name, then came into use as a given name in Scotland in the nineteenth century. It spread through the English-speaking world in the 2000s, and the actress Isla Fisher made it familiar to many.\n\nIn the US, Isla has risen quickly and now sits in the top 30 for girls. Its short length, soft sounds and watery meaning give it a calm, breezy feel.",
    pronunciation_ipa: "ˈaɪ.lə",
    pronunciation_text: "EYE-luh",
    syllables: 2,
    nicknames: ["Izzy", "Isi"],
    ssa_rank: 28,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Isla has risen quickly since the late 2000s and now ranks in the top 30.",
    middle_names: {
      classic: ["Isla Rose", "Isla Grace", "Isla Jane", "Isla Elizabeth"],
      modern: ["Isla Wren", "Isla Sage", "Isla Skye", "Isla Wilde"],
      one_syllable: ["Isla Claire", "Isla Faith", "Isla Jade", "Isla Joy"],
      family_friendly: ["Isla Marie", "Isla Anne", "Isla Lynn", "Isla Louise"],
    },
    similar_names: ["luna", "mia", "ava", "lila", "maya", "nora"],
    sibling_names: {
      boys: ["Finn", "Callum", "Rowan", "Theo"],
      girls: ["Luna", "Willow", "Ivy", "Nova"],
    },
    famous_namesakes: [
      { name: "Isla Fisher", known_for: "Australian actress known for 'Wedding Crashers' and 'Confessions of a Shopaholic'." },
      { name: "Isla St Clair", known_for: "Scottish singer and television presenter." },
    ],
    personality_note:
      "Parents who choose Isla like a soft, short name with a Scottish or Spanish thread. Isla suits families who want something light and airy like Luna or Mia, and the island meaning makes it a natural choice for anyone who loves the coast.",
  },
  {
    slug: "luca",
    name: "Luca",
    gender: "boy",
    origin: "Italian",
    meaning_short: "Luca is the Italian form of Luke and means 'man from Lucania', a region in southern Italy.",
    meaning_long:
      "Luca is the Italian form of Luke, from the Greek Loukas and the Latin Lucas, meaning 'man from Lucania', a mountainous region in southern Italy. The place name is often linked to the Latin word lux, 'light', so many parents hear 'light' in the name, although the geographic origin is the one scholars favour.\n\nIn Italy, Luca is one of the most widely used boys' names and has been for generations, borne by the painter Luca Signorelli and the footballer Luca Toni. It has also spread to Croatia, Romania, Germany and the Netherlands.\n\nIn the US, Luca has climbed quickly in recent years. It feels familiar thanks to Luke and Lucas but more distinctive, and its light, friendly sound is easy for almost any language.",
    pronunciation_ipa: "ˈluː.kə",
    pronunciation_text: "LOO-kuh",
    syllables: 2,
    nicknames: ["Lu", "Luki"],
    ssa_rank: 14,
    ssa_year: SSA_YEAR,
    trend_direction: "rising",
    trend_context: "Luca has climbed quickly in recent years and now ranks in the top 15.",
    middle_names: {
      classic: ["Luca James", "Luca Alexander", "Luca Michael", "Luca Anthony"],
      modern: ["Luca Atlas", "Luca Jasper", "Luca Beckett", "Luca Wilder"],
      one_syllable: ["Luca Blake", "Luca Grant", "Luca Reid", "Luca Cole"],
      family_friendly: ["Luca John", "Luca Thomas", "Luca Daniel", "Luca Paul"],
    },
    similar_names: ["lucas", "luke", "leo", "milo", "theo", "finn"],
    sibling_names: {
      boys: ["Leo", "Milo", "Enzo", "Matteo"],
      girls: ["Sofia", "Aria", "Mia", "Isla"],
    },
    famous_namesakes: [
      { name: "Luca Modrić", known_for: "Croatian footballer who captained Croatia and played for Real Madrid." },
      { name: "Luca Guadagnino", known_for: "Italian film director of 'Call Me by Your Name'." },
    ],
    personality_note:
      "Parents who choose Luca like the sound of Lucas or Luke but want something lighter and more international. Luca suits families with any Italian, Spanish or Mediterranean connection, and it is simple enough to carry across languages without losing its charm.",
  },
  {
    slug: "jack",
    name: "Jack",
    gender: "boy",
    origin: "English",
    meaning_short: "Jack is a medieval English pet form of John and means 'God is gracious'.",
    meaning_long:
      "Jack began in medieval England as a pet form of John, probably through the form Jankin, a diminutive of Jan. John comes from the Hebrew Yohanan, 'God is gracious', so Jack shares that meaning even though it has long been used as an independent name.\n\nIn English, Jack came to mean 'an ordinary fellow', which is why it appears in words such as 'jack of all trades', 'lumberjack' and 'jackpot', and why it is the hero of so many folk tales, including 'Jack and the Beanstalk' and 'Jack the Giant Killer'. The name carries a sense of cheeky resourcefulness.\n\nJack has been a top-25 boys' name in the US for years and is one of the most widely used boys' names in the UK. It is one syllable, hard to misspell and easy to say, and it feels as comfortable on a child as on a grandfather.",
    pronunciation_ipa: "dʒæk",
    pronunciation_text: "JAK",
    syllables: 1,
    nicknames: ["Jackie", "Jacko"],
    ssa_rank: 15,
    ssa_year: SSA_YEAR,
    trend_direction: "stable",
    trend_context: "Jack has stayed in the top 25 boys' names in the US for many years.",
    middle_names: {
      classic: ["Jack Alexander", "Jack William", "Jack Henry", "Jack Edward"],
      modern: ["Jack Atlas", "Jack Wilder", "Jack Beckett", "Jack Jasper"],
      one_syllable: ["Jack Blake", "Jack Grant", "Jack Reid", "Jack Cole"],
      family_friendly: ["Jack Michael", "Jack Thomas", "Jack Daniel", "Jack Andrew"],
    },
    similar_names: ["henry", "james", "oliver", "luke", "finn", "leo"],
    sibling_names: {
      boys: ["Henry", "Oliver", "Theodore", "Milo"],
      girls: ["Lucy", "Emma", "Charlotte", "Hazel"],
    },
    famous_namesakes: [
      { name: "Jack Nicholson", known_for: "American actor, winner of three Academy Awards, known for 'The Shining' and 'One Flew Over the Cuckoo's Nest'." },
      { name: "Jack London", known_for: "American author of 'The Call of the Wild' and 'White Fang'." },
      { name: "Jack Black", known_for: "American actor and musician, known for 'School of Rock' and the Tenacious D band." },
    ],
    personality_note:
      "Parents who choose Jack usually want a name that is friendly, short and unfussy but not forgettable. Jack suits families who like classics such as John or James but want a more casual, cheerful version, and its long history in stories gives it a cheeky, good-natured personality.",
  },
  {
    slug: "aaron",
    name: "Aaron",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Aaron is a Hebrew name of uncertain meaning, most often explained as 'exalted' or 'mountain of strength'.",
    meaning_long:
      "Aaron is a Hebrew name whose meaning is debated. The most common explanations are 'exalted' or 'mountain of strength', while some scholars suggest an Egyptian origin. What is certain is its history: in the Bible Aaron is the older brother of Moses and the first high priest of Israel, who acts as his brother's spokesman before Pharaoh.\n\nThe name has been used by Jewish, Christian and Muslim communities for centuries (in Arabic it is Harun) and was common among English Puritans. In the twentieth century it was shaped by figures such as the composer Aaron Copland and baseball legend Hank Aaron, who used it as a surname.\n\nAaron was much more popular in the US in the 1980s and 1990s and has since eased down, but it remains in the top 100. It is simple, balanced and clear, and its double-a spelling is easy to recognise.",
    pronunciation_ipa: "ˈɛr.ən",
    pronunciation_text: "AIR-un",
    syllables: 2,
    nicknames: ["Aar", "Ron"],
    ssa_rank: 80,
    ssa_year: SSA_YEAR,
    trend_direction: "falling",
    trend_context: "Aaron was much more popular in the 1980s and 1990s and has eased down gradually since.",
    middle_names: {
      classic: ["Aaron James", "Aaron Michael", "Aaron Joseph", "Aaron Alexander"],
      modern: ["Aaron Wilder", "Aaron Jasper", "Aaron Atlas", "Aaron Beckett"],
      one_syllable: ["Aaron Blake", "Aaron Grant", "Aaron Reid", "Aaron Cole"],
      family_friendly: ["Aaron John", "Aaron Thomas", "Aaron Daniel", "Aaron Paul"],
    },
    similar_names: ["daniel", "samuel", "david", "ethan", "elijah", "caleb"],
    sibling_names: {
      boys: ["Daniel", "Samuel", "Joshua", "Isaac"],
      girls: ["Hannah", "Sarah", "Rachel", "Naomi"],
    },
    famous_namesakes: [
      { name: "Aaron Copland", known_for: "American composer of 'Appalachian Spring' and 'Fanfare for the Common Man'." },
      { name: "Aaron Judge", known_for: "American baseball outfielder for the New York Yankees." },
      { name: "Aaron Rodgers", known_for: "American football quarterback who won the Super Bowl with the Green Bay Packers." },
    ],
    personality_note:
      "Parents who choose Aaron tend to like a dependable biblical name that is not trendy. Aaron suits families who want something familiar and clean, and its connection to a brother and spokesman gives it a loyal, supportive character.",
  },
  {
    slug: "isaac",
    name: "Isaac",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Isaac comes from the Hebrew Yitzhak and means 'he will laugh'.",
    meaning_long:
      "Isaac comes from the Hebrew Yitzhak, which means 'he will laugh' or 'he laughs'. The Bible explains the name in the book of Genesis: when Abraham and Sarah, both very old, are told they will have a son, each laughs in disbelief, and the child is called Isaac.\n\nThe name has long been shared by Jews, Christians and Muslims (in Arabic it is Ishaq) and it entered English in the Middle Ages. Isaac Newton, who described gravity and the laws of motion, made it a name of scientific genius, and writers like Isaac Asimov and musicians such as Isaac Hayes have given it a creative edge.\n\nIn the US, Isaac has held a steady place around the top 50 for years. It is easy to spell and say, and has friendly nicknames: Ike, Zac and Izzy.",
    pronunciation_ipa: "ˈaɪ.zək",
    pronunciation_text: "EYE-zuk",
    syllables: 2,
    nicknames: ["Ike", "Zac", "Izzy"],
    ssa_rank: 47,
    ssa_year: SSA_YEAR,
    trend_direction: "stable",
    trend_context: "Isaac has held a steady place in the top 60 boys' names for many years.",
    middle_names: {
      classic: ["Isaac James", "Isaac Alexander", "Isaac William", "Isaac Henry"],
      modern: ["Isaac Atlas", "Isaac Wilder", "Isaac Jasper", "Isaac Beckett"],
      one_syllable: ["Isaac Blake", "Isaac Grant", "Isaac Reid", "Isaac Cole"],
      family_friendly: ["Isaac John", "Isaac Thomas", "Isaac Daniel", "Isaac Paul"],
    },
    similar_names: ["elijah", "ezra", "samuel", "daniel", "caleb", "levi"],
    sibling_names: {
      boys: ["Jacob", "Samuel", "Asher", "Elias"],
      girls: ["Hannah", "Rebecca", "Ruth", "Eliza"],
    },
    famous_namesakes: [
      { name: "Isaac Newton", known_for: "English mathematician and physicist who formulated the laws of motion and universal gravitation." },
      { name: "Isaac Asimov", known_for: "American science fiction author of the 'Foundation' and 'I, Robot' series." },
      { name: "Isaac Hayes", known_for: "American soul musician who won an Academy Award for 'Theme from Shaft'." },
    ],
    personality_note:
      "Parents who choose Isaac like a name that mixes warmth and intellect. Isaac suits families who want a biblical name that reads as thoughtful, and its meaning, 'he will laugh', gives it a cheerful note that few other serious classics have.",
  },
  {
    slug: "owen",
    name: "Owen",
    gender: "boy",
    origin: "Welsh",
    meaning_short: "Owen is the Welsh name Owain, whose meaning is uncertain; it has been read as 'young warrior', 'noble' or 'well-born'.",
    meaning_long:
      "Owen is the Anglicised form of the Welsh Owain, which has several proposed meanings: 'young warrior', 'noble' or 'well-born', the last from a link with Latin Eugenius and Greek Eugenes. The name is also used in Ireland, where it can be an anglicisation of Eoghan, which is sometimes connected to the word for 'yew tree'.\n\nIt is a very old name in Wales, borne by medieval princes including Owain Glyndŵr, who led the last major Welsh revolt against English rule in the early fifteenth century. The Welsh form is a surname too, as in Wilfred Owen, the First World War poet.\n\nOwen has been a top-50 name in the US for years and has the easy, friendly sound that parents like in short names. It works for a toddler and an adult alike.",
    pronunciation_ipa: "ˈoʊ.ən",
    pronunciation_text: "OH-en",
    syllables: 2,
    nicknames: ["Owie", "Owey"],
    ssa_rank: 31,
    ssa_year: SSA_YEAR,
    trend_direction: "stable",
    trend_context: "Owen has stayed in the top 50 boys' names for more than a decade.",
    middle_names: {
      classic: ["Owen James", "Owen Alexander", "Owen William", "Owen Henry"],
      modern: ["Owen Atlas", "Owen Wilder", "Owen Jasper", "Owen Beckett"],
      one_syllable: ["Owen Blake", "Owen Grant", "Owen Reid", "Owen Cole"],
      family_friendly: ["Owen John", "Owen Thomas", "Owen Daniel", "Owen Paul"],
    },
    similar_names: ["wyatt", "henry", "oliver", "finn", "milo", "asher"],
    sibling_names: {
      boys: ["Finn", "Henry", "Caleb", "Rowan"],
      girls: ["Nora", "Hazel", "Maeve", "Isla"],
    },
    famous_namesakes: [
      { name: "Owen Wilson", known_for: "American actor known for 'Wedding Crashers' and 'Midnight in Paris'." },
      { name: "Owen Hargreaves", known_for: "Canadian-born English footballer who played for Bayern Munich and Manchester United." },
    ],
    personality_note:
      "Parents who choose Owen usually want a gentle but sturdy name with Celtic roots. Owen suits families who like short, friendly classics such as Wyatt or Henry, and the Welsh heritage adds a quiet sense of history without feeling fussy.",
  },
  {
    slug: "nathan",
    name: "Nathan",
    gender: "boy",
    origin: "Hebrew",
    meaning_short: "Nathan is a Hebrew name meaning 'he gave' or 'gift'.",
    meaning_long:
      "Nathan comes from the Hebrew Natan, which means 'he gave' or 'gift'. It is a short form of longer names such as Nathaniel ('gift of God') and Jonathan ('God has given'), but it is also used on its own.\n\nIn the Bible, Nathan is the prophet who confronts King David about his sin and who delivers a message from God about David's house. The name was used by Jewish and Christian communities through the centuries and became popular in English-speaking countries in the nineteenth century. In American history, Nathan Hale is remembered for his last words before being hanged by the British for spying in the Revolutionary War.\n\nNathan was more popular in the US in the early 2000s and has declined since, though it remains in the top 100. It is simple, balanced and easy to say, and shortens naturally to Nate.",
    pronunciation_ipa: "ˈneɪ.θən",
    pronunciation_text: "NAY-thun",
    syllables: 2,
    nicknames: ["Nate", "Nat", "Nathe"],
    ssa_rank: 63,
    ssa_year: SSA_YEAR,
    trend_direction: "falling",
    trend_context: "Nathan was more popular in the early 2000s and has declined gradually, though it is still in the top 100.",
    middle_names: {
      classic: ["Nathan James", "Nathan Alexander", "Nathan William", "Nathan Henry"],
      modern: ["Nathan Atlas", "Nathan Wilder", "Nathan Jasper", "Nathan Beckett"],
      one_syllable: ["Nathan Blake", "Nathan Grant", "Nathan Reid", "Nathan Cole"],
      family_friendly: ["Nathan John", "Nathan Thomas", "Nathan Daniel", "Nathan Paul"],
    },
    similar_names: ["daniel", "samuel", "david", "ethan", "elijah", "caleb"],
    sibling_names: {
      boys: ["Daniel", "Samuel", "Joshua", "Isaac"],
      girls: ["Hannah", "Sarah", "Rachel", "Naomi"],
    },
    famous_namesakes: [
      { name: "Nathan Hale", known_for: "American soldier and spy executed by the British in 1776 during the Revolutionary War." },
      { name: "Nathan Lane", known_for: "American actor and Tony Award winner, known for 'The Producers' and 'The Birdcage'." },
      { name: "Nathan Fillion", known_for: "Canadian actor known for 'Firefly' and 'Castle'." },
    ],
    personality_note:
      "Parents who choose Nathan like a biblical name that is unpretentious. Nathan suits families who want a short form that still has a clear meaning, and the built-in nickname Nate gives it a casual, friendly side.",
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

// Never touch a slug the daily generator is about to produce: its cron upserts and would replace hand-written copy.
const { data: queued } = await supabase.from("names_queue").select("slug").in("slug", PAGES.map((p) => p.slug)).neq("status", "published");
const inQueue = new Set((queued ?? []).map((r) => r.slug));

const { data: existing, error: readErr } = await supabase.from("name_pages").select("slug").in("slug", PAGES.map((p) => p.slug));
if (readErr) {
  console.error("Could not read name_pages:", readErr.message);
  process.exit(1);
}
const have = new Set(existing.map((r) => r.slug));

for (const p of PAGES) {
  if (inQueue.has(p.slug)) {
    console.log(`⏭  ${p.slug} is pending in names_queue; skipped`);
    continue;
  }
  if (have.has(p.slug)) {
    console.log(`⏭  ${p.slug} already exists; skipped`);
    continue;
  }
  const { error } = await supabase.from("name_pages").insert({ ...p, status: asDraft ? "draft" : "published" });
  console.log(error ? `❌ ${p.slug}: ${error.message}` : `✅ inserted ${p.slug} (${asDraft ? "draft" : "published"})`);
}
