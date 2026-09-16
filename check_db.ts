import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getSupabase } from "./lib/supabase-server";

async function run() {
  const db = getSupabase();
  const { data, error } = await db.from("blog_posts").select("slug, status, title");
  if (error) {
    console.error(error);
  } else {
    console.log("All blog posts:", data);
  }
}

run().catch(console.error);
