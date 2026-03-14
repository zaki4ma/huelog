"use client";

import { useState, useCallback, useEffect } from "react";
import { signIn } from "next-auth/react";
import HomeScreen from "@/components/HomeScreen";
import PostForm from "@/components/PostForm";
import EchoOverlay from "@/components/EchoOverlay";

type Phase = "home" | "post" | "echo";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("home");
  const [echoText, setEchoText] = useState("");
  const [echoPostId, setEchoPostId] = useState<string | null>(null);
  const [echoIsPreset, setEchoIsPreset] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // ログイン後リダイレクト時に投稿フォームへ自動遷移
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("posting") === "1") {
      setPhase("post");
      // URLパラメータを消す
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // 「はじめる」ボタン: セッション確認 → ログイン済みなら投稿フォームへ
  const handleStart = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    if (session?.user) {
      setPhase("post");
    } else {
      signIn("google", { callbackUrl: "/?posting=1" });
    }
  }, []);

  const handlePost = useCallback(async (emotion: number, body: string) => {
    setIsPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, body }),
      });

      if (res.status === 401) {
        signIn("google", { callbackUrl: "/?posting=1" });
        return;
      }

      if (!res.ok) {
        console.error("Post failed:", await res.text());
        return;
      }

      const data = await res.json();
      const echo = data.echo;

      setEchoText(echo?.body ?? "...");
      setEchoPostId(echo?.id ?? null);
      setEchoIsPreset(echo?.isPreset ?? false);
      setPhase("echo");
    } finally {
      setIsPosting(false);
    }
  }, []);

  const handleReturn = useCallback(() => {
    setPhase("home");
  }, []);

  return (
    <main
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0a0e1a 0%, #0d1220 60%, #111827 100%)",
      }}
    >
      {/* 背景の光の滲み */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #3b5bdb 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {phase === "home" && <HomeScreen onStart={handleStart} />}
      {phase === "post" && (
        <PostForm onPost={handlePost} isPosting={isPosting} />
      )}
      {phase === "echo" && (
        <EchoOverlay
          echoText={echoText}
          postId={echoPostId}
          isPreset={echoIsPreset}
          onReturn={handleReturn}
        />
      )}
    </main>
  );
}
