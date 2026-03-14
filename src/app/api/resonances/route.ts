import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts, resonances, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const [resonance] = await db
      .insert(resonances)
      .values({ postId, userId: session.user.id })
      .returning();

    // プリセット投稿への共鳴は通知を作らない
    if (!post.isPreset && post.userId) {
      await db.insert(notifications).values({
        userId: post.userId,
        postId,
        resonanceId: resonance.id,
      });
    }

    return NextResponse.json({ resonance });
  } catch (err: unknown) {
    // UNIQUE制約違反（二重押し）→ 409
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return NextResponse.json({ error: "Already resonated" }, { status: 409 });
    }
    throw err;
  }
}
