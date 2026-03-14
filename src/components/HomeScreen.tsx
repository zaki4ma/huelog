"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center gap-12 px-6 w-full max-w-sm text-center"
    >
      {/* タイトル */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <h1
          className="text-3xl font-light tracking-widest text-white/80"
          style={{ letterSpacing: "0.3em" }}
        >
          Hue Log
        </h1>
        <p className="text-sm font-light text-white/35 leading-loose" style={{ letterSpacing: "0.1em" }}>
          今の気持ちを色で灯し、
          <br />
          誰かと一瞬だけ共鳴する場所。
        </p>
      </motion.div>

      {/* 説明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex flex-col gap-3 text-xs text-white/25 leading-loose"
        style={{ letterSpacing: "0.05em" }}
      >
        <p>スライダーで今の感情を色に変えて</p>
        <p>ひと言を灯すと、波長の合う誰かの</p>
        <p>残響が静かに浮かび上がります。</p>
      </motion.div>

      {/* ボタン群 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        {/* はじめるボタン */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-12 py-3 rounded-full text-sm tracking-widest text-white/70 w-56"
          style={{
            background: "linear-gradient(135deg, rgba(59,91,219,0.2), rgba(249,115,22,0.2))",
            border: "1px solid rgba(255,255,255,0.15)",
            letterSpacing: "0.25em",
          }}
        >
          はじめる
        </motion.button>

        {/* Googleでログインボタン */}
        <motion.button
          onClick={() => signIn("google", { callbackUrl: "/?posting=1" })}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs text-white/40 w-56 transition-colors hover:text-white/60"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.3)"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.3)"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="rgba(255,255,255,0.3)"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.3)"/>
          </svg>
          Googleでログイン
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
