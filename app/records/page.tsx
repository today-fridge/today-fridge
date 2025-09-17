import {
  TrendingUp,
  Clock,
  Heart,
  Award,
  Calendar,
  BarChart3,
  Target,
  Sparkles,
} from "lucide-react";

export default function MyRecords() {
  // 샘플 데이터
  const monthlyStats = {
    cookingCount: 12,
    favoriteRecipe: "계란볶음밥",
    mostUsedIngredient: "계란",
    averageCookingTime: 18,
  };

  const recentCookings = [
    {
      id: "1",
      name: "당근볶음",
      date: "2025-08-29",
      rating: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
      cookingTime: 15,
      difficulty: 2,
    },
    {
      id: "2",
      name: "계란볶음밥",
      date: "2025-08-28",
      rating: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop",
      cookingTime: 20,
      difficulty: 3,
    },
    {
      id: "3",
      name: "우유빵",
      date: "2025-08-27",
      rating: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=200&fit=crop",
      cookingTime: 45,
      difficulty: 4,
    },
  ];

  const favoriteRecipes = [
    {
      id: "1",
      name: "계란볶음밥",
      cookingCount: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop",
      averageRating: 4.8,
    },
    {
      id: "2",
      name: "김치찌개",
      cookingCount: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
      averageRating: 4.3,
    },
    {
      id: "3",
      name: "당근볶음",
      cookingCount: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
      averageRating: 4.0,
    },
  ];

  const achievements = [
    {
      id: "1",
      title: "요리 달인",
      description: "이번 달 10회 이상 요리 성공",
      icon: "🏆",
      earned: true,
      earnedDate: "2025-08-25",
    },
    {
      id: "2",
      title: "건강 요리사",
      description: "야채 요리 5회 이상 완성",
      icon: "🥬",
      earned: true,
      earnedDate: "2025-08-20",
    },
    {
      id: "3",
      title: "시간 관리 마스터",
      description: "30분 이내 요리 3회 완성",
      icon: "⏰",
      earned: false,
      earnedDate: null,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#10B981]/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151]">
                내 요리 기록 📊
              </h1>
              <p className="text-[#6B7280]">
                요리 여정을 한눈에 확인하고 성취를 기록하세요
              </p>
            </div>
          </div>
        </div>

        {/* 이번 달 통계 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#374151] mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#10B981]" />
            이번 달 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#10B981]/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#374151]">
                    이번 달 {monthlyStats.cookingCount}회
                  </div>
                  <div className="text-sm text-[#6B7280]">요리 완성</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#EF4444]/10 rounded-xl">
                  <Heart className="w-6 h-6 text-[#EF4444]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#374151] truncate">
                    가장 많이 만든 요리
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {monthlyStats.favoriteRecipe}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F59E0B]/10 rounded-xl">
                  <div className="text-2xl">🥚</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#374151]">
                    가장 많이 사용한 재료
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {monthlyStats.mostUsedIngredient}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                  <Clock className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#374151]">
                    평균 {monthlyStats.averageCookingTime}분
                  </div>
                  <div className="text-sm text-[#6B7280]">요리 시간</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 - 데스크톱: 2열, 모바일: 1열 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          {/* 왼쪽 컬럼 - 최근 요리 & 즐겨찾기 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 최근 만든 요리 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#374151] mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#10B981]" />
                최근 만든 요리
              </h3>
              <div className="space-y-4">
                {recentCookings.map((cooking) => (
                  <div
                    key={cooking.id}
                    className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl hover:bg-[#F3F4F6] transition-colors duration-200"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={cooking.imageUrl}
                        alt={cooking.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#374151]">
                          {cooking.name}
                        </h4>
                        <span className="text-sm text-[#6B7280] bg-white px-2 py-1 rounded-md">
                          {formatDate(cooking.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-[#F59E0B] text-sm">
                          {renderStars(cooking.rating)}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          ⏱️ {cooking.cookingTime}분
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          {"★".repeat(cooking.difficulty)} 난이도
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 즐겨찾기 레시피 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#374151] mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#EF4444]" />
                즐겨찾기 레시피
              </h3>
              <div className="space-y-4">
                {favoriteRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex gap-4 p-4 bg-[#F9FAFB] rounded-xl hover:bg-[#F3F4F6] transition-colors duration-200"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#374151] mb-1">
                          {recipe.name}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#6B7280]">
                            🍳 {recipe.cookingCount}번 요리
                          </span>
                          <span className="text-sm text-[#F59E0B]">
                            ⭐ {recipe.averageRating}
                          </span>
                        </div>
                      </div>
                      <Heart className="w-5 h-5 text-[#EF4444] fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 성취도 & 뱃지 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 성취도 뱃지 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#374151] mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                성취도 뱃지
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      achievement.earned
                        ? "border-[#10B981] bg-[#F0FDF4]"
                        : "border-[#E5E7EB] bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`text-2xl ${
                          achievement.earned ? "" : "grayscale opacity-50"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            achievement.earned
                              ? "text-[#047857]"
                              : "text-[#6B7280]"
                          }`}
                        >
                          {achievement.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            achievement.earned
                              ? "text-[#065F46]"
                              : "text-[#6B7280]"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {achievement.earned && achievement.earnedDate && (
                      <div className="text-xs text-[#047857] bg-[#DCFCE7] px-2 py-1 rounded-md inline-block">
                        🎉 {formatDate(achievement.earnedDate)} 획득
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 이번 주 목표 */}
            <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="font-bold text-lg">이번 주 목표</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">새로운 요리 도전</span>
                  <span className="text-sm font-bold">2/3</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-[#F59E0B] h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-xs text-white/90">
                  새로운 레시피 1개만 더 도전하면 목표 달성! 💪
                </p>
              </div>
            </div>

            {/* 요리 팁 */}
            <div className="bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-2xl p-6">
              <h4 className="font-bold text-[#92400E] mb-3 flex items-center gap-2">
                <span>💡</span>
                오늘의 요리 팁
              </h4>
              <p className="text-[#92400E] text-sm leading-relaxed">
                요리를 자주 기록할수록 AI가 더 정확한 맞춤 레시피를 추천해줄 수
                있어요. 요리 후 평점과 후기를 남겨보세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
