// src/components/dashboard/StreakBadge.tsx
"use client";

interface Props {
  streak: number;
  totalReviews: number;
}

export function StreakBadge({ streak, totalReviews }: Props) {
  const getMessage = () => {
    if (streak === 0) return "今日から始めましょう！";
    if (streak < 3) return "いい調子です！";
    if (streak < 7) return "習慣になってきました！";
    if (streak < 14) return "すごい継続力！";
    if (streak < 30) return "圧倒的成長中 🔥";
    return "レジェンド級の継続力！🏆";
  };

  const getFlame = () => {
    if (streak === 0) return "○";
    if (streak < 3) return "🔥";
    if (streak < 7) return "🔥🔥";
    return "🔥🔥🔥";
  };

  return (
    <div
      style={{
        background: streak > 0 ? "linear-gradient(135deg, #fef3c7, #fde68a)" : "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: streak > 0 ? "0.5px solid #f59e0b" : "0.5px solid var(--border)",
        marginBottom: 16,
      }}
    >
      <div style={{ textAlign: "center", minWidth: 56 }}>
        <div style={{ fontSize: 28, lineHeight: 1 }}>{getFlame()}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: streak > 0 ? "#92400e" : "var(--text)", lineHeight: 1.2 }}>
          {streak}
        </div>
        <div style={{ fontSize: 10, color: streak > 0 ? "#b45309" : "var(--text-tertiary)", fontWeight: 500 }}>
          日連続
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 2px", color: streak > 0 ? "#78350f" : "var(--text)" }}>
          {getMessage()}
        </p>
        <p style={{ fontSize: 12, color: streak > 0 ? "#92400e" : "var(--text-secondary)", margin: 0 }}>
          累計復習回数: <strong>{totalReviews}</strong>回
        </p>
      </div>
    </div>
  );
}
