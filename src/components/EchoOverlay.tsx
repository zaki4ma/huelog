"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface EchoOverlayProps {
  echoText: string;
  postId: string | null;
  isPreset: boolean;
  onReturn: () => void;
}

export default function EchoOverlay({
  echoText,
  postId,
  isPreset,
  onReturn,
}: EchoOverlayProps) {
  const [showEcho, setShowEcho] = useState(true);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowEcho(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleResonate = async () => {
    if (lit) return;
    setLit(true); // 楽観的UI: APIを待たずアニメーション発火

    if (postId) {
      await fetch("/api/resonances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative z-10 flex flex-col items-center justify-center gap-16 px-6 w-full max-w-sm text-center"
    >
      {/* 残響テキスト */}
      <AnimatePresence>
        {showEcho && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-6"
          >
            <p
              className="text-xs tracking-widest text-white/30"
              style={{ letterSpacing: "0.3em" }}
            >
              — {isPreset ? "運営からのひと言" : "誰かの残響"} —
            </p>
            <p
              className="text-xl font-light text-white/80 leading-relaxed"
              style={{ letterSpacing: "0.05em" }}
            >
              {echoText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 波紋エフェクト + 灯をともすボタン */}
      <div className="relative flex items-center justify-center">
        {lit && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-amber-400/30"
                initial={{ width: 60, height: 60, opacity: 0.6 }}
                animate={{ width: 160, height: 160, opacity: 0 }}
                transition={{ duration: 1.8, delay: i * 0.4, ease: "easeOut" }}
              />
            ))}
          </>
        )}

        <motion.button
          onClick={handleResonate}
          disabled={lit}
          whileHover={!lit ? { scale: 1.05 } : {}}
          whileTap={!lit ? { scale: 0.96 } : {}}
          transition={{ duration: 0.4 }}
          className="relative px-8 py-3 rounded-full text-sm tracking-widest transition-all duration-1000"
          style={{
            background: lit
              ? "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))"
              : "rgba(255,255,255,0.05)",
            border: lit
              ? "1px solid rgba(251,191,36,0.5)"
              : "1px solid rgba(255,255,255,0.1)",
            color: lit ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.5)",
            boxShadow: lit ? "0 0 24px rgba(251,191,36,0.25)" : "none",
            letterSpacing: "0.2em",
          }}
          aria-label="灯をともす"
        >
          {lit ? "灯がともった" : "灯をともす"}
        </motion.button>
      </div>

      {/* 戻るリンク + カレンダーリンク */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          onClick={onReturn}
          className="text-xs text-white/20 hover:text-white/40 transition-colors duration-700 tracking-widest"
          style={{ letterSpacing: "0.2em" }}
        >
          もどる
        </button>
        <div className="flex gap-5">
          <Link
            href="/calendar"
            className="text-xs text-white/15 hover:text-white/35 transition-colors duration-700 tracking-widest"
            style={{ letterSpacing: "0.15em" }}
          >
            カレンダー
          </Link>
          <Link
            href="/posts"
            className="text-xs text-white/15 hover:text-white/35 transition-colors duration-700 tracking-widest"
            style={{ letterSpacing: "0.15em" }}
          >
            灯の記録
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
