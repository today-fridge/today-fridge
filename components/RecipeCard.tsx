import { Clock, Users, Star, XCircle, SquareUserRound } from "lucide-react";
import Link from "next/link";
import { Recipe, RecipeIngredientInfo } from "@/types";
import {
  calculateAvailabilityRatio,
  getAvailabilityBgColor,
  getAvailabilityColor,
  getDifficultyText,
  getMissingIngredients,
} from "@/lib/recipeTransform";

interface RecipeCardProps {
  recipe: Recipe;
  ingredients: RecipeIngredientInfo[];
  layout?: "grid" | "list";
  showRanking?: boolean;
  rankingIndex?: number;
}

export default function RecipeCard({
  recipe,
  ingredients: userIngredientList,
  layout = "grid",
  showRanking = false,
  rankingIndex = 0,
}: RecipeCardProps) {
  const availabilityRatio = calculateAvailabilityRatio({
    recipe,
    userIngredientList,
  });
  const missingIngredients = getMissingIngredients({
    recipe,
    userIngredientList,
  });

  // Grid layout
  if (layout === "grid") {
    return (
      <Link
        href={`/recipes/${recipe.id}`}
        className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] cursor-pointer hover:shadow-lg hover:border-[#10B981]/20 active:scale-[0.98] transition-all duration-200"
      >
        {/* 재료 보유율 배지 */}
        <div className="relative mb-4">
          <div className="w-full h-40 rounded-xl bg-gray-100 overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-sm"
            style={{
              backgroundColor: getAvailabilityBgColor(availabilityRatio),
              color: getAvailabilityColor(availabilityRatio),
            }}
          >
            보유율 {availabilityRatio}%
          </div>
          {availabilityRatio === 100 && (
            <div className="absolute top-3 left-3 bg-[#10B981] text-white px-2 py-1 rounded-full text-xs font-medium">
              ✨ 완벽
            </div>
          )}
        </div>

        {/* 레시피 정보 */}
        <div>
          <h2 className="font-bold text-[#374151] mb-2 text-lg">
            {recipe.name}
          </h2>

          {/* 주요 재료 */}
          <div className="mb-3">
            <p className="text-sm text-[#6B7280]">
              <span className="font-medium">주재료:</span>{" "}
              {recipe.ingredients
                .slice(0, 3)
                .map((ing) => ing.name)
                .join(", ")}
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="flex items-center gap-4 mb-4 text-sm text-[#6B7280]">
            <div className="flex items-center gap-1">
              <span className="flex items-center text-[#6B7280]">
                {Array.from({ length: recipe.difficulty }, (_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2">
                  {getDifficultyText(recipe.difficulty)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime}분</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}인분</span>
            </div>
          </div>

          {/* 재료 보유 현황 */}
          <div className="bg-[#F9FAFB] rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#374151] font-medium">
                  재료 보유 현황
                </span>
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

              <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${availabilityRatio}%`,
                    backgroundColor: getAvailabilityColor(availabilityRatio),
                  }}
                ></div>
              </div>

              {/* 부족한 재료 표시 */}
              {missingIngredients.length > 0 && (
                <div className="mt-2 text-xs bg-[#FEF2F2] text-[#EF4444] p-2 rounded-lg flex gap-1">
                  <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#EF4444] font-medium break-words">
                    부족:&nbsp;
                    {missingIngredients.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List layout
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E5E7EB] cursor-pointer hover:shadow-lg hover:border-[#10B981]/30 active:scale-[0.98] transition-all duration-200 relative overflow-hidden block"
    >
      {/* 순위 배지 */}
      {showRanking && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-[#374151] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {rankingIndex + 1}
          </div>
        </div>
      )}

      {/* 레시피 콘텐츠 */}
      <div className={`${showRanking ? "pt-12 md:pt-0" : ""}`}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
          {/* 레시피 이미지 */}
          <div className="w-full md:w-64 md:flex-shrink-0">
            <div className="w-full h-48 md:h-56 rounded-xl bg-gray-100 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 레시피 정보 */}
          <div className="flex-1 space-y-4 min-w-0 w-full md:w-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#374151] mb-2 break-words">
                {recipe.name}
              </h2>

              {/* 주요 재료 */}
              <p className="text-[#6B7280] mb-4 text-sm sm:text-base break-words">
                <span className="font-medium">주재료:</span>{" "}
                {recipe.ingredients
                  .slice(0, 4)
                  .map((ing) => ing.name)
                  .join(", ")}
              </p>

              {/* 기본 정보 */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 text-sm text-[#6B7280]">
                <div className="flex items-center gap-1">
                  <span className="flex items-center">
                    {Array.from({ length: recipe.difficulty }, (_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="ml-2">
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{recipe.cookingTime}분</span>
                </div>
                <div className="flex items-center gap-1">
                  <SquareUserRound className="w-4 h-4 flex-shrink-0" />
                  <span>{recipe.userName}</span>
                </div>
              </div>
            </div>

            {/* 재료 보유 현황 */}
            <div className="bg-[#F9FAFB] rounded-xl p-3 md:p-4 w-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151] font-medium">
                    재료 보유 현황
                  </span>
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

                <div className="w-full bg-[#F3F4F6] rounded-full h-2 md:h-3">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${availabilityRatio}%`,
                      backgroundColor: getAvailabilityColor(availabilityRatio),
                    }}
                  ></div>
                </div>

                {/* 부족한 재료 표시 */}
                {missingIngredients.length > 0 && (
                  <div className="mt-2 text-xs bg-[#FEF2F2] text-[#EF4444] p-2 rounded-lg flex gap-1">
                    <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#EF4444] font-medium break-words">
                      부족:&nbsp;
                      {missingIngredients.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
