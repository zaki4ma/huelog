import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts, resonances } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import Link from "next/link";

function emotionToColor(emotion: number): string {
  const t = emotion / 100;
  const r = Math.round(59 + (249 - 59) * t);
  const g = Math.round(91 + (115 - 91) * t);
  const b = Math.round(219 + (22 - 219) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, session.user.id))
    .orderBy(desc(posts.createdAt));

  const postIds = userPosts.map((p) => p.id);
  const resonanceCounts = new Map<string, number>();

  if (postIds.length > 0) {
    const res = await db
      .select({ postId: resonances.postId })
      .from(resonances)
      .where(inArray(resonances.postId, postIds));
    res.forEach((r) => {
      resonanceCounts.set(r.postId, (resonanceCounts.get(r.postId) ?? 0) + 1);
    });
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-12 text-white"
      style={{
        background:
          "linear-gradient(160deg, #0a0e1a 0%, #0d1220 60%, #111827 100%)",
      }}
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        <h1
          className="text-sm font-light tracking-widest text-white/50 text-center"
          style={{ letterSpacing: "0.25em" }}
        >
          灯の記録
        </h1>

        {userPosts.length === 0 ? (
          <p className="text-center text-white/25 text-sm">まだ記録がありません</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {userPosts.map((post) => {
              const color = emotionToColor(post.emotion);
              const count = resonanceCounts.get(post.id) ?? 0;
              const date = new Date(post.createdAt);
              const label = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

              return (
                <li
                  key={post.id}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: `${color}11`,
                    border: `1px solid ${color}33`,
                  }}
                >
                  {/* 感情色ドット */}
                  <div
                    className="mt-1 w-3 h-3 rounded-full shrink-0"
                    style={{
                      background: color,
                      boxShadow: `0 0 8px ${color}88`,
                    }}
                  />

                  {/* テキスト + メタ */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-sm text-white/80 leading-relaxed break-all">
                      {post.body}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/25">{label}</span>
                      {count > 0 && (
                        <span className="text-xs text-amber-400/60">
                          灯 {count}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/"
          className="text-xs text-white/20 hover:text-white/40 transition-colors text-center tracking-widest"
          style={{ letterSpacing: "0.2em" }}
        >
          もどる
        </Link>
      </div>
    </main>
  );
}
