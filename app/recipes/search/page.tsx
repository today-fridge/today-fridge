import { Recipe, RecipeIngredientInfo } from "@/types";
import AllRecipesClient from "./AllRecipesClient";

async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("전체 레시피를 불러오지 못했습니다.");
  return res.json();
}

async function getUserIngredients(): Promise<RecipeIngredientInfo[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ingredients`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("재료를 불러오지 못했습니다.");

  const data = await res.json();
  const items: RecipeIngredientInfo[] = Array.isArray(data)
    ? data
    : data.items ?? [];
  return items.map((ing) => ({
    id: String(ing.id),
    name: ing.name,
    category: ing.category,
    quantity: Number(ing.quantity ?? 0),
    unit: ing.unit,
    available: ing.quantity > 0,
  }));
}

export default async function AllRecipesScreen() {
  const recipes = await getAllRecipes();
  const ingredients = await getUserIngredients();

  return <AllRecipesClient recipes={recipes} ingredients={ingredients} />;
}
