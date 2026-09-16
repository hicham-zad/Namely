import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getSupabase } from "./lib/supabase-server";

async function run() {
  const db = getSupabase();
  const slugsToPublish = [
    "100-unique-baby-names-and-meanings",
    "baby-name-trends-2026",
    "gender-neutral-baby-names", // The DB has this instead of -2026
    "how-to-avoid-baby-name-arguments",
    "ai-baby-name-generator-how-it-works"
  ];

  const { data, error } = await db
    .from("blog_posts")
    .update({ status: "published" })
    .in("slug", slugsToPublish)
    .select();

  if (error) {
    console.error(error);
  } else {
    console.log("Published posts:", data?.map(p => p.slug));
  }
}

run().catch(console.error);
