// src/components/mistakes/MistakeForm.tsx
"use client";

import { useState, useRef } from "react";
import { X, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import type { Mistake, MistakeTag } from "@/types";
import { DEFAULT_TAGS } from "@/types";
import { useMistakeStore } from "@/store/useMistakeStore";

interface Props {
  initial?: Mistake;
  onClose: () => void;
}

type FormData = {
  subject: string;
  page: string;
  question: string;
  comment: string;
  tags: MistakeTag[];
  isImportant: boolean;
  isResolved: boolean;
  image: string | null;
};

export function MistakeForm({ initial, onClose }: Props) {
  const { addMistake, updateMistake, deleteMistake, subjects, addSubject } = useMistakeStore();
  const [newSubject, setNewSubject] = useState("");
  const [showNewSubject, setShowNewSubject] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    subject: initial?.subject ?? subjects[0] ?? "その他",
    page: initial?.page ?? "",
    question: initial?.question ?? "",
    comment: initial?.comment ?? "",
    tags: initial?.tags ?? [],
    isImportant: initial?.isImportant ?? false,
    isResolved: initial?.isResolved ?? false,
    image: initial?.image ?? null,
  });

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleTag = (tag: MistakeTag) => {
    set(
      "tags",
      form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]
    );
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("image", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.subject) return;
    if (initial) {
      updateMistake(initial.id, form);
    } else {
      addMistake(form);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!initial) return;
    if (confirm("このミスを削除しますか？")) {
      deleteMistake(initial.id);
      onClose();
    }
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    addSubject(newSubject.trim());
    set("subject", newSubject.trim());
    setNewSubject("");
    setShowNewSubject(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--bg-secondary)",
    border: "0.5px solid var(--border)",
    borderRadius: "var(--radius-md)",
    fontSize: 15,
    color: "var(--text)",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text-secondary)",
    marginBottom: 4,
    display: "block" as const,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px 20px 0 0",
          padding: "16px 16px 32px",
          maxHeight: "92vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>
            {initial ? "ミスを編集" : "ミスを記録"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: 99,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Subject */}
        <div>
          <label style={labelStyle}>教科</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => set("subject", s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  border: "0.5px solid var(--border)",
                  background: form.subject === s ? "var(--accent)" : "var(--bg-secondary)",
                  color: form.subject === s ? "#fff" : "var(--text)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setShowNewSubject(!showNewSubject)}
              style={{
                padding: "5px 12px",
                borderRadius: 99,
                border: "0.5px dashed var(--border-strong)",
                background: "none",
                color: "var(--text-secondary)",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Plus size={12} /> 追加
            </button>
          </div>
          {showNewSubject && (
            <div style={{ display: "flex", gap: 6 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="教科名を入力"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
              />
              <button
                onClick={handleAddSubject}
                style={{
                  padding: "0 14px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                追加
              </button>
            </div>
          )}
        </div>

        {/* Page & Question */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>ページ番号</label>
            <input
              style={inputStyle}
              type="number"
              placeholder="例: 42"
              value={form.page}
              onChange={(e) => set("page", e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>問題番号</label>
            <input
              style={inputStyle}
              placeholder="例: 3(2)"
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label style={labelStyle}>コメント・メモ</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            placeholder="どこで間違えた？何を理解できていなかった？"
            value={form.comment}
            onChange={(e) => set("comment", e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>ミスの種類（複数選択可）</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {DEFAULT_TAGS.map((tag) => {
              const selected = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 99,
                    border: `0.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                    background: selected ? "var(--accent-light)" : "var(--bg-secondary)",
                    color: selected ? "var(--accent-text)" : "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: selected ? 500 : 400,
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flags */}
        <div style={{ display: "flex", gap: 10 }}>
          <Toggle
            label="★ 重要"
            active={form.isImportant}
            onChange={() => set("isImportant", !form.isImportant)}
            activeColor="var(--warning)"
            activeBg="var(--warning-bg)"
          />
          <Toggle
            label="✓ 解決済み"
            active={form.isResolved}
            onChange={() => set("isResolved", !form.isResolved)}
            activeColor="var(--accent-text)"
            activeBg="var(--accent-light)"
          />
        </div>

        {/* Image */}
        <div>
          <label style={labelStyle}>画像添付</label>
          {form.image ? (
            <div style={{ position: "relative" }}>
              <img
                src={form.image}
                alt="添付画像"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-md)",
                  maxHeight: 180,
                  objectFit: "contain",
                  background: "var(--bg-secondary)",
                }}
              />
              <button
                onClick={() => set("image", null)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: 99,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                padding: "20px",
                background: "var(--bg-secondary)",
                border: "0.5px dashed var(--border-strong)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-tertiary)",
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ImageIcon size={20} />
              タップして画像を選択
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImage}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {initial ? "更新する" : "記録する"}
        </button>

        {initial && (
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--danger-bg)",
              color: "var(--danger)",
              border: "0.5px solid var(--danger)",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Trash2 size={15} />
            このミスを削除
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  active,
  onChange,
  activeColor,
  activeBg,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
  activeColor: string;
  activeBg: string;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        flex: 1,
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        border: `0.5px solid ${active ? activeColor : "var(--border)"}`,
        background: active ? activeBg : "var(--bg-secondary)",
        color: active ? activeColor : "var(--text-secondary)",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}
