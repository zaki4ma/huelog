import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth) {
    if (pathname.startsWith("/calendar") || pathname.startsWith("/posts")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    if (
      pathname.startsWith("/api/posts") ||
      pathname.startsWith("/api/resonances")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
});

export const config = {
  matcher: ["/api/posts/:path*", "/api/resonances/:path*", "/calendar/:path*", "/posts/:path*"],
};
