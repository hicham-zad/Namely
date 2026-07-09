import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nameId, name, source } = body; // source: "ai" | "db" | undefined
    if (!nameId || !name) return NextResponse.json({ error: "Missing name details" }, { status: 400 });

    // 2. Check both tables for a cached explanation
    // Try the table matching the source first, then fall back to the other
    let existingExplanation: string | null = null;
    let resolvedTable: "names" | "ai_names" = source === "ai" ? "ai_names" : "names";

    const { data: primaryRow } = await supabaseAdmin
      .from(resolvedTable)
      .select("ai_explanation")
      .eq("id", nameId)
      .single();

    if (primaryRow?.ai_explanation) {
      return NextResponse.json({ explanation: primaryRow.ai_explanation });
    }

    // If not found in primary table, try the other (handles legacy / uncertain source)
    const fallbackTable: "names" | "ai_names" = resolvedTable === "names" ? "ai_names" : "names";
    const { data: fallbackRow } = await supabaseAdmin
      .from(fallbackTable)
      .select("ai_explanation")
      .eq("id", nameId)
      .single();

    if (fallbackRow?.ai_explanation) {
      return NextResponse.json({ explanation: fallbackRow.ai_explanation });
    }

    // 3. Generate with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a culturally aware baby name expert. Provide a fascinating, concise, and beautifully written explanation of the baby name. Keep it to exactly 3 short, punchy sentences. Cover its origin, its core vibe, and one notable reference. Do not use Markdown formatting, dashes, bullet points, asterisks, or underscores. Just return clean, plain text.",
        },
        {
          role: "user",
          content: `Explain the name: ${name}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const explanation = response.choices[0].message.content?.trim() || "";
    if (!explanation) throw new Error("Failed to generate explanation");

    // 4. Save to the correct table (whichever the name lives in)
    // Try primary table first; if row doesn't exist there, try fallback
    const saveToTable = primaryRow !== null ? resolvedTable : (fallbackRow !== null ? fallbackTable : resolvedTable);
    await supabaseAdmin
      .from(saveToTable)
      .update({ ai_explanation: explanation })
      .eq("id", nameId);

    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error("AI Explain Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate explanation" }, { status: 500 });
  }
}
