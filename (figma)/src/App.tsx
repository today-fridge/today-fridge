import { useState } from 'react';
import WebHeader from './components/WebHeader';
import HomeScreen from './components/HomeScreen';
import FridgeScreen from './components/FridgeScreen';
import RecipeSearchScreen from './components/RecipeSearchScreen';
import RecipeDetailScreen from './components/RecipeDetailScreen';
import AIRecommendScreen from './components/AIRecommendScreen';
import MyRecordsScreen from './components/MyRecordsScreen';
import AddIngredientModal from './components/AddIngredientModal';
import { Screen, Ingredient, Recipe } from './types';
import { initialIngredients, sampleRecipes } from './data/sampleData';
import { addIngredientToList } from './utils/ingredientUtils';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);

  const addIngredient = (newIngredient: Omit<Ingredient, 'id' | 'daysLeft' | 'available'>) => {
    const updatedIngredients = addIngredientToList(ingredients, newIngredient);
    setIngredients(updatedIngredients);
    setShowAddModal(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            ingredients={ingredients}
            recipes={sampleRecipes}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
          />
        );
      case 'fridge':
        return (
          <FridgeScreen 
            ingredients={ingredients}
            onNavigate={setCurrentScreen}
            onAddIngredient={() => setShowAddModal(true)}
          />
        );
      case 'recipe-search':
        return (
          <RecipeSearchScreen 
            recipes={sampleRecipes}
            searchQuery={searchQuery}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
            onSearchChange={setSearchQuery}
          />
        );
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetailScreen 
            recipe={selectedRecipe}
            onNavigate={setCurrentScreen}
          />
        ) : null;
      case 'ai-recommend':
        return (
          <AIRecommendScreen 
            ingredients={ingredients}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
          />
        );
      case 'my-records':
        return (
          <MyRecordsScreen 
            onNavigate={setCurrentScreen}
          />
        );
      default:
        return (
          <HomeScreen 
            ingredients={ingredients}
            recipes={sampleRecipes}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] w-full relative">
      {/* 웹 헤더 */}
      <WebHeader 
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
      
      {/* 메인 콘텐츠 */}
      <main className="w-full pb-20 md:pb-0">
        {renderScreen()}
      </main>
      
      {/* 재료 추가 모달 */}
      {showAddModal && (
        <AddIngredientModal 
          onClose={() => setShowAddModal(false)}
          onAdd={addIngredient}
        />
      )}

      {/* 푸터 (데스크톱용) */}
      <footer className="hidden lg:block bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🌿</div>
                <h3 className="text-lg font-bold text-[#374151]">나만의 냉장고 요리사</h3>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                신선한 재료로 건강한 요리를 만들어보세요. 
                AI가 당신의 냉장고 재료를 분석해서 완벽한 레시피를 추천해드립니다.
              </p>
              <p className="text-xs text-[#6B7280]">
                © 2025 나만의 냉장고 요리사. 모든 권리 보유.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#374151] mb-3">주요 기능</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>• 스마트 재료 관리</li>
                <li>• AI 레시피 추천</li>
                <li>• 유통기한 알림</li>
                <li>• 요리 기록 저장</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#374151] mb-3">고객 지원</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>• 사용 가이드</li>
                <li>• 자주 묻는 질문</li>
                <li>• 문의하기</li>
                <li>• 피드백</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}