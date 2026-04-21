// src/components/mistakes/ListPage.tsx
"use client";

import { useState } from "react";
import { Plus, Search, SlidersHorizontal, Download, X } from "lucide-react";
import { useMistakeStore } from "@/store/useMistakeStore";
import { MistakeCard } from "./MistakeCard";
import { MistakeForm } from "./MistakeForm";
import { Tag } from "@/components/ui/Tag";
import type { Mistake, MistakeTag, SortKey } from "@/types";
import { DEFAULT_TAGS } from "@/types";
import { exportToCSV } from "@/lib/csv";

export default function ListPage() {
  const { getFiltered, filter, setFilter, sortKey, setSortKey, subjects, mistakes } =
    useMistakeStore();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Mistake | undefined>();
  const [showFilter, setShowFilter] = useState(false);

  const filtered = getFiltered();

  const openAdd = () => { setEditTarget(undefined); setShowForm(true); };
  const openEdit = (m: Mistake) => { setEditTarget(m); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(undefined); };

  const toggleTagFilter = (tag: MistakeTag) => {
    const next = filter.tags.includes(tag)
      ? filter.tags.filter((t) => t !== tag)
      : [...filter.tags, tag];
    setFilter({ tags: next });
  };

  const hasActiveFilter = !!(filter.subject || filter.tags.length > 0 || filter.keyword || filter.showResolved);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "0.5px solid var(--border)",
          padding: "12px 16px 8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>MissLog</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <IconBtn onClick={() => exportToCSV(mistakes)} title="CSVエクスポ�EチE>
              <Download size={18} />
            </IconBtn>
            <IconBtn onClick={() => setShowFilter(!showFilter)} title="フィルター" active={hasActiveFilter}>
              <SlidersHorizontal size={18} />
            </IconBtn>
            <button
              onClick={openAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Plus size={15} /> 記録
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-tertiary)",
            }}
          />
          <input
            style={{
              width: "100%",
              padding: "9px 10px 9px 32px",
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              color: "var(--text)",
              outline: "none",
            }}
            placeholder="キーワード検索..."
            value={filter.keyword}
            onChange={(e) => setFilter({ keyword: e.target.value })}
          />
          {filter.keyword && (
            <button
              onClick={() => setFilter({ keyword: "" })}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort pills */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {(
            [
              { key: "newest", label: "新着" },
              { key: "reviewCount", label: "未復習優允E },
              { key: "priority", label: "優先度" },
            ] as { key: SortKey; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              style={{
                padding: "4px 10px",
                borderRadius: 99,
                border: "0.5px solid var(--border)",
                background: sortKey === key ? "var(--text)" : "var(--bg-secondary)",
                color: sortKey === key ? "var(--bg)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: sortKey === key ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--bg-card)",
            borderBottom: "0.5px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Subject filter */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
              教科で絞り込み
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <FilterPill label="すべて" active={!filter.subject} onClick={() => setFilter({ subject: "" })} />
              {subjects.map((s) => (
                <FilterPill
                  key={s}
                  label={s}
                  active={filter.subject === s}
                  onClick={() => setFilter({ subject: filter.subject === s ? "" : s })}
                />
              ))}
            </div>
          </div>

          {/* Tag filter */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
              タグで絞り込み
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    opacity: filter.tags.includes(tag) ? 1 : 0.45,
                  }}
                >
                  <Tag label={tag} />
                </button>
              ))}
            </div>
          </div>

          {/* Show resolved */}
          <button
            onClick={() => setFilter({ showResolved: !filter.showResolved })}
            style={{
              alignSelf: "flex-start",
              padding: "5px 12px",
              borderRadius: 99,
              border: "0.5px solid var(--border)",
              background: filter.showResolved ? "var(--bg-secondary)" : "none",
              color: "var(--text-secondary)",
              fontSize: 12,
            }}
          >
            {filter.showResolved ? "✁E解決済み表示中" : "解決済みを表示"}
          </button>

          {hasActiveFilter && (
            <button
              onClick={() => setFilter({ subject: "", tags: [], keyword: "", showResolved: false })}
              style={{
                alignSelf: "flex-start",
                padding: "4px 10px",
                borderRadius: 99,
                border: "0.5px solid var(--danger)",
                background: "var(--danger-bg)",
                color: "var(--danger)",
                fontSize: 12,
              }}
            >
              フィルター解除
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-tertiary)",
          }}
        >
          <p style={{ fontSize: 15, marginBottom: 8 }}>
            {hasActiveFilter ? "条件に合うミスがありません" : "まだミスが記録されてぁE��せん"}
          </p>
          {!hasActiveFilter && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", marginTop: 12 }}>
              <button
                onClick={openAdd}
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                最初�Eミスを記録する
              </button>
              <button
                onClick={() => useMistakeStore.getState().seedData()}
                style={{
                  background: "none",
                  color: "var(--text-tertiary)",
                  border: "0.5px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "8px 16px",
                  fontSize: 13,
                }}
              >
                サンプルチE�Eタを投入する
              </button>
            </div>
          )}
        </div>
        ) : (
          filtered.map((m) => <MistakeCard key={m.id} mistake={m} onEdit={openEdit} />)
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
          {filtered.length}件 表示
        </p>
      </div>

      {/* Form modal */}
      {showForm && <MistakeForm initial={editTarget} onClose={closeForm} />}
    </div>
  );
}

function IconBtn({
  onClick,
  children,
  title,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "var(--accent-light)" : "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius-md)",
        color: active ? "var(--accent-text)" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 99,
        border: "0.5px solid var(--border)",
        background: active ? "var(--text)" : "var(--bg-secondary)",
        color: active ? "var(--bg)" : "var(--text-secondary)",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}
