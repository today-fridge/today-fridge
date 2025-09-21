import {
  getAllRecipes,
  getOneRecipe,
  getUserIngredients,
} from "@/services/recipes";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useAllRecipes = () => {
  return useSuspenseQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });
};

export const useRecipe = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["recipe", id],
    queryFn: () => getOneRecipe(id),
  });
};

export const useUserIngredcients = () => {
  return useSuspenseQuery({
    queryKey: ["userIngredcients"],
    queryFn: getUserIngredients,
    select: ({ items }) => {
      return items.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        quantity: Number(ingredient.quantity ?? 0),
        unit: ingredient.unit,
        available: ingredient.quantity > 0,
      }));
    },
  });
};
