import {
  getAllRecipes,
  getOneRecipe,
  getUserIngredients,
} from "@/services/recipes";
import { useQuery } from "@tanstack/react-query";

export const useAllRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
    initialData: [],
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getOneRecipe(id),
  });
};

export const useUserIngredcients = () => {
  return useQuery({
    queryKey: ["userIngredcients"],
    queryFn: getUserIngredients,
    initialData: { items: [] },
    select: ({ items }) => {
      return items.map((ingredient) => ({
        id: String(ingredient.id),
        name: ingredient.name,
        category: ingredient.category,
        quantity: Number(ingredient.quantity ?? 0),
        unit: ingredient.unit,
        available: ingredient.quantity > 0,
      }));
    },
  });
};
