// src/lib/seed.ts
import { v4 as uuidv4 } from "uuid";
import { format, subDays } from "date-fns";
import type { Mistake } from "@/types";

export function generateSeedData(): Mistake[] {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const date = (d: Date) => format(d, "yyyy-MM-dd");

  const make = (
    overrides: Partial<Mistake> & {
      subject: string;
      comment: string;
    }
  ): Mistake => ({
    id: uuidv4(),
    page: "",
    question: "",
    tags: [],
    isImportant: false,
    reviewCount: 0,
    lastReviewedAt: null,
    nextReviewDate: null,
    isResolved: false,
    image: null,
    createdAt: iso(now),
    updatedAt: iso(now),
    ...overrides,
  });

  return [
    make({
      subject: "数学",
      page: "42",
      question: "3(2)",
      comment: "積分の置換で符号を間違えた。du = -sin(x)dx になるのに +sin(x)dx としてしまった。",
      tags: ["計算ミス"],
      isImportant: true,
      reviewCount: 1,
      lastReviewedAt: date(subDays(now, 1)),
      nextReviewDate: date(subDays(now, 0)), // today
      createdAt: iso(subDays(now, 3)),
      updatedAt: iso(subDays(now, 1)),
    }),
    make({
      subject: "英語",
      page: "78",
      question: "12",
      comment: "関係代名詞 which と that の使い分けを間違えた。先行詞が物でも人でも that は使えるが、カンマ直後は which のみ。",
      tags: ["理解不足"],
      reviewCount: 0,
      nextReviewDate: date(subDays(now, 1)), // overdue
      createdAt: iso(subDays(now, 5)),
      updatedAt: iso(subDays(now, 5)),
    }),
    make({
      subject: "数学",
      page: "55",
      question: "7",
      comment: "数列の漸化式、特性方程式を立てるのを忘れてそのまま解こうとした。",
      tags: ["ケアレスミス", "理解不足"],
      isImportant: true,
      reviewCount: 2,
      lastReviewedAt: date(subDays(now, 4)),
      nextReviewDate: date(subDays(now, 1)), // overdue
      createdAt: iso(subDays(now, 10)),
      updatedAt: iso(subDays(now, 4)),
    }),
    make({
      subject: "理科",
      page: "30",
      question: "5(1)",
      comment: "モル計算で分子量を間違えた。NaOH = 40 なのに 23 にしてしまった（Naの原子量だけで計算した）。",
      tags: ["暗記不足", "計算ミス"],
      reviewCount: 3,
      lastReviewedAt: date(subDays(now, 8)),
      nextReviewDate: date(subDays(now, 1)), // overdue
      createdAt: iso(subDays(now, 15)),
      updatedAt: iso(subDays(now, 8)),
    }),
    make({
      subject: "社会",
      page: "120",
      question: "2",
      comment: "ワシントン会議（1921）とパリ講和会議（1919）の順序を逆に覚えていた。",
      tags: ["暗記不足"],
      reviewCount: 1,
      lastReviewedAt: date(subDays(now, 2)),
      nextReviewDate: format(new Date(now.getTime() + 86400000 * 2), "yyyy-MM-dd"),
      createdAt: iso(subDays(now, 7)),
      updatedAt: iso(subDays(now, 2)),
    }),
    make({
      subject: "英語",
      page: "100",
      question: "15",
      comment: "仮定法過去完了と仮定法過去の混合問題で判定基準が曖昧。「もし〜していたら（過去事実に反）」→ had + pp。",
      tags: ["理解不足"],
      isImportant: true,
      reviewCount: 0,
      createdAt: iso(subDays(now, 1)),
      updatedAt: iso(subDays(now, 1)),
    }),
    make({
      subject: "数学",
      page: "88",
      question: "2(3)",
      comment: "ベクトルの外積の方向を右手系で確認し忘れた。試験中に慌ててしまった。",
      tags: ["ケアレスミス"],
      reviewCount: 4,
      lastReviewedAt: date(subDays(now, 15)),
      nextReviewDate: format(new Date(now.getTime() + 86400000 * 5), "yyyy-MM-dd"),
      isResolved: true,
      createdAt: iso(subDays(now, 30)),
      updatedAt: iso(subDays(now, 15)),
    }),
  ];
}
