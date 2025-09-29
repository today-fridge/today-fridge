import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = user.id;
    const body = await request.json();
    const ingredients: { id: number; quantity: number }[] =
      body.ingredients || [];

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "업데이트할 재료 정보가 없습니다." },
        { status: 400 }
      );
    }

    // 모든 재료가 현재 사용자의 것인지 확인
    const ingredientIds = ingredients.map((item) => item.id);
    const existingIngredients = await prisma.ingredient.findMany({
      where: {
        id: { in: ingredientIds },
        userId: userId,
      },
    });

    // 요청한 재료 수와 실제 존재하는 재료 수가 다르면 에러
    if (existingIngredients.length !== ingredients.length) {
      return NextResponse.json(
        { error: "일부 재료를 찾을 수 없거나 접근 권한이 없습니다." },
        { status: 404 }
      );
    }

    //재료를 수량에 따라 분류
    const ingredientsToUpdate: { id: number; quantity: number }[] = [];
    const ingredientsToDelete: number[] = [];

    ingredients.forEach((ingredient) => {
      if (ingredient.quantity > 0) {
        ingredientsToUpdate.push(ingredient);
      } else {
        ingredientsToDelete.push(ingredient.id);
      }
    });

    const result = await prisma.$transaction(async (tx) => {
      const operations = [];

      // 수량 업데이트
      if (ingredientsToUpdate.length > 0) {
        const updatePromises = ingredientsToUpdate.map((ingredient) =>
          tx.ingredient.update({
            where: { id: ingredient.id },
            data: { quantity: ingredient.quantity },
          })
        );
        operations.push(...updatePromises);
      }

      // 재료 삭제
      if (ingredientsToDelete.length > 0) {
        const deletePromise = tx.ingredient.deleteMany({
          where: {
            id: { in: ingredientsToDelete },
            userId: userId,
          },
        });
        operations.push(deletePromise);
      }

      return Promise.all(operations);
    });

    return NextResponse.json(
      {
        message: "재료 수량이 성공적으로 업데이트 되었습니다.",
        updated: ingredientsToUpdate.length,
        deleted: ingredientsToDelete.length,
        details: {
          updatedIngredients: ingredientsToUpdate.map((i) => i.id),
          deletedIngredients: ingredientsToDelete,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PATCH /api/cooking-complete]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "처리 실패" },
      { status: 500 }
    );
  }
}
