import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts, resonances } from "@/db/schema";
import { and, eq, gte, inArray, lt } from "drizzle-orm";
import CalendarGrid from "@/components/CalendarGrid";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function CalendarPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const params = await searchParams;
  const now = new Date();
  const year = parseInt(params.year ?? String(now.getFullYear()));
  const month = parseInt(params.month ?? String(now.getMonth() + 1));

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

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 text-white"
      style={{
        background:
          "linear-gradient(160deg, #0a0e1a 0%, #0d1220 60%, #111827 100%)",
      }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* ナビゲーション */}
        <div className="flex items-center justify-between">
          <Link
            href={`/calendar?year=${prevYear}&month=${prevMonth}`}
            className="text-white/40 hover:text-white/70 transition-colors text-sm px-2 py-1"
          >
            ◀
          </Link>
          <h1
            className="text-sm font-light tracking-widest text-white/60"
            style={{ letterSpacing: "0.25em" }}
          >
            {year}年 {month}月
          </h1>
          <Link
            href={`/calendar?year=${nextYear}&month=${nextMonth}`}
            className="text-white/40 hover:text-white/70 transition-colors text-sm px-2 py-1"
          >
            ▶
          </Link>
        </div>

        <CalendarGrid year={year} month={month} days={days} />

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
