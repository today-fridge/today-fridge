// services/receipt.ts
import type { CategoryKo } from "@/lib/ingredient";

export interface ExtractedItem {
  name: string;
  category: CategoryKo;       // 예: "기타"
  quantity: number;           // 예: 1
  unit: string;               // 예: "개"
  purchaseDate: string;       // yyyy-mm-dd
  expiryDate?: string;        // yyyy-mm-dd | undefined
}

/** 파일을 base64(dataURL의 payload만)로 변환 */
export const fileToBase64Data = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result ?? "");
      const payload = base64.split(",")[1] ?? "";
      resolve(payload);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** OCR 응답에서 items 배열을 안전하게 추출 */
export const extractRawItems = (ocrResult: any) =>
  (ocrResult?.images?.[0]?.receipt?.result?.subResults?.[0]?.items ??
    null) as Array<
    { name?: { text?: string }; count?: { text?: string } } | undefined
  > | null;

/** raw items → ExtractedItem[] 매핑 */
export const toExtractedItems = (
  rawItems: ReturnType<typeof extractRawItems>,
  todayISO: string
): ExtractedItem[] => {
  if (!rawItems) return [];
  return rawItems
    .map((item) => ({
      name: String(item?.name?.text ?? "").trim(),
      category: "기타" as CategoryKo,
      quantity: Number(item?.count?.text ?? 1),
      unit: "개",
      purchaseDate: todayISO,
      expiryDate: undefined,
    }))
    .filter((i) => i.name.length > 0 && Number.isFinite(i.quantity));
};

/** 실제 영수증 스캔 → /api/ocr 호출 */
export const scanReceipt = async (file: File): Promise<ExtractedItem[]> => {
  // 파일 검증
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("파일 크기가 너무 큽니다. (최대 5MB)");
  }
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowed.includes(file.type)) {
    throw new Error("지원하지 않는 파일 형식입니다. (JPG, PNG만 가능)");
  }

  const base64Data = await fileToBase64Data(file);
  const payload = {
    version: "V2",
    requestId: `receipt-${Date.now()}`,
    timestamp: Date.now(),
    images: [
      {
        format: file.type.split("/")[1], // "jpeg"|"png" 등
        name: "receipt-scan",
        data: base64Data,
      },
    ],
  };

  // BASE_URL 있으면 사용, 없으면 상대경로
  const base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "";
  const url = `${base}/api/ocr`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OCR 처리 실패 (${res.status}) ${text}`);
  }

  const json = await res.json();
  const raw = extractRawItems(json);
  const today = new Date().toISOString().split("T")[0];
  const items = toExtractedItems(raw, today);

  if (items.length === 0) {
    throw new Error(
      "영수증에서 상품 정보를 찾을 수 없습니다.\n\n제안사항:\n- 더 선명한 이미지 사용\n- 밝은 조명\n- 영수증 전체 프레임 내 촬영\n- 구겨지지 않은 평평한 종이"
    );
  }
  return items;
};

/** 개발용: /public/receipt.json 로컬 테스트 */
export const fetchReceiptTest = async (): Promise<ExtractedItem[]> => {
  const res = await fetch("/receipt.json", { cache: "no-store" });
  if (!res.ok) throw new Error("테스트 데이터 로드 실패");
  const json = await res.json();

  const raw = extractRawItems(json);
  const today = new Date().toISOString().split("T")[0];
  const items = toExtractedItems(raw, today);

  if (items.length === 0) {
    throw new Error("영수증에서 상품 정보를 찾을 수 없습니다.");
  }
  return items;
};
