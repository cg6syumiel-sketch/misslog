// src/components/dashboard/ImportExportModal.tsx
"use client";

import { useRef, useState } from "react";
import { X, Upload, Download, FileJson } from "lucide-react";
import { useMistakeStore } from "@/store/useMistakeStore";
import { exportToCSV } from "@/lib/csv";
import type { Mistake } from "@/types";

interface Props {
  onClose: () => void;
}

export function ImportExportModal({ onClose }: Props) {
  const { mistakes, importData } = useMistakeStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleExportJSON = () => {
    const json = JSON.stringify(mistakes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `misslog_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "success", msg: `${mistakes.length}件をJSONでエクスポートしました` });
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as Mistake[];
        if (!Array.isArray(parsed)) throw new Error("配列形式のデータが必要です");
        // Basic validation
        const valid = parsed.every((m) => m.id && m.subject !== undefined && m.createdAt);
        if (!valid) throw new Error("データ形式が正しくありません");
        importData(parsed);
        setStatus({ type: "success", msg: `${parsed.length}件をインポートしました（重複は除外）` });
      } catch (err) {
        setStatus({ type: "error", msg: `インポートエラー: ${err instanceof Error ? err.message : "不明"}` });
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = "";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 300,
        display: "flex",
        alignItems: "flex-end",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px 20px 0 0",
          padding: "20px 16px 40px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>データの入出力</h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: 99,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {status && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              background: status.type === "success" ? "var(--accent-light)" : "var(--danger-bg)",
              color: status.type === "success" ? "var(--accent-text)" : "var(--danger)",
              fontSize: 13,
            }}
          >
            {status.msg}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 4px", fontWeight: 500 }}>
          エクスポート
        </p>

        <IOButton
          icon={<FileJson size={16} />}
          label="JSONバックアップ"
          sub="全データを復元可能な形式で保存"
          onClick={handleExportJSON}
          color="var(--info)"
          bg="var(--info-bg)"
        />
        <IOButton
          icon={<Download size={16} />}
          label="CSVエクスポート"
          sub="Excelなどで開ける表形式"
          onClick={() => { exportToCSV(mistakes); setStatus({ type: "success", msg: "CSVをエクスポートしました" }); }}
          color="var(--accent-text)"
          bg="var(--accent-light)"
        />

        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "8px 0 4px", fontWeight: 500 }}>
          インポート
        </p>

        <IOButton
          icon={<Upload size={16} />}
          label="JSONから復元"
          sub="バックアップファイルを読み込む（重複は自動スキップ）"
          onClick={() => fileRef.current?.click()}
          color="var(--warning)"
          bg="var(--warning-bg)"
        />
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={handleImportJSON}
        />

        <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: "4px 0 0", textAlign: "center" }}>
          ※ インポートは既存データとマージされます（上書きはされません）
        </p>
      </div>
    </div>
  );
}

function IOButton({
  icon,
  label,
  sub,
  onClick,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  color: string;
  bg: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: bg,
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        textAlign: "left",
        color,
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color }}>
          {label}
        </p>
        <p style={{ fontSize: 11, margin: "2px 0 0", color, opacity: 0.8 }}>
          {sub}
        </p>
      </div>
    </button>
  );
}
