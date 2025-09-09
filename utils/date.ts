// utils/date.ts
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// KST시 기준 
dayjs.tz.setDefault("Asia/Seoul");

export type DateLike = Date | string | number | Dayjs | null | undefined;
export const DATE_FMT = "YYYY-MM-DD";

/* 입력을 Dayjs로 안전 변환(없거나 잘못된 값이면 null) */
const asDay = (v: DateLike): Dayjs | null => {
  if (v == null || v === "") return null;

  const d = dayjs(v as any);
  return d.isValid() ? d : null;
};

/* 포맷 YYYY-MM-DD */
export function ymd(v: DateLike): string {
  const x = asDay(v);
  return x ? x.format(DATE_FMT) : "";
}

/*자정 기준 */
export function startOfDay(v: DateLike): Dayjs | null {
  const x = asDay(v);
  return x ? x.startOf("day") : null;
}

/** 남은 일수 계산 */
export function calcDaysLeft(today: DateLike, expiresAt: DateLike | null): number | null {
  if (!expiresAt) return null;
  const t0 = startOfDay(today);
  const e0 = startOfDay(expiresAt);
  if (!t0 || !e0) return null;
  return e0.diff(t0, "day");
}

/* 만료일 표시 */
export function formatExpiryDate(expiryDate: DateLike, daysLeft?: number | null): string {
  const ex = asDay(expiryDate);
  if (!ex) return "유통기한이 입력되지 않았어요";

  const left = typeof daysLeft === "number" ? daysLeft : calcDaysLeft(dayjs(), ex);
  if (left == null) return "유통기한이 입력되지 않았어요";

  const shortDate = ex.format("MM.DD");
  if (left < 0) return "기한 만료";
  if (left === 0) return "오늘까지";
  return `D-${left}일 (${shortDate})`;
}

/* 오늘날짜 YYYY-MM-DD */
export function today(): string {
  return dayjs().format(DATE_FMT);
}
