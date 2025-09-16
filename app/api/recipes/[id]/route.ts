import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformPrismaRecipe } from "@/lib/recipeTransform";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = parseInt(params.id);

    if (isNaN(recipeId)) {
      return NextResponse.json(
        { error: "올바르지 않은 레시피 ID입니다." },
        { status: 404 }
      );
    }

    const prismaRecipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!prismaRecipe) {
      return NextResponse.json(
        { error: "레시피를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const recipe = transformPrismaRecipe(prismaRecipe);
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("[GET/api/recipes/id] 서버 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
