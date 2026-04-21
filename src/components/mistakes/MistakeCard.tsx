// src/components/mistakes/MistakeCard.tsx
"use client";

import { useState } from "react";
import { Star, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import type { Mistake } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { useMistakeStore } from "@/store/useMistakeStore";
import { isDueToday } from "@/lib/srs";
import { MistakeDetailModal } from "./MistakeDetailModal";

interface Props {
  mistake: Mistake;
  onEdit: (m: Mistake) => void;
}

export function MistakeCard({ mistake: m, onEdit }: Props) {
  const { doReview, toggleResolved, toggleImportant } = useMistakeStore();
  const due = isDueToday(m);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        style={{
          background: "var(--bg-card)",
          border: `0.5px solid ${m.isImportant ? "var(--warning)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: m.isResolved ? 0.55 : 1,
          position: "relative",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          transition: "opacity 0.15s",
        }}
      >
        {/* Due badge */}
        {due && !m.isResolved && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: "var(--accent-light)", color: "var(--accent-text)",
            fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
          }}>
            今日
          </span>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: due && !m.isResolved ? 40 : 0 }}>
          <span style={{ fontSize: 11, fontWeight: 500, background: "var(--tag-bg)", color: "var(--tag-text)", padding: "2px 8px", borderRadius: 99 }}>
            {m.subject}
          </span>
          {m.page && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>p.{m.page}</span>}
          {m.question && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Q{m.question}</span>}
          {m.isImportant && <span style={{ fontSize: 12, color: "var(--warning)" }}>★</span>}
        </div>

        {/* Comment */}
        {m.comment && (
          <p style={{
            fontSize: 14, color: "var(--text)", lineHeight: 1.5, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden", wordBreak: "break-all",
          }}>
            {m.comment}
          </p>
        )}

        {/* Tags */}
        {m.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {m.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        )}

        {/* Thumbnail */}
        {m.image && (
          <img src={m.image} alt="問題画像" style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: 120, objectFit: "contain", background: "var(--bg-secondary)" }} />
        )}

        {/* Footer */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6, borderTop: "0.5px solid var(--border)", marginTop: 2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", flex: 1 }}>
            復習 {m.reviewCount}回
            {m.nextReviewDate && !m.isResolved && ` · 次 ${m.nextReviewDate}`}
          </span>

          <ActionBtn onClick={() => toggleImportant(m.id)} active={m.isImportant} activeColor="var(--warning)">
            <Star size={15} fill={m.isImportant ? "currentColor" : "none"} />
          </ActionBtn>

          <ActionBtn onClick={() => toggleResolved(m.id)} active={m.isResolved} activeColor="var(--accent)">
            {m.isResolved ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          </ActionBtn>

          {!m.isResolved && (
            <button
              onClick={() => doReview(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "var(--radius-sm)", padding: "5px 10px",
                fontSize: 12, fontWeight: 500,
              }}
            >
              <RefreshCw size={12} /> 復習
            </button>
          )}
        </div>
      </div>

      {showDetail && (
        <MistakeDetailModal
          mistake={m}
          onClose={() => setShowDetail(false)}
          onEdit={(target) => { setShowDetail(false); onEdit(target); }}
        />
      )}
    </>
  );
}

function ActionBtn({ onClick, children, active, activeColor }: {
  onClick: () => void; children: React.ReactNode; active?: boolean; activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 28, height: 28, background: "none", border: "none",
        borderRadius: "var(--radius-sm)",
        color: active && activeColor ? activeColor : "var(--text-tertiary)", padding: 0,
      }}
    >
      {children}
    </button>
  );
}
