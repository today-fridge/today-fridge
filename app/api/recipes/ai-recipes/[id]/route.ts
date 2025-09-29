import { prisma } from "@/lib/prisma";
import { transformPrismaRecipe } from "@/lib/recipeTransform";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aiRecipeId = parseInt(id);

    if (isNaN(aiRecipeId)) {
      return NextResponse.json(
        { error: "올바르지 않은 레시피 ID입니다." },
        { status: 400 }
      );
    }

    const prismaRecipe = await prisma.aiRecipe.findUnique({
      where: {
        id: aiRecipeId,
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
    console.error("[GET/api/recipes/ai-recipes/id] 서버 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
