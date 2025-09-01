import Link from "next/link";
import {
  TrendingUp,
  AlertCircle,
  RefrigeratorIcon,
  Sparkles,
} from "lucide-react";
import {
  initialIngredients as ingredients,
  sampleRecipes as recipes,
} from "@/data/sampleData";

export default function Home() {
  const expiringSoon = ingredients.filter((item) => item.daysLeft <= 3);
  const totalIngredients = ingredients.length;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-20 md:pb-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#374151] mb-2">
            당신의 냉장고가 <span className="text-[#10B981]">스마트</span>
            해집니다
          </h1>
          <p className="text-[#6B7280] text-lg lg:text-xl mb-6">
            신선한 재료로 건강한 요리를 만들어보세요
          </p>
          <Link
            href="/fridge"
            className="inline-block bg-[#10B981] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 lg:px-12 lg:py-4 lg:text-lg"
          >
            시작하기 🚀
          </Link>
        </div>

        {/* 메인 대시보드 - 반응형 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 냉장고 현황 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] h-full hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#10B981]/10 rounded-xl">
                  <RefrigeratorIcon className="w-6 h-6 text-[#10B981]" />
                </div>
                <h2 className="text-lg font-semibold text-[#374151]">
                  내 냉장고 현황
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-[#FEF2F2] rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                    <span className="text-[#374151] font-medium">
                      유통기한 임박
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#EF4444]">
                    {expiringSoon.length}개
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F0FDF4] rounded-xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    <span className="text-[#374151] font-medium">총 재료</span>
                  </div>
                  <span className="text-2xl font-bold text-[#10B981]">
                    {totalIngredients}개
                  </span>
                </div>
              </div>

              <Link
                href="/fridge"
                className="block w-full bg-[#10B981] text-white py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md text-center"
              >
                냉장고 관리하기
              </Link>
            </div>
          </div>

          {/* 오늘 추천 레시피 */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-[#374151] mb-2">
                오늘 뭐 먹을까? 🤔
              </h2>
              <p className="text-[#6B7280]">
                보유하신 재료로 만들 수 있는 맛있는 레시피들이에요
              </p>
            </div>

            <div className="space-y-4">
              {recipes.slice(0, 3).map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:border-[#10B981]/20 active:scale-[0.98] transition-all duration-200">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#374151] mb-2 text-lg truncate">
                          {recipe.name}
                        </h3>
                        <div className="mb-2">
                          <p className="text-xs text-[#6B7280]">
                            <span className="font-medium">주재료:</span>{" "}
                            {recipe.ingredients
                              .slice(0, 3)
                              .map((ing) => ing.name)
                              .join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-sm text-[#6B7280]">
                          <span className="flex items-center gap-1">
                            {"⭐".repeat(recipe.difficulty)}
                          </span>
                          <span>⏱️ {recipe.cookingTime}분</span>
                          <span>👥 {recipe.servings}인분</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#F0FDF4] px-3 py-1 rounded-full">
                            <span className="text-[#10B981] text-sm">
                              ✅ {recipe.availableIngredients}개 보유
                            </span>
                          </div>
                          <span className="text-[#6B7280] text-sm">
                            / {recipe.totalIngredients}개 필요
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* AI 추천 특별 카드 */}
            <Link href="/ai-recommend" className="block mt-6">
              <div className="bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-2xl p-6 text-white hover:shadow-lg active:scale-[0.98] transition-all duration-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-transparent"></div>
                <div className="relative flex items-center gap-4">
                  <div className="text-4xl lg:text-5xl">🤖</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                      <h3 className="font-semibold text-lg lg:text-xl">
                        AI 맞춤 레시피 추천
                      </h3>
                    </div>
                    <p className="text-white/90 text-sm lg:text-base">
                      냉장고 재료를 분석해서 특별한 레시피를 추천해드려요!
                    </p>
                  </div>
                  <div className="hidden lg:block text-2xl opacity-50">→</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-semibold text-[#374151] mb-2">신선한 관리</h3>
            <p className="text-[#6B7280] text-sm">
              유통기한을 자동으로 추적해서 음식 낭비를 줄여요
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="font-semibold text-[#374151] mb-2">맞춤 레시피</h3>
            <p className="text-[#6B7280] text-sm">
              보유 재료를 기반으로 한 개인화된 요리 추천
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-[#374151] mb-2">요리 기록</h3>
            <p className="text-[#6B7280] text-sm">
              요리 히스토리를 기록하고 성취감을 느껴보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
