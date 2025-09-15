export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  daysLeft: number | null;
  emoji: string;
  available: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  difficulty: number;
  cookingTime: number;
  servings: number;
  imageUrl: string;
  availableIngredients?: number;
  totalIngredients?: number;
  userName: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  available?: boolean;
}

export interface PrismaRecipe {
  id: number;
  RCP_TTL: string;
  CKG_NM: string;
  CKG_DODF_NM: string;
  CKG_TIME_NM: string;
  CKG_INBUN_NM: string;
  IMAGE_URL: string | null;
  WEB_INGREDIENTS: string;
  WEB_RECIPE_STEPS: string;
  RGTR_NM: string;
}

export interface RecipeIngredientInfo {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate?: string;
  expiryDate?: string;
  daysLeft?: number | null;
  emoji?: string;
  available: boolean;
}
