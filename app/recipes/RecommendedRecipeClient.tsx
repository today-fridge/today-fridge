"use client";

import RecipeCard from "@/components/RecipeCard";
import { useAllRecipes, useUserIngredcients } from "@/hooks/useRecipeQuery";
import {
  calculateAvailabilityRatio,
  getMissingIngredients,
  sortRecipesByAvailability,
} from "@/lib/recipeTransform";
import React from "react";

const RecommendedRecipeClient = () => {
  const { data: recipes } = useAllRecipes();
  const { data: userIngredientList } = useUserIngredcients();

  // 보유율 높은 순으로 정렬하여 상위 3개만
  const recommendedRecipes = sortRecipesByAvailability(
    recipes,
    userIngredientList
  )
    .map((recipe) => ({
      ...recipe,
      availability: calculateAvailabilityRatio({ recipe, userIngredientList }),
      missingIngredients: getMissingIngredients({ recipe, userIngredientList }),
    }))
    .slice(0, 3);

  return (
    <div className="space-y-6 mb-12">
      {recommendedRecipes.map((recipe, index) => {
        return (
          <RecipeCard
            key={`${recipe.id}__${recipe.userName}`}
            recipe={recipe}
            userIngredientList={userIngredientList}
            layout="list"
            showRanking={true}
            rankingIndex={index}
          />
        );
      })}
    </div>
  );
};

export default RecommendedRecipeClient;
