import { Recipe, IngredientForRecipe } from "@/types";
import { notFound } from "next/navigation";

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`
  );

  if (!response.ok) throw new Error("전체 레시피를 불러오지 못했습니다.");
  return response.json();
};

export const getOneRecipe = async (id: string): Promise<Recipe> => {
  const response = await fetch(`/api/recipes/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
  }
  return await response.json();
};

export const getUserIngredients = async (): Promise<{
  items: IngredientForRecipe[];
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`
  );

  if (!response.ok) throw new Error("재료를 불러오지 못했습니다.");
  return response.json();
};

// 요리 완성 후 재료 차감
export const updateMultipleIngredients = async (
  updates: Array<{ id: number; quantity: number }>
): Promise<void> => {
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
