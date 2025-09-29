import { Recipe, IngredientForRecipe } from "@/types";
import { notFound } from "next/navigation";

// 전체 레시피 조회
export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("전체 레시피를 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data || [];
};

// 개별 레시피 조회
export const getOneRecipe = async (
  id: string,
  type: string
): Promise<Recipe> => {
  const response = await fetch(
    `/api/recipes/${id}${type === "ai" ? "?type=ai" : ""}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("레시피를 불러오는데 실패했습니다.");
  }

  return await response.json();
};

// 사용자 재료 조회
export const getUserIngredients = async (): Promise<{
  items: IngredientForRecipe[];
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`
  );

  if (response.status === 404) {
    return { items: [] };
  }

  if (!response.ok) {
    throw new Error("재료를 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data || { items: [] };
};

// 요리 완성 후 재료 차감
export const updateMultipleIngredients = async (
  updates: Array<{ id: number; quantity: number }>
): Promise<void> => {
  if (!updates || updates.length === 0) {
    return;
  }

  try {
    const response = await fetch(`/api/cooking-complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: updates }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.error || "완성 요리에 대한 재료 수정에 실패했습니다."
      );
    }

    return response.json();
  } catch (error) {
    console.error("완성 요리 재료 업데이트 실패:", error);
    throw new Error("완성 요리 재료 업데이트에 실패했습니다.");
  }
};

// AI 레시피 전체 조회
export const getAllAiRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/ai-recipes`
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("전체 레시피를 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data || [];
};

// AI 레시피 개별 조회
export const getOneAiRecipe = async (id: string): Promise<Recipe> => {
  const response = await fetch(`/api/recipes/ai-recipes/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("AI 레시피를 불러오는데 실패했습니다.");
  }

  return await response.json();
};
