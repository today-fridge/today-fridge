"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const AiRecommendedRecipeClient = dynamic(
  () => import("./AiRecommendedRecipeClient"),
  {
    ssr: false,
  }
);

export default function AiRecipeRecommendation() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#374151] mb-4">
            AI 레시피 추천
          </h1>
          <p className="text-[#6B7280] text-base sm:text-lg">
            AI가 당신의 냉장고 재료를 분석해서 맞춤 레시피를 추천해드려요!
            <br />
            다만, AI이기에 가끔 실수할 수 있다는 점을 인지해주세요.
          </p>
        </div>

        {/* 추천 레시피 카드들 */}
        <AiRecommendedRecipeClient />

        {/* 안내 메시지 */}
        <div className="mt-5 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-[#374151] mb-2">
              더 정확한 AI 추천을 위해
            </h3>
            <p className="text-[#6B7280] text-sm mb-4">
              냉장고에 재료를 더 추가하시면 AI가 더욱 맞춤형 레시피를
              추천드려요!
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
