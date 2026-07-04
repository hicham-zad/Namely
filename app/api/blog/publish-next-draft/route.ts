/**
 * app/api/blog/publish-next-draft/route.ts
 * POST /api/blog/publish-next-draft
 *
 * Called daily by cron-job.org to publish the oldest draft post.
 * Protected by x-blog-admin-secret header.
 *
 * cron-job.org setup:
 *   URL:     https://matchbabynames.com/api/blog/publish-next-draft
 *   Method:  POST
 *   Header:  x-blog-admin-secret: <BLOG_ADMIN_SECRET>
 *   Schedule: Every day at 09:00 UTC
 */

import { NextRequest, NextResponse } from "next/server";
import { publishNextDraft } from "@/lib/blog";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Verify admin secret
  const secret = req.headers.get("x-blog-admin-secret");
  if (!secret || secret !== process.env.BLOG_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await publishNextDraft();
    console.log("[AutoPublish]", result.message, result.slug || "");
    return NextResponse.json(result);
  } catch (err) {
    console.error("[Blog] publish-next-draft error:", err);
    return NextResponse.json(
      { error: "Failed to auto-publish", message: String(err) },
      { status: 500 }
    );
  }
}
