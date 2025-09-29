// services/cookingRecords.ts

export interface UsedIngredient {
  name: string;
  quantity: number;
}

export interface CookingRecord {
  id: number;
  userId: string;
  recipeId: number;
  recipeName: string;
  imageUrl: string | null;
  usedIngredients: UsedIngredient[];
  completedAt: string;
  createdAt: string;
}

export interface FrequentIngredient {
  name: string;
  count: number;
}

export interface FavoriteRecipe {
  recipeId: number;
  recipeName: string;
  cookingCount: number;
}

export interface CookingRecordsResponse {
  recentRecords: CookingRecord[];
  frequentIngredients: FrequentIngredient[];
  favoriteRecipes: FavoriteRecipe[];
  monthlyStats: {
    cookingCount: number;
  };
}

// 요리 기록 생성
export const createCookingRecord = async (data: {
  recipeId: number;
  recipeName: string;
  usedIngredients: UsedIngredient[];
  imageUrl?: string;
}): Promise<CookingRecord> => {
  const response = await fetch("/api/cooking-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "요리 기록 생성에 실패했습니다.");
  }

  const result = await response.json();
  
  return {
    ...result,
    usedIngredients: typeof result.usedIngredients === 'string' 
      ? JSON.parse(result.usedIngredients)
      : result.usedIngredients
  };
};

// 요리 기록 조회
export const getCookingRecords = async (limit?: number): Promise<CookingRecordsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = new URL(`${baseUrl}/api/cooking-records`);
  
  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "요리 기록을 불러오지 못했습니다.");
  }

  return response.json();
};

// 특정 재료 사용 기록 조회
export const getIngredientUsageHistory = async (ingredientName: string) => {
  const records = await getCookingRecords();
  
  return records.recentRecords.filter(record =>
    record.usedIngredients.some(ingredient => 
      ingredient.name.toLowerCase().includes(ingredientName.toLowerCase())
    )
  );
};

// 레시피별 요리 기록 조회
export const getRecipeCookingHistory = async (recipeId: number) => {
  const records = await getCookingRecords();
  
  return records.recentRecords.filter(record => record.recipeId === recipeId);
};