"use client";

import { motion } from "framer-motion";

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

      {/* はじめるボタン */}
      <motion.button
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="px-12 py-3 rounded-full text-sm tracking-widest text-white/70"
        style={{
          background: "linear-gradient(135deg, rgba(59,91,219,0.2), rgba(249,115,22,0.2))",
          border: "1px solid rgba(255,255,255,0.15)",
          letterSpacing: "0.25em",
        }}
      >
        はじめる
      </motion.button>
    </motion.div>
  );
}
