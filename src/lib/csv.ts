// src/lib/csv.ts
import type { Mistake } from "@/types";

export function exportToCSV(mistakes: Mistake[]): void {
  const headers = [
    "ID",
    "教科",
    "ページ",
    "問題番号",
    "コメント",
    "タグ",
    "重要",
    "復習回数",
    "最終復習日",
    "次回復習日",
    "解決済み",
    "登録日",
  ];

  const rows = mistakes.map((m) => [
    m.id,
    m.subject,
    m.page,
    m.question,
    m.comment.replace(/,/g, "，").replace(/\n/g, " "),
    m.tags.join("・"),
    m.isImportant ? "★" : "",
    m.reviewCount,
    m.lastReviewedAt ?? "",
    m.nextReviewDate ?? "",
    m.isResolved ? "済" : "",
    m.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `misslog_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
