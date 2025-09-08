"use client";

import { X, Plus, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import type { Ingredient } from "@/types";
import { CATEGORY_KO, emojiByKo } from "@/lib/ingredient";

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    ingredient: Omit<Ingredient, "id" | "daysLeft" | "available">
  ) => void;
}


export default function AddIngredientModal({
  isOpen,
  onClose,
  onAdd,
}: AddIngredientModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  // 이제 조건부 렌더링
  if (!isOpen) return null;

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("재료명을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // 서버가 기대하는 payload(한글 그대로)
      const payload = {
        name: formData.name.trim(),
        category: formData.category as (typeof  CATEGORY_KO)[number],
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

      // 서버는 UI형태(emoji, category 한글, 날짜 문자열 등)로 돌려줌
      const created = await res.json();

      // 부모 onAdd는 id/daysLeft/available 없이 받도록 되어 있으므로 맞춰서 전달
      onAdd({
        name: created.name,
        category: created.category, // "야채"|"고기"|...
        quantity: created.quantity,
        unit: created.unit,
        purchaseDate: created.purchaseDate, // "yyyy-mm-dd" 또는 ""
        expiryDate: created.expiryDate, // "yyyy-mm-dd" 또는 ""
        emoji: created.emoji,
      });

      // 폼 리셋 & 닫기
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

        {/* 폼 */}
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
              { CATEGORY_KO.map((category) => (
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
                <span className="text-2xl">
                  {emojiByKo [formData.category]}
                </span>
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
