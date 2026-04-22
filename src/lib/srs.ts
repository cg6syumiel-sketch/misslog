// src/lib/srs.ts
import { addDays, format, isToday, isPast, parseISO } from "date-fns";
import type { Mistake, SRSSettings } from "@/types";
import { DEFAULT_SRS_SETTINGS } from "@/types";

export function calcNextReviewDate(reviewCount: number, settings: SRSSettings = DEFAULT_SRS_SETTINGS): string {
  const today = new Date();
  const [d1, d2, d3, d4] = settings.intervals;
  const daysMap: Record<number, number> = { 1: d1, 2: d2, 3: d3 };
  const days = daysMap[reviewCount] ?? d4;
  return format(addDays(today, days), "yyyy-MM-dd");
}

export function isDueToday(mistake: Mistake): boolean {
  if (mistake.isResolved) return false;
  if (!mistake.nextReviewDate) return true;
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
