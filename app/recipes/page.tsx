"use client";

import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import {
  calculateAvailabilityRatio,
  getMissingIngredients,
  sortRecipesByAvailability,
} from "@/lib/recipeTransform";
import { useAllRecipes, useUserIngredcients } from "@/hooks/useRecipeQuery";

export default function RecipeRecommendation() {
  const { data: recipes } = useAllRecipes();
  const { data: userIngredientList } = useUserIngredcients();

  // 보유율 높은 순으로 정렬하여 상위 3개만
  const recommendedRecipes = sortRecipesByAvailability(
    recipes,
    userIngredientList
  )
    .map((recipe) => ({
      ...recipe,
      availability: calculateAvailabilityRatio({ recipe, userIngredientList }),
      missingIngredients: getMissingIngredients({ recipe, userIngredientList }),
    }))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#374151] mb-4">
            🔍 레시피 추천
          </h1>
          <p className="text-[#6B7280] text-base sm:text-lg">
            현재 보유 재료로 바로 만들 수 있는 요리들이에요!
          </p>
        </div>

        {/* 추천 레시피 카드들 */}

        <div className="space-y-6 mb-12">
          {recommendedRecipes.map((recipe, index) => {
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                userIngredientList={userIngredientList}
                layout="list"
                showRanking={true}
                rankingIndex={index}
              />
            );
          })}
        </div>

        {/* 더 많은 레시피 버튼 */}
        <div className="text-center">
          <Link
            href="/recipes/search"
            className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5 rounded-2xl font-semibold text-base sm:text-lg lg:text-xl hover:shadow-lg active:scale-95 transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
          >
            🔍 더 많은 레시피가 보고싶으신가요?
          </Link>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-5 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-[#374151] mb-2">
              더 정확한 추천을 위해
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              냉장고에 재료를 더 추가하시면 맞춤 추천이 더욱 정확해져요!
            </p>
            <Link
              href="/"
              className="bg-[#F0FDF4] text-[#10B981] px-4 py-2 rounded-lg font-medium hover:bg-[#DCFCE7] transition-colors inline-block"
            >
              냉장고 관리하러 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
