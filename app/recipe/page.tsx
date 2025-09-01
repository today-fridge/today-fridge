"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeSearch from "@/components/RecipeSearch";
import { sampleRecipes } from "@/data/sampleData";
import { Recipe } from "@/types/index";

export default function RecipePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes] = useState([...sampleRecipes]);

  const handleRecipeSelect = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <RecipeSearch
      recipes={recipes}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onRecipeSelect={handleRecipeSelect}
    />
  );
}
