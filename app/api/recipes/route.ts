import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformPrismaRecipes } from "@/lib/recipeTransform";

export async function GET() {
  try {
    const prismaRecipes = await prisma.recipe.findMany();

    if (!prismaRecipes || prismaRecipes.length === 0) {
      return NextResponse.json(
        { error: "레시피가 없습니다." },
        { status: 404 }
      );
    }

    const recipes = transformPrismaRecipes(prismaRecipes);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("[GET/api/recipes] 서버 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
