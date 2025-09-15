import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Recipe } from "../types";

interface IngredientConsumptionModalProps {
  recipe: Recipe;
  onClose: () => void;
  onConfirm: (
    consumedIngredients: { name: string; quantity: number }[]
  ) => void;
}

export default function IngredientConsumptionModal({
  recipe,
  onClose,
  onConfirm,
}: IngredientConsumptionModalProps) {
  // 각 재료의 사용량 상태 관리
  const [consumedQuantities, setConsumedQuantities] = useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {};
    recipe.ingredients.forEach((ingredient) => {
      initial[ingredient.name] = ingredient.quantity;
    });
    return initial;
  });

  // 수량 조절 함수
  const adjustQuantity = (ingredientName: string, delta: number) => {
    setConsumedQuantities((prev) => ({
      ...prev,
      [ingredientName]: Math.max(0, (prev[ingredientName] || 0) + delta),
    }));
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    const consumedIngredients = recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: consumedQuantities[ingredient.name] || 0,
    }));
    onConfirm(consumedIngredients);
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-auto md:min-w-[500px] md:max-w-[600px] bg-white rounded-t-2xl md:rounded-2xl z-50 shadow-2xl animate-slide-up md:animate-none">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-xl font-bold text-[#374151] mb-1">
              🎉 요리 완성!
            </h2>
            <p className="text-sm text-[#6B7280]">
              사용한 재료를 확인해주세요. 냉장고 재료에서 사용량을 차감할게요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* 재료 리스트 */}
        <div className="p-6 max-h-[50vh] md:max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {recipe.ingredients.map((ingredient) => {
              const originalQuantity = ingredient.quantity; // 이제 number
              const currentQuantity = consumedQuantities[ingredient.name] || 0;

              return (
                <div
                  key={ingredient.name}
                  className="bg-[#F9FAFB] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    {/* 재료 정보 */}
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {ingredient.name === "당근"
                          ? "🥕"
                          : ingredient.name === "양파"
                          ? "🧅"
                          : ingredient.name === "마늘"
                          ? "🧄"
                          : ingredient.name === "계란"
                          ? "🥚"
                          : ingredient.name === "밥"
                          ? "🍚"
                          : ingredient.name === "대파"
                          ? "🌿"
                          : ingredient.name === "간장"
                          ? "🍶"
                          : ingredient.name === "우유"
                          ? "🥛"
                          : ingredient.name === "소금"
                          ? "🧂"
                          : ingredient.name === "식용유"
                          ? "🛢️"
                          : "🥄"}
                      </div>
                      <div>
                        <div className="font-medium text-[#374151]">
                          {ingredient.name}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          레시피: {ingredient.quantity}
                        </div>
                      </div>
                    </div>

                    {/* 수량 조절 */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#6B7280] mr-2">
                        실제 사용:
                      </span>

                      <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E5E7EB] p-1">
                        <button
                          onClick={() => adjustQuantity(ingredient.name, -0.5)}
                          disabled={currentQuantity <= 0}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#6B7280]" />
                        </button>

                        <div className="px-3 py-1 min-w-[60px] text-center">
                          <span className="font-medium text-[#374151]">
                            {currentQuantity}
                          </span>
                        </div>

                        <button
                          onClick={() => adjustQuantity(ingredient.name, 0.5)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 변경 알림 */}
                  {currentQuantity !== originalQuantity && (
                    <div
                      className={`mt-2 text-xs p-2 rounded-lg ${
                        currentQuantity > originalQuantity
                          ? "bg-[#FFFBEB] text-[#F59E0B]"
                          : currentQuantity < originalQuantity
                          ? "bg-[#F0FDF4] text-[#10B981]"
                          : ""
                      }`}
                    >
                      {currentQuantity > originalQuantity
                        ? `레시피보다 ${(
                            currentQuantity - originalQuantity
                          ).toFixed(1)} 더 사용`
                        : `레시피보다 ${(
                            originalQuantity - currentQuantity
                          ).toFixed(1)} 적게 사용`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium hover:bg-[#F3F4F6] transition-all duration-200"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#10B981] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>✅</span>
              재료 사용량 반영하기
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
