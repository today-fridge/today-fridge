import { Search, Filter, Clock, Users, Star, Sparkles, ChefHat } from 'lucide-react';
import { useState } from 'react';
import { Recipe, Screen } from '../types';

interface RecipeSearchScreenProps {
  recipes: Recipe[];
  searchQuery: string;
  onNavigate: (screen: Screen) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  onSearchChange: (query: string) => void;
}

export default function RecipeSearchScreen({ 
  recipes, 
  searchQuery, 
  onNavigate, 
  onRecipeSelect, 
  onSearchChange 
}: RecipeSearchScreenProps) {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('available'); // 'available', 'time', 'difficulty'

  const filters = ['전체', '쉬움', '보통', '어려움', '시간단축', '만들기쉬운'];

  const filteredRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesFilter = true;
      if (activeFilter === '쉬움') matchesFilter = recipe.difficulty <= 2;
      else if (activeFilter === '보통') matchesFilter = recipe.difficulty === 3;
      else if (activeFilter === '어려움') matchesFilter = recipe.difficulty >= 4;
      else if (activeFilter === '시간단축') matchesFilter = recipe.cookingTime <= 20;
      else if (activeFilter === '만들기쉬운') matchesFilter = recipe.availableIngredients >= recipe.totalIngredients * 0.7;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'available':
          return (b.availableIngredients / b.totalIngredients) - (a.availableIngredients / a.totalIngredients);
        case 'time':
          return a.cookingTime - b.cookingTime;
        case 'difficulty':
          return a.difficulty - b.difficulty;
        default:
          return 0;
      }
    });

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio >= 0.8) return '#10B981';
    if (ratio >= 0.5) return '#F59E0B';
    return '#6B7280';
  };

  const getAvailabilityText = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio >= 0.8) return '충분';
    if (ratio >= 0.5) return '보통';
    return '부족';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#10B981]/10 rounded-xl">
              <Search className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151]">
                레시피 검색 🍳
              </h1>
              <p className="text-[#6B7280]">보유 재료로 만들 수 있는 맛있는 요리를 찾아보세요</p>
            </div>
          </div>

          {/* 검색바 */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="레시피나 재료명을 검색하세요..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all duration-200 text-lg"
            />
          </div>

          {/* 결과 카운트 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#374151]">
                {searchQuery ? `"${searchQuery}" 검색 결과` : '전체 레시피'} 
                <span className="text-[#10B981] ml-2">({filteredRecipes.length}개)</span>
              </h2>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#10B981] transition-colors"
            >
              <option value="available">재료 보유율순</option>
              <option value="time">조리시간순</option>
              <option value="difficulty">난이도순</option>
            </select>
          </div>
        </div>

        {/* 메인 레이아웃 - 데스크톱: 사이드바 + 메인, 모바일: 스택 */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* 필터 사이드바 (데스크톱) / 필터 탭 (모바일) */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-semibold text-[#374151]">필터</h3>
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter
                        ? 'bg-[#10B981] text-white shadow-sm'
                        : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* AI 추천 카드 - 사이드바 */}
              <div 
                onClick={() => onNavigate('ai-recommend')}
                className="mt-6 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="text-2xl mb-2">🤖</div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm">AI 맞춤 추천</h4>
                  <p className="text-xs text-white/90">특별한 레시피를 AI가 추천해드려요!</p>
                </div>
              </div>
            </div>
          </div>

          {/* 레시피 목록 */}
          <div className="lg:col-span-3">
            {filteredRecipes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {filteredRecipes.map((recipe) => {
                  const availabilityRatio = recipe.availableIngredients / recipe.totalIngredients;
                  
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => {
                        onRecipeSelect(recipe);
                        onNavigate('recipe-detail');
                      }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] cursor-pointer hover:shadow-lg hover:border-[#10B981]/20 active:scale-[0.98] transition-all duration-200"
                    >
                      {/* 레시피 이미지 */}
                      <div className="w-full h-48 rounded-xl bg-gray-100 overflow-hidden mb-4 relative">
                        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            availabilityRatio >= 0.8 ? 'bg-[#10B981] text-white' :
                            availabilityRatio >= 0.5 ? 'bg-[#F59E0B] text-white' :
                            'bg-[#6B7280] text-white'
                          }`}>
                            {getAvailabilityText(recipe.availableIngredients, recipe.totalIngredients)}
                          </div>
                        </div>
                      </div>

                      {/* 레시피 정보 */}
                      <div>
                        <h3 className="font-bold text-[#374151] mb-2 text-lg">{recipe.name}</h3>
                        
                        {/* 주요 재료 */}
                        <div className="mb-3">
                          <p className="text-sm text-[#6B7280]">
                            <span className="font-medium">주재료:</span> {recipe.ingredients.slice(0, 4).map(ing => ing.name).join(', ')}
                          </p>
                        </div>
                        
                        {/* 기본 정보 */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#F59E0B]" />
                            <span>{'★'.repeat(recipe.difficulty)}</span>
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
                            <span className="text-sm font-semibold" style={{ color: getAvailabilityColor(recipe.availableIngredients, recipe.totalIngredients) }}>
                              {recipe.availableIngredients}/{recipe.totalIngredients}개
                            </span>
                          </div>
                          
                          <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(recipe.availableIngredients / recipe.totalIngredients) * 100}%`,
                                backgroundColor: getAvailabilityColor(recipe.availableIngredients, recipe.totalIngredients)
                              }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#10B981]">✅ {recipe.availableIngredients}개 보유</span>
                            {recipe.availableIngredients < recipe.totalIngredients && (
                              <span className="text-[#EF4444]">🛒 {recipe.totalIngredients - recipe.availableIngredients}개 필요</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😅</div>
                <h3 className="text-xl font-semibold text-[#374151] mb-2">검색 결과가 없어요</h3>
                <p className="text-[#6B7280] mb-6">다른 재료나 레시피명으로 검색해보시거나<br />필터를 조정해보세요</p>
                <button
                  onClick={() => {
                    onSearchChange('');
                    setActiveFilter('전체');
                  }}
                  className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200"
                >
                  전체 레시피 보기
                </button>
              </div>
            )}

            {/* 모바일용 AI 추천 카드 */}
            <div className="lg:hidden mt-8">
              <div 
                onClick={() => onNavigate('ai-recommend')}
                className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 to-transparent"></div>
                <div className="relative flex items-center gap-4">
                  <div className="text-4xl">🤖</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                      <h3 className="font-semibold text-lg">AI 맞춤 레시피 추천</h3>
                    </div>
                    <p className="text-white/90">
                      원하는 레시피를 찾지 못하셨나요? AI가 특별한 레시피를 추천해드려요!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}