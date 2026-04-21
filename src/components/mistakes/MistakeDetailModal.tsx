// src/components/mistakes/MistakeDetailModal.tsx
"use client";

import { useState } from "react";
import { X, RefreshCw, Star, CheckCircle2, Circle, Edit2, History } from "lucide-react";
import type { Mistake } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { useMistakeStore } from "@/store/useMistakeStore";
import { isDueToday } from "@/lib/srs";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

interface Props {
  mistake: Mistake;
  onClose: () => void;
  onEdit: (m: Mistake) => void;
}

export function MistakeDetailModal({ mistake: m, onClose, onEdit }: Props) {
  const { doReview, toggleResolved, toggleImportant } = useMistakeStore();
  const due = isDueToday(m);
  const [reviewDone, setReviewDone] = useState(false);

  const handleReview = () => {
    doReview(m.id);
    setReviewDone(true);
  };

  const srsLabel = (count: number) => {
    const map: Record<number, string> = { 0: "未復習", 1: "翌日", 2: "3日後", 3: "7日後" };
    return count < 4 ? map[count] : "14日後";
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 250, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--bg-card)", borderRadius: "20px 20px 0 0",
          padding: "20px 16px 40px", maxHeight: "88vh", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 14,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 500, background: "var(--tag-bg)", color: "var(--tag-text)", padding: "2px 8px", borderRadius: 99 }}>
                {m.subject}
              </span>
              {m.page && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>p.{m.page}</span>}
              {m.question && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Q{m.question}</span>}
              {due && !m.isResolved && (
                <span style={{ fontSize: 10, fontWeight: 600, background: "var(--accent-light)", color: "var(--accent-text)", padding: "2px 7px", borderRadius: 99 }}>
                  今日
                </span>
              )}
            </div>
            {m.isImportant && (
              <p style={{ fontSize: 12, color: "var(--warning)", margin: 0, fontWeight: 600 }}>★ 重要</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <IconBtn onClick={() => { onEdit(m); onClose(); }} title="編集"><Edit2 size={15} /></IconBtn>
            <IconBtn onClick={onClose} title="閉じる"><X size={15} /></IconBtn>
          </div>
        </div>

        {/* Comment */}
        {m.comment && (
          <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
            <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {m.comment}
            </p>
          </div>
        )}

        {/* Tags */}
        {m.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        )}

        {/* Image */}
        {m.image && (
          <img
            src={m.image} alt="問題画像"
            style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: 260, objectFit: "contain", background: "var(--bg-secondary)" }}
          />
        )}

        {/* SRS Info */}
        <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 8px" }}>復習情報</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <InfoRow label="復習回数" value={`${m.reviewCount}回`} />
            <InfoRow label="SRSステージ" value={srsLabel(m.reviewCount)} />
            <InfoRow label="最終復習日" value={m.lastReviewedAt ?? "未復習"} />
            <InfoRow label="次回復習日" value={m.nextReviewDate ?? "—"} />
            <InfoRow label="登録日" value={format(parseISO(m.createdAt), "yyyy/M/d")} />
            <InfoRow label="ステータス" value={m.isResolved ? "✓ 解決済み" : "未解決"} />
          </div>
        </div>

        {/* Review History */}
        {(m.reviewHistory?.length ?? 0) > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <History size={14} style={{ color: "var(--text-tertiary)" }} />
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>復習履歴</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {(m.reviewHistory ?? []).slice().reverse().map((d, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11, background: "var(--accent-light)", color: "var(--accent-text)",
                    padding: "3px 8px", borderRadius: 99, fontWeight: 500,
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "0.5px solid var(--border)" }}>
          <button
            onClick={() => toggleImportant(m.id)}
            style={{
              width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
              background: m.isImportant ? "var(--warning-bg)" : "var(--bg-secondary)",
              border: `0.5px solid ${m.isImportant ? "var(--warning)" : "var(--border)"}`,
              borderRadius: "var(--radius-md)", color: m.isImportant ? "var(--warning)" : "var(--text-tertiary)",
            }}
          >
            <Star size={17} fill={m.isImportant ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => toggleResolved(m.id)}
            style={{
              width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
              background: m.isResolved ? "var(--accent-light)" : "var(--bg-secondary)",
              border: `0.5px solid ${m.isResolved ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "var(--radius-md)", color: m.isResolved ? "var(--accent-text)" : "var(--text-tertiary)",
            }}
          >
            {m.isResolved ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          </button>
          {!m.isResolved && (
            <button
              onClick={handleReview}
              disabled={reviewDone}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: reviewDone ? "var(--bg-secondary)" : "var(--accent)",
                color: reviewDone ? "var(--text-tertiary)" : "#fff",
                border: "none", borderRadius: "var(--radius-md)", padding: "0 16px",
                fontSize: 14, fontWeight: 600, height: 42,
              }}
            >
              <RefreshCw size={15} />
              {reviewDone ? "復習済み ✓" : "復習した"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--text-tertiary)", margin: "0 0 2px", fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 13, color: "var(--text)", margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function IconBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick} title={title}
      style={{
        width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-secondary)", border: "none", borderRadius: "var(--radius-sm)",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
