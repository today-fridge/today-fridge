// app/api/ingredients/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  koToEnum,
  enumToKo,
  emojiByKo,
  type CategoryKo,
} from "@/lib/ingredient";
import { ymd, calcDaysLeft } from "@/utils/date";

function parseId(param: string) {
  const n = Number(param);
  if (!Number.isFinite(n) || n <= 0) throw new Error("잘못된 id");
  return n;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    const body = await req.json();

    // 필수 필드 체크
    if (!body?.name || !body?.category || !body?.unit) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    const catEnum = koToEnum[body.category as CategoryKo] ?? "OTHER";

    // 빈 문자열 방지 처리
    const purchasedAt =
      body.purchaseDate && String(body.purchaseDate).trim() !== ""
        ? new Date(body.purchaseDate)
        : null;
    const expiresAt =
      body.expiryDate && String(body.expiryDate).trim() !== ""
        ? new Date(body.expiryDate)
        : null;

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        name: String(body.name).trim(),
        category: catEnum,
        quantity:
          typeof body.quantity === "number"
            ? body.quantity
            : Number(body.quantity) || 0,
        unit: String(body.unit).trim(),
        purchasedAt,
        expiresAt,
      },
    });

    // UI 포맷으로 변환
    const catKo = enumToKo[updated.category as keyof typeof enumToKo] ?? "기타";
    const today = new Date();
    const uiItem = {
      id: updated.id,
      name: updated.name,
      category: catKo,
      quantity: updated.quantity ?? 1,
      unit: updated.unit,
      purchaseDate: ymd(updated.purchasedAt ?? null), // "YYYY-MM-DD" | ""
      expiryDate: ymd(updated.expiresAt ?? null), // "YYYY-MM-DD" | ""
      daysLeft: calcDaysLeft(today, updated.expiresAt ?? null), // number | null
      emoji: emojiByKo[catKo] ?? "🍳",
    };

    return NextResponse.json(uiItem, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/ingredients/:id]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "수정 실패" },
      { status: 500 }
    );
  }
}

/* DELETE /api/ingredients/:id */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    await prisma.ingredient.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/ingredients/:id]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
