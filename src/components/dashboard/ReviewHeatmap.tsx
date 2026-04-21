// src/components/dashboard/ReviewHeatmap.tsx
"use client";

import { format, subDays, startOfWeek, addDays, eachWeekOfInterval } from "date-fns";
import { ja } from "date-fns/locale";

interface Props {
  heatmap: Record<string, number>;
}

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
const WEEKS = 13; // 13 weeks = ~90 days

function getColor(count: number): string {
  if (count === 0) return "var(--bg-secondary)";
  if (count === 1) return "#86efac"; // green-300
  if (count <= 3) return "#4ade80"; // green-400
  if (count <= 6) return "#22c55e"; // green-500
  return "#15803d";                  // green-700
}

export function ReviewHeatmap({ heatmap }: Props) {
  const today = new Date();
  const start = subDays(today, WEEKS * 7 - 1);

  // Build grid: array of weeks, each week = 7 days (Sun→Sat)
  const weeks: { date: Date; dateStr: string; count: number }[][] = [];
  let weekStart = startOfWeek(start, { weekStartsOn: 0 });

  for (let w = 0; w < WEEKS; w++) {
    const week: { date: Date; dateStr: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(weekStart, d);
      const dateStr = format(date, "yyyy-MM-dd");
      const isFuture = date > today;
      week.push({ date, dateStr, count: isFuture ? -1 : (heatmap[dateStr] ?? 0) });
    }
    weeks.push(week);
    weekStart = addDays(weekStart, 7);
  }

  // Month labels: find weeks where month changes
  const monthLabels: { weekIdx: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, idx) => {
    const month = week[0].date.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ weekIdx: idx, label: format(week[0].date, "M月") });
      lastMonth = month;
    }
  });

  const totalReviews = Object.values(heatmap).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(heatmap).filter((v) => v > 0).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "var(--text)" }}>
          復習ヒートマップ（90日）
        </p>
        <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>
          {activeDays}日間 · 計{totalReviews}回
        </p>
      </div>

      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: WEEKS * 14 + 24, paddingBottom: 4 }}>
          {/* Month labels */}
          <div style={{ display: "flex", marginLeft: 24, marginBottom: 2, position: "relative", height: 14 }}>
            {monthLabels.map(({ weekIdx, label }) => (
              <span
                key={weekIdx}
                style={{
                  position: "absolute",
                  left: weekIdx * 14,
                  fontSize: 10,
                  color: "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: 0 }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginRight: 4 }}>
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  style={{
                    width: 20,
                    height: 11,
                    fontSize: 9,
                    color: i % 2 === 0 ? "var(--text-tertiary)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    userSelect: "none",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {week.map(({ dateStr, count }, di) => (
                  <div
                    key={di}
                    title={count >= 0 ? `${dateStr}: ${count}回` : ""}
                    style={{
                      width: 11,
                      height: 11,
                      marginRight: 2,
                      borderRadius: 2,
                      background: count < 0 ? "transparent" : getColor(count),
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              marginLeft: 24,
            }}
          >
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>少</span>
            {[0, 1, 3, 5, 7].map((v) => (
              <div
                key={v}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: getColor(v),
                }}
              />
            ))}
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>多</span>
          </div>
        </div>
      </div>
    </div>
  );
}
