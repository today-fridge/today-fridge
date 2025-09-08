// app/api/ingredients/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  koToEnum,
  enumToKo,
  emojiByKo,
  ymd,
  calcDaysLeft,
  type CategoryKO,
} from "@/lib/ingredient";

function parseId(param: string) {
  const n = Number(param);
  if (!Number.isFinite(n) || n <= 0) throw new Error("잘못된 id");
  return n;
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    const body = await req.json();

    // 최소 필드 체크 (필요시 강화 가능)
    if (!body?.name || !body?.category || !body?.unit) {
      return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
    }

    const catEnum = koToEnum[body.category as CategoryKO] ?? "OTHER";
    const purchasedAt =
      body.purchaseDate && String(body.purchaseDate).length > 0
        ? new Date(body.purchaseDate)
        : null;
    const expiresAt =
      body.expiryDate && String(body.expiryDate).length > 0
        ? new Date(body.expiryDate)
        : null;

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        name: String(body.name).trim(),
        category: catEnum as any, // Prisma enum
        quantity:
          typeof body.quantity === "number"
            ? body.quantity
            : Number(body.quantity) || 0,
        unit: String(body.unit).trim(),
        purchasedAt,
        expiresAt,
      },
    });

    // UI 형태로 변환 (GET 라우트와 동일 포맷)
    const catKo = enumToKo[updated.category as keyof typeof enumToKo] ?? "기타";
    const today = new Date();
    const uiItem = {
      id: updated.id,
      name: updated.name,
      category: catKo,
      quantity: updated.quantity ?? 1,
      unit: updated.unit,
      purchaseDate: ymd(updated.purchasedAt ?? null),
      expiryDate: ymd(updated.expiresAt ?? null),
      daysLeft: calcDaysLeft(today, updated.expiresAt ?? null),
      emoji: emojiByKo[catKo] ?? "🍳",
    };

    return NextResponse.json(uiItem, { status: 200 });
  } catch (err: any) {
    console.error("[PATCH /api/ingredients/:id]", err);
    return NextResponse.json(
      { error: err?.message ?? "수정 실패" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ingredients/:id
 * - 항목을 즉시 삭제합니다.
 * - 성공 시 { ok: true }만 반환합니다.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params.id);
    await prisma.ingredient.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("[DELETE /api/ingredients/:id]", err);
    return NextResponse.json(
      { error: err?.message ?? "삭제 실패" },
      { status: 500 }
    );
  }
}
