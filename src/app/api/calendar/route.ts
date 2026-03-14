import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts, resonances } from "@/db/schema";
import { and, eq, gte, inArray, lt } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const year = parseInt(
    searchParams.get("year") ?? String(new Date().getFullYear())
  );
  const month = parseInt(
    searchParams.get("month") ?? String(new Date().getMonth() + 1)
  );

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);

  const userPosts = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.userId, session.user.id),
        gte(posts.createdAt, from),
        lt(posts.createdAt, to)
      )
    );

  const postIds = userPosts.map((p) => p.id);
  const resonatedPostIds = new Set<string>();

  if (postIds.length > 0) {
    const res = await db
      .select({ postId: resonances.postId })
      .from(resonances)
      .where(inArray(resonances.postId, postIds));
    res.forEach((r) => resonatedPostIds.add(r.postId));
  }

  const dayMap = new Map<number, { emotion: number; hasResonance: boolean }>();
  for (const post of userPosts) {
    const day = post.createdAt.getDate();
    if (!dayMap.has(day)) {
      dayMap.set(day, {
        emotion: post.emotion,
        hasResonance: resonatedPostIds.has(post.id),
      });
    }
  }

  const days = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    emotion: data.emotion,
    hasResonance: data.hasResonance,
  }));

  return NextResponse.json({ year, month, days });
}
