import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function run() {
  const { data: names, error } = await supabase
    .from("names")
    .select("id, name")
    .is("ai_explanation", null);

  if (error || !names) {
    console.error("Error fetching names", error);
    return;
  }

  console.log(`Found ${names.length} names to process.`);

  // Process in batches of 20
  const BATCH_SIZE = 20;
  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(names.length / BATCH_SIZE)}`);
    
    await Promise.all(batch.map(async (n) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a culturally aware baby name expert. Provide a fascinating, concise, and beautifully written explanation of the baby name. Keep it to exactly 3 short, punchy sentences. Cover its origin, its core vibe, and one notable reference. Do not use Markdown formatting, dashes, bullet points, asterisks, or underscores. Just return clean, plain text.",
            },
            {
              role: "user",
              content: `Explain the name: ${n.name}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
        });

        const explanation = response.choices[0].message.content?.trim() || "";
        if (explanation) {
          await supabase.from("names").update({ ai_explanation: explanation }).eq("id", n.id);
        }
      } catch (err: any) {
        console.error(`Failed to process ${n.name}: ${err.message}`);
      }
    }));
    // short delay between batches to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  console.log("Done backfilling explanations.");
}

run();
