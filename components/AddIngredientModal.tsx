"use client";

import { X, Plus, Calendar, ReceiptText, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Ingredient } from "@/types";
import { CATEGORY_KO, emojiByKo, type CategoryKo } from "@/lib/ingredient";
import ReceiptScanner from "@/components/ReceiptScanner";
import type { ExtractedItem } from "@/services/receipt"; 

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    ingredient: Omit<Ingredient, "id" | "daysLeft" | "available">
  ) => void;
}

type FormData = {
  name: string;
  category: CategoryKo;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
};

export default function AddIngredientModal({
  isOpen,
  onClose,
  onAdd,
}: AddIngredientModalProps) {
  const [submitting, setSubmitting] = useState(false);

  // ❌ 이제 ReceiptScanner가 관리하므로 불필요
  // const [scanningReceipt, setScanningReceipt] = useState(false);

  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [showExtractedItems, setShowExtractedItems] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "기타",
    quantity: 1,
    unit: "개",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  const isOpenRef = useRef(isOpen);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    isOpenRef.current = isOpen;
    onCloseRef.current = onClose;
  });

  // ESC 키
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  // ✅ ReceiptScanner에서 올라온 추출 결과 반영
  const handleExtract = (items: ExtractedItem[]) => {
    setExtractedItems(items);
    setShowExtractedItems(true);
  };

  // ✅ 누락되어 있던 개별 추가 핸들러
  const handleAddExtractedItem = (item: ExtractedItem, index: number) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      onAdd({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        // Ingredient 타입에 emoji가 없다면 any 캐스팅 유지
        emoji: emojiByKo[item.category],
      } as any);

      setExtractedItems((prev) => prev.filter((_, i) => i !== index));
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 누락되어 있던 모두 추가 핸들러
  const handleAddAllExtractedItems = async () => {
    if (submitting || extractedItems.length === 0) return;
    setSubmitting(true);
    try {
      for (let i = 0; i < extractedItems.length; i++) {
        const item = extractedItems[i];
        onAdd({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          purchaseDate: item.purchaseDate,
          expiryDate: item.expiryDate,
          emoji: emojiByKo[item.category],
        } as any);

        if (i < extractedItems.length - 1) {
          await new Promise((r) => setTimeout(r, 80));
        }
      }
      setExtractedItems([]);
      setShowExtractedItems(false);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // 수동 추가
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || submitting) return;

    setSubmitting(true);
    try {
      onAdd({
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity) || 1,
        unit: formData.unit,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        emoji: emojiByKo[formData.category],
      } as any);

      setFormData({
        name: "",
        category: "기타",
        quantity: 1,
        unit: "개",
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minExpiryDate = formData.purchaseDate || today;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-ingredient-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // ✅ 포커스 받도록
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

        {/* 영수증 추가 (분리된 컴포넌트) */}
        <div className="p-6 space-y-4">
          <ReceiptScanner onExtract={handleExtract} />
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
                    className="px-3 py-1 bg-[#10B981] text-white rounded-lg text-sm hover:bg-[#059669] transition-colors disabled:opacity-50"
                    disabled={submitting}
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

        {/* 수동 입력 폼 */}
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
              autoFocus
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
                💡 유통기한 미입력 시 "미설정"
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
