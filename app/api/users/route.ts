import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { id, name, avatar, provider } = await request.json();

    // 이미 존재하는 사용자인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      // 이미 존재하는 사용자면 정보만 업데이트
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, avatar, lastLogin: new Date() },
      });
      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      // 새 사용자 생성
      const newUser = await prisma.user.create({
        data: {
          id,
          name,
          avatar,
          provider,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      });
      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    console.error("데이터베이스 에러:", error);
    return NextResponse.json(
      {
        message: "서버 에러",
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
