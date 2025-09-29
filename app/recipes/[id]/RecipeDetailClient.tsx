"use client";

import {
  XCircle,
  ArrowLeft,
  BookOpen,
  LeafyGreen,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import {
  calculateAvailabilityRatio,
  getMissingIngredients,
} from "@/lib/recipeTransform";
import {
  useRecipe,
  useUserIngredcients,
} from "@/hooks/useRecipeQuery";
import { CookingCompleteModal } from "@/components/CookingCompleteModal";
import RecipeDetailHeader from "./RecipeDetailHeader";
import InventoryStatus from "./InventoryStatus";
import RecipeTip from "./RecipeTip";
import { useRouter, useSearchParams } from "next/navigation";

export default function RecipeDetailClient({ recipeId }: { recipeId: string }) {
  // TODO: 시간 나면 "좋아요" 기능 추가 예정
  // const [isFavorite, setIsFavorite] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "none";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { data: recipe } = useRecipe(recipeId, type);
  const { data: userIngredientList } = useUserIngredcients();

  // AI 레시피인지 판단 (RGTR_ID가 "AI"인지 확인)
  const isAIRecipe = recipe?.userName === "AI 셰프";

  // 레시피가 없을 때 처리
  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-xl font-bold text-[#374151] mb-2">
            레시피를 찾을 수 없어요
          </h2>
          <p className="text-[#6B7280] mb-4">
            레시피가 삭제되었거나 존재하지 않습니다.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleCookingComplete = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 실제 보유율 계산
  const availabilityRatio = calculateAvailabilityRatio({
    recipe,
    userIngredientList,
  });
  const missingIngredients = getMissingIngredients({
    recipe,
    userIngredientList,
  });

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="relative">
        <div className="w-full h-64 lg:h-80 xl:h-96 bg-gray-100 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TODO: 좋아요, 뒤로가기, 공유하기 버튼 */}
        {/* 오버레이 헤더 */}
        {/* <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 lg:p-6">
          <Link
            href="/recipes"
            className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <button className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200">
              <Share className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-current text-[#EF4444]" : ""
                }`}
              />
            </button>
          </div>
        </div> */}

        {/* 그라데이션 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-10">
        {/* 레시피 헤더 정보 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB] mb-8">
          <RecipeDetailHeader recipe={recipe} />

          {/* 재료 보유 현황 */}
          <InventoryStatus
            recipe={recipe}
            availabilityRatio={availabilityRatio}
            missingIngredients={missingIngredients}
          />

          {/* AI 레시피 특별 안내 */}
          {isAIRecipe && (
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-purple-700">
                  AI 맞춤 추천 레시피
                </h4>
              </div>
              <p className="text-purple-600 text-sm">
                이 레시피는 AI가 회원님의 냉장고 재료를 분석해서 특별히 추천한
                조합이에요! 자동으로 저장되어 언제든지 다시 볼 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          {/* 조리법 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#10B981]/10 rounded-xl">
                    <BookOpen className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-[#374151]">
                    조리법
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div
                    key={`recipeId-${recipe.id}-step-${index}`}
                    className={
                      "flex gap-4 p-4 rounded-xl border-2 transition-all duration-200 border-[#E5E7EB] bg-white hover:border-[#10B981]/30"
                    }
                  >
                    <div
                      className={
                        "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base flex-shrink-0 transition-all duration-200 bg-[#E5E7EB] text-[#6B7280]"
                      }
                    >
                      {index + 1}
                    </div>
                    <p className="flex items-center leading-relaxed lg:text-lg flex-1 text-[#374151]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 재료 및 액션 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 필요한 재료 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                <h2 className="lg:text-2xl font-bold text-[#374151] mb-4 flex items-center gap-2">
                  <div className="p-2 bg-[#10B981]/10 rounded-xl">
                    <LeafyGreen className="w-6 h-6 text-[#10B981]" />
                  </div>
                  필요한 재료
                </h2>
                <div className="space-y-3">
                  {recipe.ingredients.map(({ name, quantity }, _) => {
                    const isMissing = missingIngredients.includes(name);
                    const available = !isMissing;
                    const userIngredient = userIngredientList.find(
                      (userIng) =>
                        userIng.name.toLowerCase() === name.toLowerCase()
                    );

                    return (
                      <div
                        key={name}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          available
                            ? "bg-[#F0FDF4] border border-[#10B981]/20"
                            : "bg-[#FEF2F2] border border-[#EF4444]/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {available ? (
                            <CheckCircle className="w-5 h-5 text-[#10B981]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#EF4444]" />
                          )}
                          <span
                            className={`font-medium ${
                              available ? "text-[#047857]" : "text-[#DC2626]"
                            }`}
                          >
                            {name}
                          </span>
                          {available &&
                            userIngredient &&
                            userIngredient.quantity > 0 && (
                              <span className="text-xs text-[#047857] bg-[#DCFCE7] px-2 py-1 rounded-full">
                                보유: {userIngredient.quantity}개
                              </span>
                            )}
                        </div>
                        <span className="text-[#6B7280] text-sm font-medium">
                          {quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="space-y-4">
                <button
                  onClick={handleBackClick}
                  className={`w-full border-2 py-4 rounded-xl font-semibold hover:text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    isAIRecipe
                      ? "bg-white text-purple-600 border-purple-600 hover:bg-purple-600"
                      : "bg-white text-[#10B981] border-[#10B981] hover:bg-[#10B981]"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  {isAIRecipe ? "다른 AI 레시피 보기" : "다른 레시피 보기"}
                </button>
                {availabilityRatio > 50 && (
                <button
                  onClick={handleCookingComplete}
                  className={`w-full py-5 rounded-2xl font-bold text-lg hover:shadow-2xl active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center gap-3 text-white ${
                    isAIRecipe
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "bg-gradient-to-r from-[#10B981] to-[#059669]"
                  }`}
                >
                  🍳 {isAIRecipe ? "AI 레시피" : "요리"} 완성!
                  <div className="text-xl">🎉</div>
                </button>
                )}
              </div>

              {/* 요리 팁 */}
              <RecipeTip difficulty={recipe.difficulty} />

              {/* AI 레시피 추가 정보 */}
              {isAIRecipe && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <span>💾</span>
                    자동 저장됨
                  </h4>
                  <p className="text-purple-600 text-sm">
                    이 AI 레시피는 자동으로 저장되어 전체 레시피 목록에서
                    언제든지 다시 볼 수 있어요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && recipe && (
          <CookingCompleteModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            dishName={recipe.name}
            recipeIngredients={recipe.ingredients}
            userIngredientList={userIngredientList}
            recipeId={recipe.id}
            recipeImageUrl={recipe.imageUrl}
          />
        )}
      </div>
    </div>
  );
}
