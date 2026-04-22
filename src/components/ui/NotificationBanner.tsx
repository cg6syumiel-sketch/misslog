// src/components/ui/NotificationBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { X, CalendarCheck } from "lucide-react";
import { useMistakeStore } from "@/store/useMistakeStore";

export function NotificationBanner() {
  const { getDueToday, srsSettings } = useMistakeStore();
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!srsSettings.notifyOnOpen) return;
    const due = getDueToday();
    if (due.length > 0) {
      setCount(due.length);
      setVisible(true);
      // 自動で8秒後に消える
      const timer = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", top: 12, left: 12, right: 12, zIndex: 500,
        background: "var(--accent)", borderRadius: "var(--radius-lg)",
        padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "slideDown 0.3s ease",
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <CalendarCheck size={18} style={{ color: "#fff", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>
          今日の復習が{count}問あります
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "2px 0 0" }}>
          「今日の復習」タブで確認しましょう
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 99,
          width: 24, height: 24, display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff", flexShrink: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
