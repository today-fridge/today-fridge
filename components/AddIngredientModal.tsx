"use client";

import { X, Plus, Calendar, ReceiptText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Ingredient } from "@/types";
import { CATEGORY_KO, emojiByKo, type CategoryKo } from "@/lib/ingredient";

const OCR_DEV = process.env.NEXT_PUBLIC_OCR_DEV === "true";

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    ingredient: Omit<Ingredient, "id" | "daysLeft" | "available">
  ) => void;
}

// 폼 상태 타입
type FormData = {
  name: string;
  category: CategoryKo;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
};

// OCR 결과에서 추출된 상품 정보 (DB 저장용)
interface ExtractedItem {
  name: string;
  category: CategoryKo;
  quantity: number;
  unit: string;
  purchaseDate: string; //yyyy-mm-dd
  expiryDate?: string; //yyyy-mm-dd
}

export default function AddIngredientModal({
  isOpen,
  onClose,
  onAdd,
}: AddIngredientModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [showExtractedItems, setShowExtractedItems] = useState(false);
  const [ocrDebugInfo, setOcrDebugInfo] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "기타",
    quantity: 1,
    unit: "개",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 이미지를 Base64로 변환하는 함수
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ocr 응답에서 텍스트 추출
  const extractTextFromOcrResult = (ocrResult: any) => {
    const extractedText:[] | null =
      ocrResult?.images?.[0]?.receipt?.result?.subResults?.[0]?.items ?? null;
    return extractedText;
  };

  // (개발용 테스트 함수)
  const handleTest = async () => {
    const res = await fetch("/receipt.json"); // ✅ /로 시작해야 함
    const data = await res.json(); // ✅ .json() 함수 실행
    const extractedText = extractTextFromOcrResult(data);
    if (!extractedText) {
      console.warn("텍스트 추출 실패 - 원본 OCR 결과 확인 필요");

      // 사용자에게 더 자세한 정보 제공
      alert(
        `텍스트를 인식할 수 없습니다.\n\n제안사항:\n- 더 선명한 이미지 사용\n- 조명이 밝은 곳에서 촬영\n- 영수증 전체가 프레임에 들어오도록 촬영\n- 구겨지지 않은 평평한 영수증 사용`
      );
      return;
    }


    // // ExtractedItem 형태로 변환 (DB 저장용)
    const items: ExtractedItem[] = extractedText.map((item) => ({
      name: item.name.text,
      category: "기타",
      quantity: item.count.text,
      unit: "개",
      purchaseDate: today,
      expiryDate: undefined, // 영수증에서는 유통기한을 알 수 없음
    }));
    console.log(items);
    if (items.length > 0) {
      setExtractedItems(items);
      setShowExtractedItems(true);
      console.log("상품 목록 설정 완료:", items);
    } else {
      alert(
        "영수증에서 상품 정보를 찾을 수 없습니다.\n더 선명한 이미지를 사용해보세요."
      );
    }
  };

  const handleReceiptScan = async (file: File) => {
    try {
      console.log("=== 영수증 스캔 시작 ===");
      console.log("파일 정보:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      setScanningReceipt(true);

      // 파일 검증
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("파일 크기가 너무 큽니다. (최대 5MB)");
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("지원하지 않는 파일 형식입니다. (JPG, PNG만 가능)");
      }

      // Base64 변환
      const base64Data = await convertToBase64(file);
      console.log("Base64 변환 완료, 길이:", base64Data.length);

      // OCR API 호출
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "V2",
          requestId: `receipt-${Date.now()}`,
          timestamp: Date.now(),
          images: [
            {
              format: file.type.split("/")[1],
              name: "receipt-scan",
              data: base64Data,
            },
          ],
        }),
      });

      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        console.error("OCR API 오류:", errorText);
        throw new Error(`OCR 처리 실패 (${ocrResponse.status})`);
      }

      const ocrResult = await ocrResponse.json();
      // setOcrDebugInfo(ocrResult); // 디버깅용 저장
      const extractedText = extractTextFromOcrResult(ocrResult);

      if (!extractedText) {
        console.warn("텍스트 추출 실패 - 원본 OCR 결과 확인 필요");

        // 사용자에게 더 자세한 정보 제공
        alert(
          `텍스트를 인식할 수 없습니다.\n\n제안사항:\n- 더 선명한 이미지 사용\n- 조명이 밝은 곳에서 촬영\n- 영수증 전체가 프레임에 들어오도록 촬영\n- 구겨지지 않은 평평한 영수증 사용`
        );
        return;
      }

      console.log("추출된 텍스트:", extractedText);

      // 현재 날짜를 구매일로 설정
      const today = new Date().toISOString().split("T")[0];

      // // ExtractedItem 형태로 변환 (DB 저장용)
      const items: ExtractedItem[] = extractedText.map((item) => ({
        name: item.name.text,
        category: "기타",
        quantity: item.count.text,
        unit: "개",
        purchaseDate: today,
        expiryDate: undefined, // 영수증에서는 유통기한을 알 수 없음
      }));

      if (items.length > 0) {
        setExtractedItems(items);
        setShowExtractedItems(true);
        console.log("상품 목록 설정 완료:", items);
      } else {
        alert(
          "영수증에서 상품 정보를 찾을 수 없습니다.\n더 선명한 이미지를 사용해보세요."
        );
      }
    } catch (error: any) {
      console.error("영수증 스캔 오류:", error);
      alert(error.message || "영수증 스캔 중 오류가 발생했습니다.");
    } finally {
      setScanningReceipt(false);
    }
  };

  // 추출된 상품을 DB에 저장하는 함수
  const saveExtractedItemToDB = async (item: ExtractedItem) => {
    const payload = {
      name: item.name,
      category: item.category, // 이미 한글 카테고리
      quantity: item.quantity,
      unit: item.unit,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate || undefined,
    };

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API 오류 응답:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(errorData?.error || "상품 저장에 실패했습니다");
    }

    const created = await res.json();
    // console.log("DB 저장 성공:", created);
    // console.log("=== DB 저장 완료 ===");

    return created;
  };

  // 개별 상품 추가
  const handleAddExtractedItem = async (item: ExtractedItem, index: number) => {
    try {
      console.log(`=== 개별 상품 추가 시작 [${index}] ===`);
      console.log("추가할 상품:", item);

      const created = await saveExtractedItemToDB(item);

      onAdd({
        name: created.name,
        category: created.category,
        quantity: created.quantity,
        unit: created.unit,
        purchaseDate: created.purchaseDate,
        expiryDate: created.expiryDate,
        emoji: created.emoji,
      });

      // 추가된 아이템을 목록에서 제거
      const updatedItems = extractedItems.filter((_, i) => i !== index);
      console.log("남은 상품 목록:", updatedItems);
      setExtractedItems(updatedItems);

      console.log(`=== 개별 상품 추가 완료 [${index}] ===`);
    } catch (err: any) {
      console.error(`=== 개별 상품 추가 실패 [${index}] ===`);
      console.error("오류 상세:", {
        name: err.name,
        message: err.message,
        stack: err.stack?.substring(0, 300),
      });
      alert(`"${item.name}" 추가 중 오류: ${err.message || "알 수 없는 오류"}`);
    }
  };

  // 모든 추출된 상품 일괄 추가
  const handleAddAllExtractedItems = async () => {
    try {
      console.log("=== 일괄 추가 시작 ===");
      console.log(`총 ${extractedItems.length}개 상품 처리 예정`);

      setSubmitting(true);

      const results = [];
      const errors = [];

      for (let i = 0; i < extractedItems.length; i++) {
        const item = extractedItems[i];
        console.log(`\n--- 상품 ${i + 1}/${extractedItems.length} 처리 중 ---`);
        console.log("처리할 상품:", item);

        try {
          const created = await saveExtractedItemToDB(item);
          results.push(created);

          console.log(`상품 ${i + 1} 저장 성공:`, created.name);

          onAdd({
            name: created.name,
            category: created.category,
            quantity: created.quantity,
            unit: created.unit,
            purchaseDate: created.purchaseDate,
            expiryDate: created.expiryDate,
            emoji: created.emoji,
          });
        } catch (err: any) {
          console.error(`상품 ${i + 1} (${item.name}) 저장 실패:`, err);
          errors.push({ item: item.name, error: err.message });
        }

        // 각 요청 사이에 잠시 대기 (API 과부하 방지)
        if (i < extractedItems.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setExtractedItems([]);
      setShowExtractedItems(false);

      let message = `${results.length}개 상품이 추가되었습니다!`;
      if (errors.length > 0) {
        message += `\n\n실패한 상품 ${errors.length}개:\n${errors
          .map((e) => `- ${e.item}: ${e.error}`)
          .join("\n")}`;
      }

      alert(message);

      if (results.length > 0) {
        onClose();
      }
    } catch (error: any) {
      console.error("=== 일괄 추가 전체 실패 ===");
      console.error("전체 오류:", error);
      alert("일괄 추가 중 예상치 못한 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
      console.log("=== 일괄 추가 완료 ===");
    }
  };

  if (!isOpen) return null;

  //수동 상품 추가 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("재료명을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
      };

      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "추가에 실패했어요");
      }

      const created = await res.json();

      onAdd({
        name: created.name,
        category: created.category,
        quantity: created.quantity,
        unit: created.unit,
        purchaseDate: created.purchaseDate,
        expiryDate: created.expiryDate,
        emoji: created.emoji,
      });

      setFormData({
        name: "",
        category: "기타",
        quantity: 1,
        unit: "개",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
      });
      onClose();
    } catch (err: any) {
      alert(err.message || "오류가 발생했어요");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minExpiryDate = formData.purchaseDate || today;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-ingredient-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-xl">
              <Plus className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2
                id="add-ingredient-title"
                className="text-xl font-bold text-[#374151]"
              >
                새 재료 추가
              </h2>
              <p className="text-sm text-[#6B7280]">
                냉장고에 새로운 재료를 등록하세요
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* 영수증 추가 */}

        <div className="p-6 space-y-4">
          <button onClick={handleTest}>테스트</button>
          <label
            className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              scanningReceipt
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#10B981] text-white hover:bg-[#059669]"
            }`}
            htmlFor="scanReceipt"
          >
            {scanningReceipt ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                영수증 분석 중...
              </>
            ) : (
              <>
                <ReceiptText className="w-5 h-5" />
                영수증으로 추가하기
              </>
            )}
          </label>
          <input
            type="file"
            id="scanReceipt"
            accept="image/*"
            className="hidden"
            disabled={scanningReceipt}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleReceiptScan(file);
              }
            }}
          />
        </div>

        {/* 추출된 상품 목록 */}
        {showExtractedItems && extractedItems.length > 0 && (
          <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-[#F0FDF4] to-[#F0FDF4]/50 border border-[#10B981]/20 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#047857] flex items-center gap-2">
                <ReceiptText className="w-5 h-5" />
                영수증에서 찾은 상품들 ({extractedItems.length}개)
              </h3>
              <button
                onClick={handleAddAllExtractedItems}
                disabled={submitting}
                className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm font-medium hover:bg-[#059669] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    추가 중...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    모두 추가
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {extractedItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{emojiByKo[item.category]}</span>
                    <div>
                      <div className="font-medium text-[#374151]">
                        {item.name}
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        {item.quantity}
                        {item.unit} • {item.category}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddExtractedItem(item, index)}
                    className="px-3 py-1 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] transition-colors"
                  >
                    추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 구분선 */}
        {showExtractedItems && extractedItems.length > 0 && (
          <div className="mx-6 mb-6">
            <div className="flex items-center gap-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-sm text-gray-500 font-medium">
                또는 직접 입력
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>
          </div>
        )}

        {/* 기존 수동 입력 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 재료명 */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
              <span className="text-[#10B981]">🏷️</span>
              재료명<span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="예: 당근, 우유, 계란"
              className="w-full p-4 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-[#F0FDF4]/20 transition-all duration-200 text-lg"
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
              <span className="text-[#10B981]">📂</span>
              카테고리
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORY_KO.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData({ ...formData, category })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    formData.category === category
                      ? "border-[#10B981] bg-[#F0FDF4] text-[#10B981]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#10B981]/50"
                  }`}
                  aria-pressed={formData.category === category}
                >
                  <span className="text-2xl">{emojiByKo[category]}</span>
                  {/* ✅ 안전 인덱싱 */}
                  <span className="text-xs font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 수량 */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
              <span className="text-[#10B981]">🔢</span>
              수량<span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="999"
                step="0.5"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value) || 1,
                  })
                }
                className="w-full p-4 pr-12 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-[#F0FDF4]/20 transition-all duration-200 text-lg text-center"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-medium">
                개
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
              💡 예: 당근 2개, 우유 1개, 계란 0.5개
            </p>
          </div>

          {/* 구입일/유통기한 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#10B981]" />
                구입일
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
                max={today}
                className="w-full p-4 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-[#F0FDF4]/20 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
                <span className="text-[#EF4444]">⏰</span>
                유통기한
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                min={minExpiryDate}
                className="w-full p-4 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-[#F0FDF4]/20 transition-all duration-200"
              />
              <p className="text-xs text-[#6B7280] mt-2">
                💡 유통기한을 입력하지 않으면 "미설정"으로 표시됩니다
              </p>
            </div>
          </div>

          {/* 미리보기 */}
          {formData.name && (
            <div className="bg-gradient-to-r from-[#F0FDF4] to-[#F0FDF4]/50 border border-[#10B981]/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-[#047857] mb-2 flex items-center gap-2">
                <span>👀</span>
                미리보기
              </p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-2xl">{emojiByKo[formData.category]}</span>
                <div className="flex-1">
                  <div className="font-semibold text-[#374151] text-lg">
                    {formData.name}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {formData.quantity}
                    {formData.unit} • {formData.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#6B7280]">유통기한</div>
                  <div className="text-sm font-medium text-[#374151]">
                    {formData.expiryDate || "미설정"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl font-semibold hover:bg-[#F3F4F6] transition-all duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 px-6 bg-[#10B981] text-white rounded-xl font-semibold hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              {submitting ? "추가 중..." : "추가하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
