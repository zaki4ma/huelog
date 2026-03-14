import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Edge Runtime対応: DrizzleAdapterを含まない軽量configを使用
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth) {
    if (pathname.startsWith("/calendar") || pathname.startsWith("/posts")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (
      pathname.startsWith("/api/posts") ||
      pathname.startsWith("/api/resonances") ||
      pathname.startsWith("/api/notifications")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
});

export const config = {
  matcher: ["/api/posts/:path*", "/api/resonances/:path*", "/api/notifications/:path*", "/calendar/:path*", "/posts/:path*"],
};
