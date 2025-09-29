"use client";

import { useMemo, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useUserIngredcients } from "@/hooks/useRecipeQuery";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  calculateAvailabilityRatio,
  getMissingIngredients,
  sortRecipesByAvailability,
} from "@/lib/recipeTransform";

const AiRecommendedRecipeClient = () => {
  const { data: userIngredientList } = useUserIngredcients();
  const ref = useRef(null);

  const {
    data: aiRecipes,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["generateAIRecipes"],
    queryFn: async () => {
      const ingredientNames = availableIngredients
        .map((ing) => ing.name)
        .join(", ");

      const response = await fetch("/api/recipes/ai-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availableIngredients: ingredientNames,
          ingredientDetails: availableIngredients,
          requestCount: 3,
        }),
      });

      if (response.status === 404) {
        return { items: [] };
      }

      if (!response.ok) {
        throw new Error("재료를 불러오지 못했습니다.");
      }

      return await response.json();
    },
    select: (data) => {
      return data.recipes as Recipe[];
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  // 실제 보유 가능한 재료만 필터링
  const availableIngredients = useMemo(() => {
    return userIngredientList.filter(
      (ingredient) => ingredient.available && ingredient.quantity > 0
    );
  }, [userIngredientList]);

  // AI 레시피 생성 함수
  const generateAIRecipes = async () => {
    if (availableIngredients.length === 0) {
      alert("냉장고에 재료를 먼저 추가해주세요!");
      return;
    }

    refetch();
  };

  // 보유율 높은 순으로 정렬하여 상위 3개만
  const recommendedRecipes = sortRecipesByAvailability(
    aiRecipes ?? [],
    userIngredientList
  ).map((recipe) => ({
    ...recipe,
    availability: calculateAvailabilityRatio({ recipe, userIngredientList }),
    missingIngredients: getMissingIngredients({ recipe, userIngredientList }),
  }));

  return (
    <div className="space-y-6 mb-12">
      {/* AI 추천 헤더 */}
      <div className="text-center mb-8">
        <button
          onClick={generateAIRecipes}
          disabled={isFetching || availableIngredients.length === 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {aiRecipes
                ? "새로운 레시피 생성 중..."
                : "AI가 레시피를 생각하고 있어요..."}
            </>
          ) : availableIngredients.length === 0 ? (
            <>
              <Sparkles className="w-5 h-5" />
              재료를 먼저 추가해주세요
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {aiRecipes ? "다른 레시피 추천받기" : "AI 레시피 추천받기"}
            </>
          )}
        </button>
      </div>

      {/* AI 추천 레시피 목록 */}
      {recommendedRecipes && (
        <div className="space-y-6" ref={ref}>
          {recommendedRecipes.length > 0 ? (
            recommendedRecipes.map((recipe, index) => (
              <div key={`${recipe.name}__${recipe.id}`} className="relative">
                <RecipeCard
                  recipe={recipe}
                  userIngredientList={availableIngredients}
                  layout="list"
                  showRanking={true}
                  rankingIndex={index}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-[#374151] mb-2">
                AI가 레시피를 준비 중이에요
              </h3>
              <p className="text-[#6B7280]">
                보유 재료로 만들 수 있는 맛있는 요리를 찾고 있어요!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 재료 부족 안내 */}
      {availableIngredients.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 text-center">
          <div className="text-4xl mb-3">🥺</div>
          <h3 className="font-semibold text-[#374151] mb-2">
            냉장고가 비어있어요
          </h3>
          <p className="text-[#6B7280] text-sm mb-4">
            AI가 추천할 수 있는 재료를 먼저 추가해주세요!
          </p>
          <Link
            href="/"
            className="bg-[#10B981] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#059669] transition-colors inline-block"
          >
            냉장고에 재료 추가하기
          </Link>
        </div>
      )}

      {/* AI 레시피 저장 안내 */}
      {aiRecipes && aiRecipes.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 text-center">
          <h4 className="font-semibold text-blue-700 mb-1">
            생성된 AI 레시피는 저장됩니다!
          </h4>
          <p className="text-blue-600 text-sm">
            이제 언제든지 전체 레시피 목록에서 다시 볼 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
};

export default AiRecommendedRecipeClient;
