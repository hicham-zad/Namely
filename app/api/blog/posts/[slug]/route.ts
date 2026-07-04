/**
 * app/api/blog/posts/[slug]/route.ts
 * GET /api/blog/posts/:slug — single post with full HTML content
 */

import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error("[Blog] GET /posts/:slug error:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
