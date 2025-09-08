// lib/ingredient.ts
export const CATEGORY_KO = ["야채", "고기", "유제품", "조미료", "기타"] as const;
export type CategoryKO = typeof CATEGORY_KO[number];

export const CATEGORY_ENUM = ["VEGETABLE", "MEAT", "DAIRY", "SEASONING", "OTHER"] as const;
export type CategoryEnum = typeof CATEGORY_ENUM[number];

// 매핑은 'satisfies'로 키/값 누락 방지
export const enumToKo = {
  VEGETABLE: "야채",
  MEAT: "고기",
  DAIRY: "유제품",
  SEASONING: "조미료",
  OTHER: "기타",
} as const satisfies Record<CategoryEnum, CategoryKO>;

export const koToEnum = {
  야채: "VEGETABLE",
  고기: "MEAT",
  유제품: "DAIRY",
  조미료: "SEASONING",
  기타: "OTHER",
} as const satisfies Record<CategoryKO, CategoryEnum>;

export const emojiByKo = {
  야채: "🥬",
  고기: "🥩",
  유제품: "🥛",
  조미료: "🧂",
  기타: "🍳",
} as const satisfies Record<CategoryKO, string>;

// 날짜 유틸
export function ymd(d: Date | null) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// 남은 일수(오늘 0시 기준, 유통기한 당일은 0)
export function calcDaysLeft(today: Date, expiresAt: Date | null) {
  if (!expiresAt) return 9999;
  const t0 = startOfDay(today).getTime();
  const e0 = startOfDay(expiresAt).getTime();
  return Math.ceil((e0 - t0) / 86400000);
}
