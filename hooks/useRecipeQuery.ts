import {
  getAllAiRecipes,
  getAllRecipes,
  getOneRecipe,
  getUserIngredients,
  updateMultipleIngredients,
} from "@/services/recipes";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useAllRecipes = () => {
  return useSuspenseQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });
};

export const useRecipe = (id: string, type: string) => {
  return useSuspenseQuery({
    queryKey: ["recipe", id],
    queryFn: () => getOneRecipe(id, type),
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

// 요리 완료 후 재료 차감
export const useUpdateMultipleIngredients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMultipleIngredients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userIngredcients"] });
    },
    onError: (error) => {
      console.error("재료 일괄 수정 실패:", error);
    },
  });
};

export const useAllAiRecipes = () => {
  return useSuspenseQuery({
    queryKey: ["aiRecipe"],
    queryFn: getAllAiRecipes,
  });
};
