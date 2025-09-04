import { Search, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Recipe, Screen, Ingredient } from '../types';

interface AllRecipesScreenProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onNavigate: (screen: Screen) => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

export default function AllRecipesScreen({ 
  recipes, 
  ingredients,
  onNavigate, 
  onRecipeSelect
}: AllRecipesScreenProps) {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['전체', '쉬움', '보통', '어려움'];

  // 재료 보유율 계산
  const calculateAvailabilityRatio = (recipe: Recipe) => {
    const availableCount = recipe.ingredients.filter(ing => 
      ingredients.some(userIng => userIng.name === ing.name && userIng.available)
    ).length;
    return Math.round((availableCount / recipe.ingredients.length) * 100);
  };

  // 부족한 재료 찾기
  const getMissingIngredients = (recipe: Recipe) => {
    return recipe.ingredients.filter(ing => 
      !ingredients.some(userIng => userIng.name === ing.name && userIng.available)
    ).map(ing => ing.name);
  };

  const filteredRecipes = recipes
    .map(recipe => ({
      ...recipe,
      availabilityRatio: calculateAvailabilityRatio(recipe),
      missingIngredients: getMissingIngredients(recipe)
    }))
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesFilter = true;
      if (activeFilter === '쉬움') matchesFilter = recipe.difficulty <= 2;
      else if (activeFilter === '보통') matchesFilter = recipe.difficulty === 3;
      else if (activeFilter === '어려움') matchesFilter = recipe.difficulty >= 4;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.availabilityRatio - a.availabilityRatio); // 재료 보유율 높은 순으로 정렬

  const getAvailabilityColor = (ratio: number) => {
    if (ratio >= 80) return '#10B981';
    if (ratio >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getAvailabilityBgColor = (ratio: number) => {
    if (ratio >= 80) return '#F0FDF4';
    if (ratio >= 50) return '#FFFBEB';
    return '#FEF2F2';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate('recipe-search')}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#6B7280]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍽️</div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151]">
                전체 레시피 모음
              </h1>
            </div>
          </div>
          <p className="text-[#6B7280] ml-14">보유 재료 순으로 정렬된 모든 레시피를 확인해보세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] mb-6">
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
                      ? 'bg-[#10B981] text-white shadow-sm'
                      : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151]'
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
                {searchQuery ? `"${searchQuery}" 검색 결과: ` : '전체 레시피: '}
                <span className="font-semibold text-[#10B981]">{filteredRecipes.length}개</span>
              </span>
            </div>
            <div className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full">
              재료 보유율 순 정렬
            </div>
          </div>
        </div>

        {/* 레시피 그리드 */}
        {filteredRecipes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  onRecipeSelect(recipe);
                  onNavigate('recipe-detail');
                }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] cursor-pointer hover:shadow-lg hover:border-[#10B981]/20 active:scale-[0.98] transition-all duration-200"
              >
                {/* 재료 보유율 배지 */}
                <div className="relative mb-4">
                  <div className="w-full h-40 rounded-xl bg-gray-100 overflow-hidden">
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-sm"
                    style={{ 
                      backgroundColor: getAvailabilityBgColor(recipe.availabilityRatio),
                      color: getAvailabilityColor(recipe.availabilityRatio)
                    }}
                  >
                    보유율 {recipe.availabilityRatio}%
                  </div>
                  {recipe.availabilityRatio === 100 && (
                    <div className="absolute top-3 left-3 bg-[#10B981] text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✨ 완벽
                    </div>
                  )}
                </div>

                {/* 레시피 정보 */}
                <div>
                  <h3 className="font-bold text-[#374151] mb-2 text-lg">{recipe.name}</h3>
                  
                  {/* 주요 재료 */}
                  <div className="mb-3">
                    <p className="text-sm text-[#6B7280]">
                      <span className="font-medium">주재료:</span> {recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
                    </p>
                  </div>
                  
                  {/* 기본 정보 */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#F59E0B]">
                        {'⭐'.repeat(recipe.difficulty === 1 ? 2 : recipe.difficulty === 2 ? 3 : 4)}
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#374151] font-medium">재료 보유 현황</span>
                      <span className="text-sm font-semibold" style={{ color: getAvailabilityColor(recipe.availabilityRatio) }}>
                        {recipe.ingredients.length - recipe.missingIngredients.length}/{recipe.ingredients.length}개
                      </span>
                    </div>
                    
                    <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${recipe.availabilityRatio}%`,
                          backgroundColor: getAvailabilityColor(recipe.availabilityRatio)
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#10B981]">
                        ✅ {recipe.ingredients.length - recipe.missingIngredients.length}개 보유
                      </span>
                      {recipe.missingIngredients.length > 0 && (
                        <span className="text-[#EF4444]">
                          🛒 {recipe.missingIngredients.length}개 필요
                        </span>
                      )}
                    </div>

                    {/* 부족한 재료 표시 */}
                    {recipe.missingIngredients.length > 0 && (
                      <div className="mt-2 text-xs bg-[#FEF2F2] text-[#EF4444] p-2 rounded-lg">
                        <span className="font-medium">부족:</span> {recipe.missingIngredients.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-semibold text-[#374151] mb-2">검색 결과가 없어요</h3>
            <p className="text-[#6B7280] mb-6">다른 재료나 레시피명으로 검색해보시거나<br />필터를 조정해보세요</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('전체');
              }}
              className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200"
            >
              전체 레시피 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}