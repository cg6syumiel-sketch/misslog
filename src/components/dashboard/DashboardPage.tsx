// src/components/dashboard/DashboardPage.tsx
"use client";

import { useState } from "react";
import { useMistakeStore } from "@/store/useMistakeStore";
import {
  BookOpen, RefreshCw, CalendarCheck, TrendingUp,
  ArrowUpDown, Trash2, FlaskConical,
} from "lucide-react";
import { ReviewHeatmap } from "./ReviewHeatmap";
import { StreakBadge } from "./StreakBadge";
import { ImportExportModal } from "./ImportExportModal";

export default function DashboardPage() {
  const { getStats, mistakes, seedData, clearAll } = useMistakeStore();
  const stats = getStats();
  const [showIO, setShowIO] = useState(false);

  const subjectEntries = Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1]);
  const maxSubjectCount = Math.max(...subjectEntries.map(([, c]) => c), 1);

  const tagCount: Record<string, number> = {};
  mistakes.filter((m) => !m.isResolved).forEach((m) =>
    m.tags.forEach((t) => { tagCount[t] = (tagCount[t] ?? 0) + 1; })
  );
  const tagEntries = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  const activeCount = mistakes.filter(m => !m.isResolved).length;

  const resolvedCount = mistakes.filter((m) => m.isResolved).length;
  const resolvedRate = mistakes.length > 0 ? Math.round((resolvedCount / mistakes.length) * 100) : 0;

  const handleClear = () => {
    if (confirm("すべてのデータを削除しますか？この操作は取り消せません。")) {
      clearAll();
    }
  };

  return (
    <div style={{ padding: "16px", paddingBottom: 24 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>統計</h1>

      <StreakBadge streak={stats.streak} totalReviews={stats.totalReviews} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <StatCard icon={<BookOpen size={16} />} label="総ミス数" value={stats.total} color="var(--info)" bg="var(--info-bg)" />
        <StatCard icon={<RefreshCw size={16} />} label="未復習" value={stats.unreviewed} color="var(--warning)" bg="var(--warning-bg)" />
        <StatCard icon={<CalendarCheck size={16} />} label="今日やるべき" value={stats.dueToday} color="var(--danger)" bg="var(--danger-bg)" />
        <StatCard icon={<TrendingUp size={16} />} label="解決済み" value={resolvedCount} color="var(--accent)" bg="var(--accent-light)" sub={mistakes.length > 0 ? `${resolvedRate}%` : undefined} />
      </div>

      <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px", marginBottom: 16 }}>
        <ReviewHeatmap heatmap={stats.heatmap} />
      </div>

      {subjectEntries.length > 0 && (
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "var(--text)" }}>教科別ミス数（未解決）</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {subjectEntries.map(([subject, count]) => (
              <div key={subject}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                  <span style={{ color: "var(--text)" }}>{subject}</span>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{count}件</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-secondary)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(count / maxSubjectCount) * 100}%`, background: "var(--accent)", borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tagEntries.length > 0 && (
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "var(--text)" }}>ミスの種類（未解決）</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tagEntries.map(([tag, count]) => {
              const pct = Math.round((count / (activeCount || 1)) * 100);
              return (
                <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "6px 12px", fontSize: 13 }}>
                  <span style={{ color: "var(--text)" }}>{tag}</span>
                  <span style={{ background: "var(--text)", color: "var(--bg)", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 6px" }}>
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mistakes.length > 0 && (
        <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px", color: "var(--text)" }}>最近のミス（直近5件）</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {mistakes.slice(0, 5).map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "8px 0", borderBottom: i < 4 ? "0.5px solid var(--border)" : "none" }}>
                <span style={{ background: "var(--tag-bg)", color: "var(--tag-text)", fontSize: 11, padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {m.subject}
                </span>
                <span style={{ flex: 1, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.comment || (m.question ? `Q${m.question}` : "（コメントなし）")}
                </span>
                <span style={{ color: "var(--text-tertiary)", fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {m.reviewCount}回
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowIO(true)}
        style={{ width: "100%", padding: "12px", background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}
      >
        <ArrowUpDown size={15} />
        データのインポート・エクスポート
      </button>

      <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: "var(--text-secondary)" }}>データ管理</p>
        <button onClick={seedData} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--info-bg)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: 13, color: "var(--info)", fontWeight: 500 }}>
          <FlaskConical size={15} />
          サンプルデータを追加（デモ用）
        </button>
        <button onClick={handleClear} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--danger-bg)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: 13, color: "var(--danger)", fontWeight: 500 }}>
          <Trash2 size={15} />
          全データを削除
        </button>
      </div>

      {showIO && <ImportExportModal onClose={() => setShowIO(false)} />}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg, sub }: {
  icon: React.ReactNode; label: string; value: number; color: string; bg: string; sub?: string;
}) {
  return (
    <div style={{ background: bg, borderRadius: "var(--radius-lg)", padding: "14px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text)", lineHeight: 1 }}>{value}</p>
        {sub && <span style={{ fontSize: 13, color, fontWeight: 600 }}>{sub}</span>}
      </div>
    </div>
  );
}
