"use client";

import { useEffect } from "react";

// ページ表示時に通知を既読にするClient Component
export default function NotificationReader() {
  useEffect(() => {
    fetch("/api/notifications", { method: "PATCH" });
  }, []);

  return null;
}
