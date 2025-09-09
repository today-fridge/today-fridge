"use client";

import { useEffect, useState } from "react";
import { X, Save, Trash2, PencilLine } from "lucide-react";
import type { Ingredient } from "@/types";
import { CATEGORY_KO, emojiByKo } from "@/lib/ingredient";

type Props = {
  isOpen: boolean;
  ingredient: Ingredient | null; // 선택된 카드의 데이터
  onClose: () => void;
  onUpdated?: (updated: Ingredient) => void; // 성공 후 리스트 반영
  onDeleted?: (id: string) => void; // 삭제 선택시
};


export default function UpdateIngredientsModal({
  isOpen,
  ingredient,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    category: "기타" as (typeof CATEGORY_KO)[number],
    quantity: 1,
    unit: "개",
    purchaseDate: "",
    expiryDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // esc 닫기 기능 추가
   useEffect(() => {
    if (!isOpen) return; 
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  // 모달 열릴 때 선택된 재료로 채우기
  useEffect(() => {
    if (!isOpen || !ingredient) return;
    setForm({
      name: ingredient.name,
      category: ingredient.category as any,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      purchaseDate: ingredient.purchaseDate || "",
      expiryDate: ingredient.expiryDate || "",
    });
  }, [isOpen, ingredient]);

  if (!isOpen || !ingredient) return null;
  
  const today = new Date().toISOString().slice(0, 10);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!ingredient) return;
    if (!form.name.trim()) {
      alert("재료명을 입력해주세요.");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`/api/ingredients/${ingredient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          quantity: form.quantity,
          unit: form.unit.trim(),
          purchaseDate: form.purchaseDate || null,
          expiryDate: form.expiryDate || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "수정에 실패했어요.");
      }
      const updated: Ingredient = await res.json(); // API가 화면용 형태로 반환
      onUpdated?.(updated);
      onClose();
    } catch (err: any) {
      alert(err.message || "오류가 발생했어요");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!ingredient) return;
    if (!confirm("이 재료를 삭제할까요?")) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/ingredients/${ingredient.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "삭제에 실패했어요.");
      }
      onDeleted?.(ingredient.id);
      onClose();
    } catch (err: any) {
      alert(err.message || "오류가 발생했어요");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-xl">
              <PencilLine className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#374151]">재료 수정</h2>
              <p className="text-sm text-[#6B7280]">재료에 변화가 있나요?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-xl"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">
              재료명<span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full p-3 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-emerald-500"
              placeholder="예: 당근"
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">
              카테고리
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORY_KO.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm((s) => ({ ...s, category: c }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    form.category === c
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-[#E5E7EB] text-[#374151]"
                  }`}
                >
                  <span className="text-2xl">{emojiByKo[c]}</span>
                  <span className="text-xs font-medium">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 수량/단위 */}
          <div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 flex items-center gap-2">
                <span className="text-[#10B981]">🔢</span>
                수량<span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="999"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      quantity: parseFloat(e.target.value) || 1,
                    }))
                  }
                  className="w-full p-3 pr-12 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-[#F0FDF4]/20 transition-all duration-200 text-lg text-center"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-medium">
                개
              </span>
              </div>
               <p className="text-xs text-[#6B7280] mt-2">💡 예: 당근 2개, 우유 1개, 계란 0.5개</p>
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">
                구입일
              </label>
              <input
                type="date"
                value={form.purchaseDate || ""}
                max={today}
                onChange={(e) =>
                  setForm((s) => ({ ...s, purchaseDate: e.target.value }))
                }
                className="w-full p-3 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">
                유통기한
              </label>
              <input
                type="date"
                value={form.expiryDate || ""}
                min={form.purchaseDate || undefined}
                onChange={(e) =>
                  setForm((s) => ({ ...s, expiryDate: e.target.value }))
                }
                className="w-full p-3 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 액션 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F3F4F6]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>

          {/* 삭제 (선택) */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full mt-2 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        </form>
      </div>
    </div>
  );
}
