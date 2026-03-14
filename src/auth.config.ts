import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge Runtime対応の軽量config（DBインポートなし）
export const authConfig = {
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
} satisfies NextAuthConfig;
