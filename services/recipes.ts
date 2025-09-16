import { Recipe, RecipeIngredientInfo } from "@/types";
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
  items: RecipeIngredientInfo[];
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`
  );

  if (!response.ok) throw new Error("재료를 불러오지 못했습니다.");
  return response.json();
};
