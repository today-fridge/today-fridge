export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  daysLeft: number;
  emoji: string;
  available: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  difficulty: number;
  cookingTime: number;
  servings: number;
  imageUrl: string;
  ingredients: { name: string; quantity: string; available: boolean }[];
  steps: string[];
  availableIngredients: number;
  totalIngredients: number;
}
