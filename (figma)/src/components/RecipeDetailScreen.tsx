import { Heart, Clock, Users, ChefHat, CheckCircle, XCircle, ArrowLeft, Share, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Recipe, Screen } from '../types';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  onNavigate: (screen: Screen) => void;
  onCookingComplete: () => void;
}

export default function RecipeDetailScreen({ recipe, onNavigate, onCookingComplete }: RecipeDetailScreenProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.steps.length).fill(false));

  const toggleStepComplete = (index: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[index] = !newCompleted[index];
    setCompletedSteps(newCompleted);
  };

  const completedCount = completedSteps.filter(Boolean).length;
  const progressPercentage = (completedCount / recipe.steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 히어로 이미지 */}
      <div className="relative">
        <div className="w-full h-64 lg:h-80 xl:h-96 bg-gray-100 overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 오버레이 헤더 */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 lg:p-6">
          <button 
            onClick={() => onNavigate('recipe-search')}
            className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200">
              <Share className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-200"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-[#EF4444]' : ''}`} />
            </button>
          </div>
        </div>

        {/* 그라데이션 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* 레시피 헤더 정보 */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB] mb-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold text-[#374151] mb-3">{recipe.name}</h1>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#10B981]" />
                <span className="text-[#6B7280]">
                  {'★'.repeat(recipe.difficulty)} 
                  <span className="ml-1">
                    {recipe.difficulty <= 2 ? '쉬움' : recipe.difficulty === 3 ? '보통' : '어려움'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#10B981]" />
                <span className="text-[#6B7280]">{recipe.cookingTime}분</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#10B981]" />
                <span className="text-[#6B7280]">{recipe.servings}인분</span>
              </div>
            </div>
          </div>

          {/* 재료 보유 현황 */}
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#F0FDF4]/50 border border-[#10B981]/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#047857]">재료 보유 현황</span>
              <span className="text-[#047857] font-bold">
                {recipe.availableIngredients}/{recipe.totalIngredients}개
              </span>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
                style={{ width: `${(recipe.availableIngredients / recipe.totalIngredients) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-[#047857] mt-2">
              {recipe.availableIngredients === recipe.totalIngredients 
                ? '🎉 모든 재료를 보유하고 있어요!' 
                : `🛒 ${recipe.totalIngredients - recipe.availableIngredients}개 재료가 더 필요해요`
              }
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 - 데스크톱: 2열, 모바일: 1열 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          {/* 조리법 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#10B981]/10 rounded-xl">
                    <BookOpen className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-[#374151]">조리법</h2>
                </div>
                {completedCount > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-[#6B7280]">진행률</div>
                    <div className="text-lg font-bold text-[#10B981]">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                )}
              </div>

              {/* 진행률 바 */}
              {completedCount > 0 && (
                <div className="mb-6">
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                      completedSteps[index] 
                        ? 'border-[#10B981] bg-[#F0FDF4]' 
                        : 'border-[#E5E7EB] bg-white hover:border-[#10B981]/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleStepComplete(index)}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base flex-shrink-0 transition-all duration-200 ${
                        completedSteps[index]
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#E5E7EB] text-[#6B7280] hover:bg-[#10B981] hover:text-white'
                      }`}
                    >
                      {completedSteps[index] ? '✓' : index + 1}
                    </button>
                    <p className={`leading-relaxed lg:text-lg flex-1 ${
                      completedSteps[index] 
                        ? 'text-[#047857] line-through' 
                        : 'text-[#374151]'
                    }`}>
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-bold text-[#374151] mb-4 flex items-center gap-2">
                <span className="text-[#10B981]">🥬</span>
                필요한 재료
              </h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      ingredient.available 
                        ? 'bg-[#F0FDF4] border border-[#10B981]/20' 
                        : 'bg-[#FEF2F2] border border-[#EF4444]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {ingredient.available ? (
                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#EF4444]" />
                      )}
                      <span className={`font-medium ${
                        ingredient.available ? 'text-[#047857]' : 'text-[#DC2626]'
                      }`}>
                        {ingredient.name}
                      </span>
                    </div>
                    <span className="text-[#6B7280] text-sm font-medium">
                      {ingredient.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('recipe-search')}
                className="w-full bg-white text-[#10B981] border-2 border-[#10B981] py-4 rounded-xl font-semibold hover:bg-[#10B981] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                다른 레시피 보기
              </button>
              <button
                onClick={onCookingComplete}
                className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
              >
                🍳 요리 완성!
                <div className="text-xl">🎉</div>
              </button>
            </div>

            {/* 요리 팁 */}
            <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#F59E0B]/20 rounded-xl p-4">
              <h4 className="font-semibold text-[#92400E] mb-2 flex items-center gap-2">
                <span>💡</span>
                요리 팁
              </h4>
              <p className="text-[#92400E] text-sm">
                {recipe.difficulty <= 2 
                  ? '간단한 레시피예요! 천천히 따라하시면 완벽한 요리가 완성됩니다.'
                  : recipe.difficulty === 3
                  ? '중간 난이도 레시피입니다. 각 단계를 차근차근 따라해보세요.'
                  : '고급 레시피입니다. 시간을 충분히 두고 정성스럽게 만들어보세요.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}