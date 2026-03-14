import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts, resonances, notifications } from "@/db/schema";
import { eq, desc, inArray, isNull, and } from "drizzle-orm";
import Link from "next/link";
import NotificationReader from "@/components/NotificationReader";

function emotionToColor(emotion: number): string {
  const t = emotion / 100;
  const r = Math.round(59 + (249 - 59) * t);
  const g = Math.round(91 + (115 - 91) * t);
  const b = Math.round(219 + (22 - 219) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // 通知（未読のみ先に取得、その後全件）
  const notifRows = await db
    .select({
      id: notifications.id,
      postId: notifications.postId,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(20);

  // 通知に紐づく投稿を取得
  const notifPostIds = [...new Set(notifRows.map((n) => n.postId))];
  const notifPostMap = new Map<string, { body: string; emotion: number }>();
  if (notifPostIds.length > 0) {
    const notifPosts = await db
      .select({ id: posts.id, body: posts.body, emotion: posts.emotion })
      .from(posts)
      .where(inArray(posts.id, notifPostIds));
    notifPosts.forEach((p) => notifPostMap.set(p.id, { body: p.body, emotion: p.emotion }));
  }

  const unreadCount = notifRows.filter((n) => n.readAt === null).length;

  // 自分の投稿
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
      {/* ページ表示時に通知を既読にする */}
      <NotificationReader />

      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* 共鳴の通知 */}
        {notifRows.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2
              className="text-xs font-light tracking-widest text-white/40 flex items-center gap-2"
              style={{ letterSpacing: "0.2em" }}
            >
              共鳴の通知
              {unreadCount > 0 && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-normal"
                  style={{
                    background: "rgba(251,191,36,0.25)",
                    color: "rgba(251,191,36,0.9)",
                    border: "1px solid rgba(251,191,36,0.4)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </h2>
            <ul className="flex flex-col gap-2">
              {notifRows.map((notif) => {
                const post = notifPostMap.get(notif.postId);
                const isUnread = notif.readAt === null;
                const color = post ? emotionToColor(post.emotion) : "rgb(255,255,255)";
                return (
                  <li
                    key={notif.id}
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: isUnread ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.03)",
                      border: isUnread
                        ? "1px solid rgba(251,191,36,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="mt-1 w-2 h-2 rounded-full shrink-0"
                      style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-xs text-white/60 leading-relaxed">
                        <span className="text-white/40">「</span>
                        <span className="text-white/70">{post?.body ?? "..."}</span>
                        <span className="text-white/40">」</span>
                        <span className="text-white/40">に灯がともりました</span>
                      </p>
                      <span className="text-[10px] text-white/20">
                        {formatDate(new Date(notif.createdAt))}
                      </span>
                    </div>
                    {isUnread && (
                      <div
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "rgba(251,191,36,0.7)" }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* 灯の記録 */}
        <section className="flex flex-col gap-3">
          <h1
            className="text-xs font-light tracking-widest text-white/40 text-center"
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
                return (
                  <li
                    key={post.id}
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: `${color}11`,
                      border: `1px solid ${color}33`,
                    }}
                  >
                    <div
                      className="mt-1 w-3 h-3 rounded-full shrink-0"
                      style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-sm text-white/80 leading-relaxed break-all">
                        {post.body}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/25">
                          {formatDate(new Date(post.createdAt))}
                        </span>
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
        </section>

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
