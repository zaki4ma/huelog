import { db } from "./index";
import { posts } from "./schema";
import { and, asc, desc, eq, sql } from "drizzle-orm";

/**
 * 波長マッチング: ±10ポイント範囲から他ユーザーの投稿を1件取得。
 * マッチしない場合はプリセット投稿からランダム取得。
 */
export async function findEcho(userId: string, emotion: number) {
  const matched = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isPreset, false),
        sql`${posts.userId} != ${userId}`,
        sql`ABS(${posts.emotion} - ${emotion}) <= 10`
      )
    )
    .orderBy(
      asc(sql`ABS(${posts.emotion} - ${emotion})`),
      desc(posts.createdAt)
    )
    .limit(1);

  if (matched.length > 0) return matched[0];

  const presets = await db
    .select()
    .from(posts)
    .where(eq(posts.isPreset, true))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return presets[0] ?? null;
}
