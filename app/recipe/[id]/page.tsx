import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";
import { sampleRecipes } from "@/data/sampleData";

async function getRecipe(id: string) {
  const recipes = [...sampleRecipes];
  return recipes.find((recipe) => recipe.id === id);
}

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailClient recipe={recipe} />;
}
