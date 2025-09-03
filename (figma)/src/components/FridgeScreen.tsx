import { Plus, Search, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';
import { Ingredient, Screen } from '../types';

interface FridgeScreenProps {
  ingredients: Ingredient[];
  onNavigate: (screen: Screen) => void;
  onAddIngredient: () => void;
}

type ExpiryFilter = 'all' | 'safe' | 'warning' | 'urgent';

export default function FridgeScreen({ ingredients, onNavigate, onAddIngredient }: FridgeScreenProps) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('expiry'); // 'expiry', 'name', 'category'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('all');

  const categories = ['전체', '야채', '고기', '유제품', '조미료', '기타'];

  const getExpiryStatus = (daysLeft: number) => {
    if (daysLeft <= 3) return 'urgent';
    if (daysLeft <= 7) return 'warning';
    return 'safe';
  };

  const formatExpiryDate = (expiryDate: string, daysLeft: number) => {
    const date = new Date(expiryDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const shortDate = `${month}.${day}`;
    
    if (daysLeft < 0) return '기한 만료';
    if (daysLeft === 0) return '오늘까지';
    
    return `D-${daysLeft}일 (${shortDate})`;
  };

  const getExpiryColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#EF4444';
    if (daysLeft <= 7) return '#F59E0B';
    return '#10B981';
  };

  const filteredIngredients = ingredients
    .filter(ingredient => {
      const matchesCategory = activeCategory === '전체' || ingredient.category === activeCategory;
      const matchesSearch = ingredient.name.toLowerCase().includes(searchText.toLowerCase());
      
      let matchesExpiryFilter = true;
      if (expiryFilter !== 'all') {
        const status = getExpiryStatus(ingredient.daysLeft);
        matchesExpiryFilter = status === expiryFilter;
      }
      
      return matchesCategory && matchesSearch && matchesExpiryFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return a.daysLeft - b.daysLeft;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // 통계 계산
  const urgentCount = ingredients.filter(i => getExpiryStatus(i.daysLeft) === 'urgent').length;
  const warningCount = ingredients.filter(i => getExpiryStatus(i.daysLeft) === 'warning').length;
  const safeCount = ingredients.filter(i => getExpiryStatus(i.daysLeft) === 'safe').length;

  const expiryFilters = [
    { key: 'all' as ExpiryFilter, label: '전체', color: '#6B7280' },
    { key: 'safe' as ExpiryFilter, label: '안전', color: '#10B981' },
    { key: 'warning' as ExpiryFilter, label: '주의', color: '#F59E0B' },
    { key: 'urgent' as ExpiryFilter, label: '임박', color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151] mb-2">
                내 냉장고 관리 🧊
              </h1>
              <p className="text-[#6B7280]">신선한 재료를 체계적으로 관리하세요</p>
            </div>
            <button 
              onClick={onAddIngredient}
              className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              재료 추가
            </button>
          </div>

          {/* 상태 요약 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#EF4444] mb-1">{urgentCount}개</div>
                <div className="text-sm text-[#6B7280]">임박 (3일 이내)</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F59E0B] mb-1">{warningCount}개</div>
                <div className="text-sm text-[#6B7280]">주의 (4-7일)</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981] mb-1">{safeCount}개</div>
                <div className="text-sm text-[#6B7280]">안전 (7일 이상)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#374151] mb-1">{ingredients.length}개</div>
                <div className="text-sm text-[#6B7280]">전체 재료</div>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] mb-6">
          {/* 검색바 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="재료명으로 검색하세요..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#10B981] focus:bg-white transition-all duration-200"
            />
          </div>

          {/* 유통기한 필터 탭 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#374151] mb-3">유통기한 상태</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {expiryFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setExpiryFilter(filter.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                    expiryFilter === filter.key
                      ? 'border-current text-white shadow-sm'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:border-current hover:text-current'
                  }`}
                  style={{
                    backgroundColor: expiryFilter === filter.key ? filter.color : 'transparent',
                    borderColor: expiryFilter === filter.key ? filter.color : '#E5E7EB',
                    color: expiryFilter === filter.key ? 'white' : filter.color
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 및 기타 필터 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* 카테고리 탭 */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">카테고리</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? category === '기타' 
                          ? 'bg-[#6B7280] text-white shadow-sm'
                          : 'bg-[#10B981] text-white shadow-sm'
                        : category === '기타'
                        ? 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#6B7280] hover:text-white'
                        : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#374151]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 정렬 및 뷰 옵션 */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#10B981] transition-colors"
              >
                <option value="expiry">유통기한순</option>
                <option value="name">이름순</option>
                <option value="category">카테고리순</option>
              </select>
              
              <div className="flex bg-[#F9FAFB] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#10B981] shadow-sm' 
                      : 'text-[#6B7280] hover:text-[#374151]'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#10B981] shadow-sm' 
                      : 'text-[#6B7280] hover:text-[#374151]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 재료 목록 */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'space-y-3'
        }`}>
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => {
              const status = getExpiryStatus(ingredient.daysLeft);
              
              if (viewMode === 'grid') {
                return (
                  <div key={ingredient.id} className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:border-[#10B981]/20 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{ingredient.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#374151] truncate">{ingredient.name}</h3>
                          <span className="text-sm text-[#6B7280] bg-[#F9FAFB] px-2 py-1 rounded-md">
                            {ingredient.quantity}개
                          </span>
                        </div>
                        <div className={`text-xs mb-2 px-2 py-1 rounded-md inline-block ${
                          ingredient.category === '기타' 
                            ? 'bg-[#F3F4F6] text-[#6B7280]' 
                            : 'bg-[#F0FDF4] text-[#047857]'
                        }`}>
                          {ingredient.category}
                        </div>
                        <div 
                          className={`text-sm font-medium px-3 py-1 rounded-full text-center ${
                            status === 'urgent' ? 'bg-[#FEF2F2] text-[#EF4444]' :
                            status === 'warning' ? 'bg-[#FFFBEB] text-[#F59E0B]' :
                            'bg-[#F0FDF4] text-[#10B981]'
                          }`}
                        >
                          {formatExpiryDate(ingredient.expiryDate, ingredient.daysLeft)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={ingredient.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:border-[#10B981]/20 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{ingredient.emoji}</div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-[#374151]">{ingredient.name}</div>
                          <div className={`text-xs px-2 py-1 rounded-md inline-block mt-1 ${
                            ingredient.category === '기타' 
                              ? 'bg-[#F3F4F6] text-[#6B7280]' 
                              : 'bg-[#F0FDF4] text-[#047857]'
                          }`}>
                            {ingredient.category}
                          </div>
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {ingredient.quantity}{ingredient.unit}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {ingredient.purchaseDate}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {ingredient.expiryDate}
                        </div>
                        <div 
                          className={`text-sm font-medium px-3 py-1 rounded-full text-center ${
                            status === 'urgent' ? 'bg-[#FEF2F2] text-[#EF4444]' :
                            status === 'warning' ? 'bg-[#FFFBEB] text-[#F59E0B]' :
                            'bg-[#F0FDF4] text-[#10B981]'
                          }`}
                        >
                          {formatExpiryDate(ingredient.expiryDate, ingredient.daysLeft)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🥺</div>
              <h3 className="text-lg font-semibold text-[#374151] mb-2">재료가 없어요</h3>
              <p className="text-[#6B7280] mb-6">
                {searchText || activeCategory !== '전체' || expiryFilter !== 'all'
                  ? '검색 조건에 맞는 재료가 없습니다.' 
                  : '냉장고에 첫 번째 재료를 추가해보세요!'}
              </p>
              <button
                onClick={onAddIngredient}
                className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#059669] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                재료 추가하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 추가 버튼 */}
      <button
        onClick={onAddIngredient}
        className="fixed bottom-24 md:bottom-8 right-6 lg:right-8 bg-[#10B981] text-white w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-[#059669] hover:shadow-xl transition-all duration-200 z-10"
      >
        <Plus className="w-6 h-6 lg:w-8 lg:h-8" />
      </button>
    </div>
  );
}