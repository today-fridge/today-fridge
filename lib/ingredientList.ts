// lib/ingredientList.ts
import { calcDaysLeft } from "@/utils/date";
import type { Ingredient } from "@/types";
export type IngredientDraft = Omit<Ingredient, "id" | "daysLeft" | "available">;

function parseDateLike(iso: string) {
  // 'YYYY-MM-DD' 가정
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function createIngredient(
  draft: IngredientDraft,
  opts?: { idFactory?: () => string; today?: Date }
): Ingredient {
  const today = opts?.today ?? new Date();
  const id = opts?.idFactory?.() ?? String(Date.now());
  const expiryDate = draft.expiryDate ? parseDateLike(draft.expiryDate) : null;

  return {
    ...draft,
    id,
    daysLeft: calcDaysLeft(today, expiryDate),
    available: true,
  };
}

export function addIngredientToList(
  current: Ingredient[],
  draft: IngredientDraft,
  opts?: { idFactory?: () => string; today?: Date }
): Ingredient[] {
  const ingredient = createIngredient(draft, opts);
  return [...current, ingredient];
}
