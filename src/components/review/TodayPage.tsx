// src/components/review/TodayPage.tsx
"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, CalendarCheck } from "lucide-react";
import { useMistakeStore } from "@/store/useMistakeStore";
import { Tag } from "@/components/ui/Tag";
import type { Mistake } from "@/types";

export default function TodayPage() {
  const { getDueToday, doReview, toggleResolved } = useMistakeStore();
  const due = getDueToday();
  const total = due.length;
  const done = due.filter((m) => m.isResolved).length;
  const remaining = total - done;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>今日の復習</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
          {remaining > 0
            ? `${remaining}問 残っています`
            : total > 0 ? "今日の復習はすべて完了です 🎉" : ""}
        </p>

        {/* Progress bar */}
        {total > 0 && (
          <div>
            <div
              style={{
                height: 6,
                background: "var(--bg-secondary)",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: progress === 100 ? "var(--accent)" : "var(--info)",
                  borderRadius: 99,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>
              {done} / {total} 完了（{progress}%）
            </p>
          </div>
        )}
      </div>

      {due.length === 0 ? (
        <Empty />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {due.map((m) => (
            <ReviewCard
              key={m.id}
              mistake={m}
              onReview={() => doReview(m.id)}
              onResolve={() => toggleResolved(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  mistake: m,
  onReview,
  onResolve,
}: {
  mistake: Mistake;
  onReview: () => void;
  onResolve: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `0.5px solid ${m.isResolved ? "var(--border)" : "var(--accent)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "14px",
        opacity: m.isResolved ? 0.6 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                background: "var(--tag-bg)",
                color: "var(--tag-text)",
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              {m.subject}
            </span>
            {m.page && (
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>p.{m.page}</span>
            )}
            {m.question && (
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Q{m.question}</span>
            )}
            {m.isImportant && (
              <span style={{ fontSize: 12, color: "var(--warning)" }}>★</span>
            )}
          </div>

          {m.comment && (
            <p
              style={{
                fontSize: 14,
                color: "var(--text)",
                lineHeight: 1.5,
                margin: "0 0 6px",
                display: expanded ? "block" : "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(!expanded)}
            >
              {m.comment}
            </p>
          )}

          {m.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
              {m.tags.map((t) => <Tag key={t} label={t} />)}
            </div>
          )}

          {m.image && expanded && (
            <img
              src={m.image}
              alt="問題画像"
              style={{
                width: "100%",
                borderRadius: "var(--radius-md)",
                maxHeight: 220,
                objectFit: "contain",
                background: "var(--bg-secondary)",
                marginBottom: 8,
              }}
            />
          )}

          <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>
            {m.reviewCount}回目の復習
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {!m.isResolved && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={onReview}
            style={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "10px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <RefreshCw size={15} />
            復習した
          </button>
          <button
            onClick={onResolve}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "10px",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <CheckCircle2 size={14} />
            解決
          </button>
        </div>
      )}

      {m.isResolved && (
        <div
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 12,
            color: "var(--accent-text)",
            fontWeight: 500,
          }}
        >
          ✓ 解決済み
        </div>
      )}
    </div>
  );
}

function Empty() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "var(--text-tertiary)",
      }}
    >
      <CalendarCheck size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
      <p style={{ fontSize: 15, marginBottom: 6 }}>今日復習すべき問題はありません</p>
      <p style={{ fontSize: 13 }}>ミスを記録すると、自動でスケジューリングされます</p>
    </div>
  );
}
