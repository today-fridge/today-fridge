import { useState } from 'react';
import WebHeader from './components/WebHeader';
import FridgeScreen from './components/FridgeScreen';
import RecipeSearchScreen from './components/RecipeSearchScreen';
import AllRecipesScreen from './components/AllRecipesScreen';
import RecipeDetailScreen from './components/RecipeDetailScreen';
import AddIngredientModal from './components/AddIngredientModal';
import IngredientConsumptionModal from './components/IngredientConsumptionModal';
import { Screen, Ingredient, Recipe } from './types';
import { initialIngredients, sampleRecipes } from './data/sampleData';
import { addIngredientToList } from './utils/ingredientUtils';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('fridge');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);

  const addIngredient = (newIngredient: Omit<Ingredient, 'id' | 'daysLeft' | 'available'>) => {
    const updatedIngredients = addIngredientToList(ingredients, newIngredient);
    setIngredients(updatedIngredients);
    setShowAddModal(false);
  };

  const updateIngredientQuantity = (ingredientName: string, usedQuantity: number, unit: string) => {
    setIngredients(prevIngredients => 
      prevIngredients.map(ing => {
        if (ing.name === ingredientName && ing.unit === unit) {
          const newQuantity = Math.max(0, ing.quantity - usedQuantity);
          return { ...ing, quantity: newQuantity };
        }
        return ing;
      }).filter(ing => ing.quantity > 0)
    );
  };

  const handleRecipeCooking = () => {
    setShowConsumptionModal(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
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
            ingredients={ingredients}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
          />
        );
      case 'all-recipes':
        return (
          <AllRecipesScreen 
            recipes={sampleRecipes}
            ingredients={ingredients}
            onNavigate={setCurrentScreen}
            onRecipeSelect={setSelectedRecipe}
          />
        );
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetailScreen 
            recipe={selectedRecipe}
            onNavigate={setCurrentScreen}
            onCookingComplete={handleRecipeCooking}
          />
        ) : null;
      default:
        return (
          <FridgeScreen 
            ingredients={ingredients}
            onNavigate={setCurrentScreen}
            onAddIngredient={() => setShowAddModal(true)}
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

      {/* 재료 소비 확인 모달 */}
      {showConsumptionModal && selectedRecipe && (
        <IngredientConsumptionModal 
          recipe={selectedRecipe}
          onClose={() => setShowConsumptionModal(false)}
          onConfirm={(consumedIngredients) => {
            consumedIngredients.forEach(item => {
              updateIngredientQuantity(item.name, item.quantity, item.unit);
            });
            setShowConsumptionModal(false);
            setCurrentScreen('fridge');
          }}
        />
      )}

      {/* 푸터 (데스크톱용) */}
      <footer className="hidden lg:block bg-white border-t border-[#E5E7EB] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🌿</div>
                <h3 className="text-lg font-bold text-[#374151]">나만의 냉장고 요리사</h3>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                신선한 재료로 건강한 요리를 만들어보세요. 
                냉장고 재료를 관리하고 맞춤 레시피를 추천받아보세요.
              </p>
              <p className="text-xs text-[#6B7280]">
                © 2025 나만의 냉장고 요리사. 모든 권리 보유.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#374151] mb-3">주요 기능</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>• 냉장고 재료 관리</li>
                <li>• 맞춤 레시피 추천</li>
                <li>• 유통기한 알림</li>
                <li>• 요리 재료 자동 차감</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}