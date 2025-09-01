"use client";

import { useRouter } from "next/navigation";
import RecipeDetailScreen from "@/components/RecipeDetailScreen";
import { Recipe } from "@/types";

export default function RecipeDetailClient({ recipe }: Recipe) {
  const router = useRouter();

  const handleNavigate = (screen) => {
    // screen 값에 따라 적절한 URL로 이동
    if (screen === "recipe-search") {
      router.push("/recipe");
    }
    // 다른 네비게이션들도 처리
  };

  return <RecipeDetailScreen recipe={recipe} onNavigate={handleNavigate} />;
}
