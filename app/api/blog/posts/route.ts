/**
 * app/api/blog/posts/route.ts
 * GET /api/blog/posts — paginated list of published blog posts
 * Query params: page, limit, topic
 */

import { NextRequest, NextResponse } from "next/server";
import { listPosts } from "@/lib/blog";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const topic = searchParams.get("topic") || undefined;

    const result = await listPosts({ page, limit, topic });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[Blog] GET /posts error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
