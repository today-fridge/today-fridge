import RecipeDetailClient from "./RecipeDetailClient";

export default async function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: recipeId } = await params;

  return <RecipeDetailClient recipeId={recipeId} />;
}
