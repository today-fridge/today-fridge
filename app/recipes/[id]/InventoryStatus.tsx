import { MAX_AVAILABILITY_RATIO } from "@/constants/recipe";
import { getAvailabilityColor } from "@/lib/recipeTransform";
import { Recipe } from "@/types";

interface InventoryStatusProps {
  recipe: Recipe;
  availabilityRatio: number;
  missingIngredients: string[];
}

const InventoryStatus = ({
  recipe,
  availabilityRatio,
  missingIngredients,
}: InventoryStatusProps) => {
  return (
    <div className="bg-gradient-to-r bg-[#F9FAFB] border text-[#374151] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#374151] font-medium">재료 보유 현황</span>
        <span
          className="text-sm font-semibold"
          style={{
            color: getAvailabilityColor(availabilityRatio),
          }}
        >
          {recipe.ingredients.length - missingIngredients.length}/
          {recipe.ingredients.length}개
        </span>
      </div>

      <div className="w-full bg-[#E5E7EB] rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{
            width: `${availabilityRatio}%`,
            backgroundColor: getAvailabilityColor(availabilityRatio),
          }}
        ></div>
      </div>
      <p className="text-sm text-[#374151] mt-2">
        {MAX_AVAILABILITY_RATIO
          ? "🎉 모든 재료를 보유하고 있어요!"
          : `🛒 ${missingIngredients.length}개 재료가 더 필요해요`}
      </p>
    </div>
  );
};

export default InventoryStatus;
