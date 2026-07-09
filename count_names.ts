import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function run() {
  const { count, error } = await supabase
    .from("names")
    .select("*", { count: "exact", head: true })
    .is("ai_explanation", null);
  
  if (error) console.error(error);
  else console.log("Names without explanation:", count);
}
run();
