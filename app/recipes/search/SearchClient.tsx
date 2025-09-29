"use client";

import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import {
  calculateAvailabilityRatio,
  getMissingIngredients,
} from "@/lib/recipeTransform";
import {
  useAllAiRecipes,
  useAllRecipes,
  useUserIngredcients,
} from "@/hooks/useRecipeQuery";
import Link from "next/link";

const SearchClient = () => {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: recipes } = useAllRecipes();
  const { data: aiRecipes } = useAllAiRecipes();

  const { data: userIngredientList } = useUserIngredcients();

  const filters = ["전체", "쉬움", "보통", "어려움"];
  const processedRecipes = useMemo(() => {
    return recipes.concat(aiRecipes).map((recipe) => ({
      ...recipe,
      availabilityRatio: calculateAvailabilityRatio({
        recipe,
        userIngredientList,
      }),
      missingIngredients: getMissingIngredients({ recipe, userIngredientList }),
    }));
  }, [recipes, userIngredientList]);

  const filteredRecipes = useMemo(() => {
    let filtered = processedRecipes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(query)
          )
      );
    }

    if (activeFilter !== "전체") {
      filtered = filtered.filter((recipe) => {
        switch (activeFilter) {
          case "쉬움":
            return recipe.difficulty <= 2;
          case "보통":
            return recipe.difficulty === 3;
          case "어려움":
            return recipe.difficulty >= 4;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => b.availabilityRatio - a.availabilityRatio);
  }, [processedRecipes, searchQuery, activeFilter]);

  return (
    <>
      {/* 검색 및 필터 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] mb-4">
        {/* 검색바 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="레시피나 재료명을 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#10B981] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* 난이도 필터 */}
        <div>
          <h3 className="text-sm font-semibold text-[#374151] mb-3">난이도</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-[#6B7280]">
              {searchQuery ? `"${searchQuery}" 검색 결과: ` : "전체 레시피: "}
              <span className="font-semibold text-[#10B981]">
                {filteredRecipes.length}개
              </span>
            </span>
          </div>
          <div className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full">
            재료 보유율 순 정렬
          </div>
        </div>
      </div>
      <div className="space-y-6 my-3 sticky top-19 z-10 bg-white">
        <Link
          href="/recipes/ai"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center md:justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden md:block">
            혹시 여기에서도 원하시는 레시피가 없으신가요?
          </span>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI 레시피 추천받기</span>
          </div>
        </Link>
      </div>
      {/* 레시피 그리드 */}
      {filteredRecipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              userIngredientList={userIngredientList}
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🥺</div>
          <h3 className="text-xl font-semibold text-[#374151] mb-2">
            검색 결과가 없어요
          </h3>
          <p className="text-[#6B7280] mb-6">
            다른 재료나 레시피명으로 검색해보시거나
            <br />
            필터를 조정해보세요
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("전체");
            }}
            className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200"
          >
            전체 레시피 보기
          </button>
        </div>
      )}
    </>
  );
};

export default SearchClient;
