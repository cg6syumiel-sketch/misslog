// src/components/ui/Tag.tsx
"use client";

import type { MistakeTag } from "@/types";

const tagColors: Record<string, { bg: string; text: string }> = {
  計算ミス: { bg: "#dbeafe", text: "#1e40af" },
  理解不足: { bg: "#fee2e2", text: "#991b1b" },
  ケアレスミス: { bg: "#fef3c7", text: "#92400e" },
  暗記不足: { bg: "#ede9fe", text: "#5b21b6" },
  時間切れ: { bg: "#fce7f3", text: "#9d174d" },
  その他: { bg: "#f0ede6", text: "#4a4845" },
};

export function Tag({ label }: { label: MistakeTag | string }) {
  const colors = tagColors[label] ?? tagColors["その他"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: colors.bg,
        color: colors.text,
        fontSize: 11,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: 99,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
