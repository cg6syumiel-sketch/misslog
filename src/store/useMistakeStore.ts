// src/store/useMistakeStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { format, subDays, parseISO, differenceInCalendarDays } from "date-fns";
import type { Mistake, MistakeTag, FilterState, SortKey, AppStats, SRSSettings } from "@/types";
import { DEFAULT_SUBJECTS, DEFAULT_SRS_SETTINGS } from "@/types";
import { calcNextReviewDate, getPriorityScore, isDueToday } from "@/lib/srs";
import { generateSeedData } from "@/lib/seed";

interface MistakeStore {
  mistakes: Mistake[];
  subjects: string[];
  filter: FilterState;
  sortKey: SortKey;
  srsSettings: SRSSettings;

  // CRUD
  addMistake: (data: Omit<Mistake, "id" | "createdAt" | "updatedAt" | "reviewCount" | "lastReviewedAt" | "nextReviewDate" | "reviewHistory">) => void;
  updateMistake: (id: string, data: Partial<Mistake>) => void;
  deleteMistake: (id: string) => void;

  // Review
  doReview: (id: string) => void;
  toggleResolved: (id: string) => void;
  toggleImportant: (id: string) => void;

  // Subjects
  addSubject: (name: string) => void;

  // Filter & Sort
  setFilter: (filter: Partial<FilterState>) => void;
  setSortKey: (key: SortKey) => void;

  // SRS Settings
  setSRSSettings: (settings: Partial<SRSSettings>) => void;

  // Dev/Demo/IO
  seedData: () => void;
  clearAll: () => void;
  importData: (data: Mistake[]) => void;

  // Selectors
  getFiltered: () => Mistake[];
  getDueToday: () => Mistake[];
  getStats: () => AppStats;
}

function calcStreak(mistakes: Mistake[]): number {
  // Build set of days that had at least one review
  const days = new Set<string>();
  mistakes.forEach((m) => {
    (m.reviewHistory ?? []).forEach((d) => days.add(d));
  });

  let streak = 0;
  let cursor = new Date();
  // Allow today to not count yet (check yesterday first if today missing)
  const todayStr = format(cursor, "yyyy-MM-dd");
  if (!days.has(todayStr)) {
    cursor = subDays(cursor, 1);
  }
  while (days.has(format(cursor, "yyyy-MM-dd"))) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

function calcHeatmap(mistakes: Mistake[]): Record<string, number> {
  const map: Record<string, number> = {};
  const cutoff = subDays(new Date(), 90);
  mistakes.forEach((m) => {
    (m.reviewHistory ?? []).forEach((d) => {
      if (parseISO(d) >= cutoff) {
        map[d] = (map[d] ?? 0) + 1;
      }
    });
  });
  return map;
}

export const useMistakeStore = create<MistakeStore>()(
  persist(
    (set, get) => ({
      mistakes: [],
      subjects: [...DEFAULT_SUBJECTS],
      filter: { subject: "", tags: [], keyword: "", showResolved: false },
      sortKey: "newest",
      srsSettings: { ...DEFAULT_SRS_SETTINGS },

      addMistake: (data) => {
        const now = new Date().toISOString();
        const mistake: Mistake = {
          ...data,
          id: uuidv4(),
          reviewCount: 0,
          lastReviewedAt: null,
          nextReviewDate: null,
          reviewHistory: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ mistakes: [mistake, ...s.mistakes] }));
      },

      updateMistake: (id, data) => {
        set((s) => ({
          mistakes: s.mistakes.map((m) =>
            m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMistake: (id) => {
        set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) }));
      },

      doReview: (id) => {
        const today = format(new Date(), "yyyy-MM-dd");
        const { srsSettings } = get();
        set((s) => ({
          mistakes: s.mistakes.map((m) => {
            if (m.id !== id) return m;
            const newCount = m.reviewCount + 1;
            const history = [...(m.reviewHistory ?? [])];
            if (!history.includes(today)) history.push(today);
            return {
              ...m,
              reviewCount: newCount,
              lastReviewedAt: today,
              nextReviewDate: calcNextReviewDate(newCount, srsSettings),
              reviewHistory: history,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      toggleResolved: (id) => {
        set((s) => ({
          mistakes: s.mistakes.map((m) =>
            m.id === id ? { ...m, isResolved: !m.isResolved, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      toggleImportant: (id) => {
        set((s) => ({
          mistakes: s.mistakes.map((m) =>
            m.id === id ? { ...m, isImportant: !m.isImportant, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      addSubject: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((s) => {
          if (s.subjects.includes(trimmed)) return s;
          return { subjects: [...s.subjects, trimmed] };
        });
      },

      setFilter: (filter) => {
        set((s) => ({ filter: { ...s.filter, ...filter } }));
      },

      setSortKey: (key) => set({ sortKey: key }),

      setSRSSettings: (settings) => {
        set((s) => ({ srsSettings: { ...s.srsSettings, ...settings } }));
      },

      seedData: () => {
        const data = generateSeedData();
        set((s) => ({ mistakes: [...data, ...s.mistakes] }));
      },

      clearAll: () => {
        set({ mistakes: [] });
      },

      importData: (data) => {
        set((s) => {
          const existingIds = new Set(s.mistakes.map((m) => m.id));
          const newItems = data.filter((m) => !existingIds.has(m.id));
          // Merge subjects
          const newSubjects = [...s.subjects];
          newItems.forEach((m) => {
            if (!newSubjects.includes(m.subject)) newSubjects.push(m.subject);
          });
          return { mistakes: [...newItems, ...s.mistakes], subjects: newSubjects };
        });
      },

      getFiltered: () => {
        const { mistakes, filter, sortKey } = get();
        let result = mistakes.filter((m) => {
          if (!filter.showResolved && m.isResolved) return false;
          if (filter.subject && m.subject !== filter.subject) return false;
          if (filter.tags.length > 0 && !filter.tags.some((t) => m.tags.includes(t))) return false;
          if (filter.keyword) {
            const kw = filter.keyword.toLowerCase();
            if (
              !m.subject.toLowerCase().includes(kw) &&
              !m.question.toLowerCase().includes(kw) &&
              !m.comment.toLowerCase().includes(kw)
            )
              return false;
          }
          return true;
        });

        result.sort((a, b) => {
          if (sortKey === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (sortKey === "reviewCount") return a.reviewCount - b.reviewCount;
          if (sortKey === "priority") return getPriorityScore(b) - getPriorityScore(a);
          return 0;
        });

        return result;
      },

      getDueToday: () => {
        return get().mistakes.filter(isDueToday);
      },

      getStats: () => {
        const { mistakes } = get();
        const active = mistakes.filter((m) => !m.isResolved);
        const bySubject: Record<string, number> = {};
        active.forEach((m) => {
          bySubject[m.subject] = (bySubject[m.subject] ?? 0) + 1;
        });
        const totalReviews = mistakes.reduce((acc, m) => acc + m.reviewCount, 0);
        return {
          total: mistakes.length,
          unreviewed: active.filter((m) => m.reviewCount === 0).length,
          dueToday: active.filter(isDueToday).length,
          bySubject,
          streak: calcStreak(mistakes),
          totalReviews,
          heatmap: calcHeatmap(mistakes),
        };
      },
    }),
    { name: "misslog-storage" }
  )
);

