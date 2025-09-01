import { Sparkles, Brain, RefreshCw, ChefHat, Lightbulb, Heart } from 'lucide-react';
import { Ingredient, Recipe, Screen } from '../types';

interface AIRecommendScreenProps {
  ingredients: Ingredient[];
  onNavigate: (screen: Screen) => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

export default function AIRecommendScreen({ ingredients, onNavigate, onRecipeSelect }: AIRecommendScreenProps) {
  // AI 추천 레시피 (실제 구현에서는 AI API 호출)
  const aiRecommendedRecipe: Recipe = {
    id: 'ai-1',
    name: '당근 오믈렛',
    difficulty: 2,
    cookingTime: 15,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    ingredients: [
      { name: '계란', quantity: '2개', available: true },
      { name: '당근', quantity: '1/2개', available: true },
      { name: '우유', quantity: '2큰술', available: true },
      { name: '소금', quantity: '조금', available: false }
    ],
    steps: [
      '당근을 얇게 채 썰어 준비합니다.',
      '계란을 볼에 깨뜨려 우유와 함께 잘 풀어줍니다.',
      '팬에 기름을 두르고 당근을 먼저 볶아줍니다.',
      '계란물을 부어 오믈렛 모양으로 만듭니다.',
      '접시에 담고 소금으로 간을 맞춰 완성합니다.'
    ],
    availableIngredients: 3,
    totalIngredients: 4
  };

  const urgentIngredients = ingredients.filter(ing => ing.daysLeft <= 3);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151]">
                AI 맞춤 레시피 추천 🤖
              </h1>
              <p className="text-[#6B7280]">인공지능이 당신만을 위한 특별한 레시피를 추천해요</p>
            </div>
          </div>
        </div>

        {/* AI 캐릭터 섹션 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB] mb-8">
          <div className="text-center mb-6">
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="text-6xl lg:text-7xl">🤖</div>
            </div>
            <div className="relative inline-block">
              <div className="bg-[#F0FDF4] border-2 border-[#10B981]/20 rounded-2xl p-4 lg:p-6">
                <p className="text-[#374151] text-lg lg:text-xl font-medium">
                  안녕하세요! 저는 당신의 전용 AI 요리사입니다! 🍳
                </p>
                <p className="text-[#6B7280] text-sm lg:text-base mt-2">
                  냉장고 재료를 분석해서 건강하고 맛있는 레시피를 추천해드릴게요
                </p>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-[#10B981]/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 재료 분석 섹션 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#10B981]/10 rounded-xl">
              <Brain className="w-6 h-6 text-[#10B981]" />
            </div>
            <h2 className="text-xl font-bold text-[#374151]">냉장고 재료 분석 결과</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 보유 재료 */}
            <div>
              <h3 className="font-semibold text-[#374151] mb-3 flex items-center gap-2">
                <span className="text-[#10B981]">✅</span>
                보유 재료 ({ingredients.length}개)
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.slice(0, 8).map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="bg-[#10B981] text-white px-3 py-2 rounded-full text-sm font-medium shadow-sm"
                  >
                    {ingredient.emoji} {ingredient.name}
                  </div>
                ))}
                {ingredients.length > 8 && (
                  <div className="bg-[#E5E7EB] text-[#6B7280] px-3 py-2 rounded-full text-sm font-medium">
                    +{ingredients.length - 8}개 더
                  </div>
                )}
              </div>
            </div>

            {/* 긴급 처리 재료 */}
            {urgentIngredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-[#374151] mb-3 flex items-center gap-2">
                  <span className="text-[#EF4444]">⚠️</span>
                  긴급 처리 필요 ({urgentIngredients.length}개)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {urgentIngredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-[#EF4444] text-white px-3 py-2 rounded-full text-sm font-medium shadow-sm"
                    >
                      {ingredient.emoji} {ingredient.name} (D-{ingredient.daysLeft})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI 추천 레시피 카드 */}
        <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-1 mb-8 shadow-lg">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#F59E0B]/10 rounded-xl">
                <Lightbulb className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#374151]">🎯 AI 맞춤 추천 레시피</h3>
                <p className="text-[#6B7280] text-sm">재료 분석을 통한 최적의 레시피를 찾았어요!</p>
              </div>
            </div>

            <div 
              onClick={() => {
                onRecipeSelect(aiRecommendedRecipe);
                onNavigate('recipe-detail');
              }}
              className="bg-gradient-to-r from-[#F59E0B]/5 to-[#10B981]/5 border-2 border-[#F59E0B]/20 rounded-xl p-5 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                  <img 
                    src={aiRecommendedRecipe.imageUrl} 
                    alt={aiRecommendedRecipe.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-[#374151]">{aiRecommendedRecipe.name}</h4>
                    <div className="px-2 py-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full">
                      AI 추천
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      {'★'.repeat(aiRecommendedRecipe.difficulty)} 난이도
                    </span>
                    <span>⏱️ {aiRecommendedRecipe.cookingTime}분</span>
                    <span>👥 {aiRecommendedRecipe.servings}인분</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-[#F0FDF4] px-3 py-1 rounded-full">
                      <Heart className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#10B981] text-sm font-medium">
                        {aiRecommendedRecipe.availableIngredients}/{aiRecommendedRecipe.totalIngredients}개 보유
                      </span>
                    </div>
                    <span className="text-sm text-[#6B7280]">완성도 {Math.round((aiRecommendedRecipe.availableIngredients / aiRecommendedRecipe.totalIngredients) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 추천 이유 */}
            <div className="mt-4 p-4 bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h4 className="font-semibold text-[#92400E] mb-1">AI 추천 이유</h4>
                  <p className="text-[#92400E] text-sm">
                    보유한 당근, 계란, 우유를 최대한 활용하는 레시피입니다. 
                    영양가가 높고 조리시간이 짧아 바쁜 일상에 완벽해요! 
                    {urgentIngredients.length > 0 && ' 유통기한 임박 재료도 효과적으로 활용할 수 있어요.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => {
              onRecipeSelect(aiRecommendedRecipe);
              onNavigate('recipe-detail');
            }}
            className="bg-[#10B981] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <ChefHat className="w-5 h-5" />
            상세 레시피 보기
          </button>
          <button className="bg-white text-[#10B981] border-2 border-[#10B981] py-4 rounded-xl font-semibold text-lg hover:bg-[#10B981]/5 transition-all duration-200 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5" />
            다시 추천받기
          </button>
        </div>

        {/* AI 요리사 팁 */}
        <div className="bg-gradient-to-r from-[#10B981]/5 to-[#059669]/5 border border-[#10B981]/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">💡</div>
            <h3 className="text-lg font-bold text-[#047857]">AI 요리사의 스마트 팁</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3 text-[#047857] text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold">•</span>
                <span>유통기한 임박 재료를 우선 활용한 레시피를 추천해요</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold">•</span>
                <span>난이도와 조리시간을 고려한 맞춤형 제안을 해드려요</span>
              </div>
            </div>
            <div className="space-y-3 text-[#047857] text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold">•</span>
                <span>계속 사용하면 취향을 학습해서 더 정확해져요</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold">•</span>
                <span>영양 균형과 칼로리까지 고려한 건강한 레시피만 추천해요</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}