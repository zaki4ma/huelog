"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface PostFormProps {
  onPost: (emotion: number, body: string) => Promise<void>;
  isPosting?: boolean;
}

export default function PostForm({ onPost, isPosting = false }: PostFormProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("");

  const emotionColor = useMemo(() => {
    // 0 = 青 (#3b5bdb), 100 = 橙 (#f97316)
    const t = sliderValue / 100;
    const r = Math.round(59 + (249 - 59) * t);
    const g = Math.round(91 + (115 - 91) * t);
    const b = Math.round(219 + (22 - 219) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }, [sliderValue]);

  const sliderBackground = useMemo(() => {
    return `linear-gradient(to right, #3b5bdb 0%, ${emotionColor} ${sliderValue}%, #444 ${sliderValue}%, #333 100%)`;
  }, [sliderValue, emotionColor]);

  const canPost = text.trim().length > 0 && !isPosting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center gap-10 px-6 w-full max-w-sm"
    >
      {/* タイトル */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-2xl font-light tracking-widest text-white/70"
        style={{ letterSpacing: "0.25em" }}
      >
        Hue Log
      </motion.h1>

      {/* 感情スライダー */}
      <div className="w-full flex flex-col gap-4">
        {/* 色の表示 */}
        <motion.div
          className="mx-auto w-16 h-16 rounded-full"
          animate={{ backgroundColor: emotionColor }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 30px ${emotionColor}88, 0 0 60px ${emotionColor}44`,
          }}
        />

        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-blue-400 opacity-70">静</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="flex-1"
            style={{ background: sliderBackground }}
          />
          <span className="text-xs text-orange-400 opacity-70">熱</span>
        </div>
      </div>

      {/* テキストエリア + 文字数カウント */}
      <div className="w-full flex flex-col gap-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={40}
          rows={2}
          placeholder="今の気持ちをひと息で..."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 placeholder-white/25 outline-none focus:border-white/20 focus:bg-white/8 transition-all duration-1000"
          style={{ lineHeight: "1.8" }}
        />
        <p className="text-right text-xs pr-1" style={{ color: text.length >= 40 ? "rgba(249,115,22,0.7)" : "rgba(255,255,255,0.2)" }}>
          {text.length} / 40
        </p>
      </div>

      {/* 灯すボタン */}
      <motion.button
        onClick={canPost ? () => onPost(sliderValue, text) : undefined}
        disabled={!canPost}
        whileHover={canPost ? { scale: 1.04 } : {}}
        whileTap={canPost ? { scale: 0.97 } : {}}
        transition={{ duration: 0.4 }}
        className="px-10 py-3 rounded-full text-sm tracking-widest transition-all duration-1000 disabled:opacity-30"
        style={{
          background: canPost
            ? `linear-gradient(135deg, ${emotionColor}66, ${emotionColor}22)`
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${canPost ? emotionColor + "88" : "rgba(255,255,255,0.1)"}`,
          color: canPost ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
          boxShadow: canPost ? `0 0 20px ${emotionColor}33` : "none",
          letterSpacing: "0.2em",
        }}
      >
        {isPosting ? "灯している..." : "灯す"}
      </motion.button>
    </motion.div>
  );
}
