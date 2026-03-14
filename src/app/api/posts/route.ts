import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { findEcho } from "@/db/queries";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emotion, body } = await req.json();

  if (typeof emotion !== "number" || emotion < 0 || emotion > 100) {
    return NextResponse.json({ error: "Invalid emotion" }, { status: 400 });
  }
  if (
    typeof body !== "string" ||
    body.trim().length === 0 ||
    body.length > 40
  ) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const [post] = await db
    .insert(posts)
    .values({
      userId: session.user.id,
      emotion,
      body: body.trim(),
    })
    .returning();

  const echo = await findEcho(session.user.id, emotion);

  return NextResponse.json({ post, echo });
}
