// services/ingredients.ts
import { Ingredient } from "@/types";

export const getAllIngredients = async (): Promise<{
  items: Ingredient[];
}> => {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "재료 목록을 불러오지 못했습니다.");
  }

  const result = await response.json();
  return result;
};

export const getOneIngredient = async (id: string): Promise<Ingredient> => {
  const response = await fetch(`/api/ingredients/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("재료를 찾을 수 없습니다.");
    }
    throw new Error("재료를 불러오지 못했습니다.");
  }

  return response.json();
};

export const createIngredient = async (
  ingredient: Omit<Ingredient, "id" | "daysLeft" | "available">
): Promise<Ingredient> => {
  const response = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "재료 추가에 실패했습니다.");
  }

  return response.json();
};

export const updateIngredient = async (
  id: string,
  ingredient: Partial<Ingredient>
): Promise<Ingredient> => {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "재료 수정에 실패했습니다.");
  }

  return response.json();
};

export const deleteIngredient = async (id: string): Promise<void> => {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || "재료 삭제에 실패했습니다.");
  }
};
