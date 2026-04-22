// src/types/index.ts

export type MistakeTag =
  | "計算ミス"
  | "理解不足"
  | "ケアレスミス"
  | "暗記不足"
  | "時間切れ"
  | "その他";

export const DEFAULT_TAGS: MistakeTag[] = [
  "計算ミス",
  "理解不足",
  "ケアレスミス",
  "暗記不足",
  "時間切れ",
  "その他",
];

export const DEFAULT_SUBJECTS = [
  "数学",
  "英語",
  "国語",
  "理科",
  "社会",
  "その他",
];

export interface ReviewLog {
  date: string; // yyyy-MM-dd
  count: number; // reviews done that day
}

export interface Mistake {
  id: string;
  subject: string;
  page: string;
  question: string;
  comment: string;
  tags: MistakeTag[];
  isImportant: boolean;
  reviewCount: number;
  lastReviewedAt: string | null; // ISO string
  nextReviewDate: string | null; // ISO string
  isResolved: boolean;
  image: string | null; // base64 or null
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  reviewHistory?: string[]; // array of yyyy-MM-dd strings
}

export type SortKey = "newest" | "reviewCount" | "priority";

export interface FilterState {
  subject: string;
  tags: MistakeTag[];
  keyword: string;
  showResolved: boolean;
}

export interface SRSSettings {
  intervals: [number, number, number, number]; // [1回目, 2回目, 3回目, 4回目以降]
  notifyOnOpen: boolean; // アプリを開いたとき通知バナーを表示
}

export const DEFAULT_SRS_SETTINGS: SRSSettings = {
  intervals: [1, 3, 7, 14],
  notifyOnOpen: true,
};

export interface AppStats {
  total: number;
  unreviewed: number;
  dueToday: number;
  bySubject: Record<string, number>;
  streak: number;           // current consecutive days
  totalReviews: number;     // all-time review count
  heatmap: Record<string, number>; // date → review count (last 90 days)
}
