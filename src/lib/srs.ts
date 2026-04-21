// src/lib/srs.ts
import { addDays, format, isToday, isPast, parseISO } from "date-fns";
import type { Mistake } from "@/types";

/**
 * Calculate next review date based on review count (Spaced Repetition)
 * 1st: next day, 2nd: 3 days, 3rd: 7 days, 4th+: 14 days
 */
export function calcNextReviewDate(reviewCount: number): string {
  const today = new Date();
  const daysMap: Record<number, number> = { 1: 1, 2: 3, 3: 7 };
  const days = daysMap[reviewCount] ?? 14;
  return format(addDays(today, days), "yyyy-MM-dd");
}

export function isDueToday(mistake: Mistake): boolean {
  if (mistake.isResolved) return false;
  if (!mistake.nextReviewDate) return true; // never reviewed → due
  const date = parseISO(mistake.nextReviewDate);
  return isToday(date) || isPast(date);
}

export function getPriorityScore(mistake: Mistake): number {
  let score = 0;
  if (mistake.isImportant) score += 100;
  if (isDueToday(mistake)) score += 50;
  score += Math.max(0, 10 - mistake.reviewCount) * 5;
  return score;
}
