// src/components/settings/SettingsModal.tsx
"use client";

import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { useMistakeStore } from "@/store/useMistakeStore";
import { DEFAULT_SRS_SETTINGS } from "@/types";

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const { srsSettings, setSRSSettings } = useMistakeStore();
  const [intervals, setIntervals] = useState<[number, number, number, number]>([...srsSettings.intervals]);
  const [notifyOnOpen, setNotifyOnOpen] = useState(srsSettings.notifyOnOpen);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Validate: each must be >= 1
    if (intervals.some((v) => v < 1 || isNaN(v))) {
      alert("日数は1以上の数値を入力してください");
      return;
    }
    setSRSSettings({ intervals, notifyOnOpen });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleReset = () => {
    setIntervals([...DEFAULT_SRS_SETTINGS.intervals]);
    setNotifyOnOpen(DEFAULT_SRS_SETTINGS.notifyOnOpen);
  };

  const labels = ["1回目の復習後", "2回目の復習後", "3回目の復習後", "4回目以降"];

  const inputStyle = {
    width: 64,
    padding: "8px 10px",
    background: "var(--bg-secondary)",
    border: "0.5px solid var(--border)",
    borderRadius: "var(--radius-md)",
    fontSize: 15,
    color: "var(--text)",
    outline: "none",
    textAlign: "center" as const,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--bg-card)", borderRadius: "20px 20px 0 0",
          padding: "20px 16px 48px", display: "flex", flexDirection: "column", gap: 16,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)" }}>設定</h2>
          <button
            onClick={onClose}
            style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 99, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* SRS Intervals */}
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px" }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: "var(--text)" }}>復習タイミング</p>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 14px" }}>「復習した」を押した後、次回の復習までの日数</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {labels.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    style={inputStyle}
                    value={intervals[i]}
                    onChange={(e) => {
                      const next = [...intervals] as [number, number, number, number];
                      next[i] = parseInt(e.target.value) || 1;
                      setIntervals(next);
                    }}
                  />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>日後</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification */}
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px" }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: "var(--text)" }}>アプリ内通知</p>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 12px" }}>アプリを開いたとき、今日の復習がある場合にバナーを表示する</p>
          <button
            onClick={() => setNotifyOnOpen(!notifyOnOpen)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", padding: 0, cursor: "pointer",
            }}
          >
            <div style={{
              width: 44, height: 26, borderRadius: 99,
              background: notifyOnOpen ? "var(--accent)" : "var(--border-strong)",
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", top: 3, left: notifyOnOpen ? 21 : 3,
                width: 20, height: 20, borderRadius: 99, background: "#fff",
                transition: "left 0.2s",
              }} />
            </div>
            <span style={{ fontSize: 13, color: "var(--text)", fontWeight: notifyOnOpen ? 500 : 400 }}>
              {notifyOnOpen ? "オン" : "オフ"}
            </span>
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "11px 14px", background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)", borderRadius: "var(--radius-md)",
              fontSize: 13, color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={13} /> リセット
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: "11px",
              background: saved ? "var(--accent-light)" : "var(--accent)",
              color: saved ? "var(--accent-text)" : "#fff",
              border: "none", borderRadius: "var(--radius-md)",
              fontSize: 14, fontWeight: 600, transition: "background 0.2s",
            }}
          >
            {saved ? "保存しました ✓" : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
