import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// 요리 기록 생성
export async function POST(request: NextRequest) {
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

    const { recipeId, recipeName, usedIngredients, imageUrl } = body;

    if (
      !recipeId ||
      !recipeName ||
      !usedIngredients ||
      !Array.isArray(usedIngredients)
    ) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 요리 기록 생성
    const cookingRecord = await prisma.cookingRecord.create({
      data: {
        userId,
        recipeId,
        recipeName,
        imageUrl: imageUrl || null,
        usedIngredients: JSON.stringify(usedIngredients),
        completedAt: new Date(),
      },
    });

    return NextResponse.json(cookingRecord, { status: 201 });
  } catch (error) {
    console.error("[POST /api/cooking-records] 오류:", error);
    return NextResponse.json(
      { error: "요리 기록 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 요리 기록 조회
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // 최근 요리 기록 조회
    const recentRecords = await prisma.cookingRecord.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: limit,
    });

    // 자주 사용한 재료 통계 (최근 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ingredientStats = await prisma.cookingRecord.findMany({
      where: {
        userId,
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        usedIngredients: true,
      },
    });

    // 재료 사용 빈도 계산
    const ingredientCount: Record<string, number> = {};

    ingredientStats.forEach((record) => {
      try {
        const ingredients = JSON.parse(
          record.usedIngredients as string
        ) as Array<{
          name: string;
          quantity: number;
        }>;

        ingredients.forEach((ingredient) => {
          if (ingredient.name && ingredient.quantity > 0) {
            ingredientCount[ingredient.name] =
              (ingredientCount[ingredient.name] || 0) + 1;
          }
        });
      } catch (error) {
        console.error("재료 데이터 파싱 실패:", error);
      }
    });

    // 자주 사용한 재료 상위 10개
    const frequentIngredients = Object.entries(ingredientCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count: Math.round(count) }));

    // 레시피별 요리 횟수 통계
    const recipeStats = await prisma.cookingRecord.groupBy({
      by: ["recipeId", "recipeName"],
      where: { userId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    // 이번 달 통계
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await prisma.cookingRecord.aggregate({
      where: {
        userId,
        completedAt: {
          gte: thisMonth,
        },
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      recentRecords: recentRecords.map((record) => ({
        ...record,
        usedIngredients: JSON.parse(record.usedIngredients as string),
      })),
      frequentIngredients,
      favoriteRecipes: recipeStats.map((stat) => ({
        recipeId: stat.recipeId,
        recipeName: stat.recipeName,
        cookingCount: stat._count.id,
      })),
      monthlyStats: {
        cookingCount: monthlyStats._count.id || 0,
      },
    });
  } catch (error) {
    console.error("[GET /api/cooking-records] 오류:", error);
    return NextResponse.json(
      { error: "요리 기록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
