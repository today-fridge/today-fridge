import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { id, name, avatar, provider } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 데이터베이스 연결 테스트
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error("데이터베이스 연결 실패:", dbError);
      return NextResponse.json(
        { error: "데이터베이스 연결 실패" },
        { status: 500 }
      );
    }

    // upsert 사용해서 더 안전하게 처리
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        name: name || undefined,
        avatar: avatar || undefined,
        lastLogin: new Date(),
      },
      create: {
        id,
        name: name || null,
        avatar: avatar || null,
        provider: provider || null,
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("사용자 저장 중 상세 에러:", {
      message: error instanceof Error ? error.message : "알 수 없는 오류",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    return NextResponse.json(
      {
        message: "사용자 저장 실패",
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        details: "데이터베이스 연결 또는 스키마 문제일 수 있습니다.",
      },
      { status: 500 }
    );
  }
}
