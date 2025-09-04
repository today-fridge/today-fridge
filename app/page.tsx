// app/page.tsx
"use client";
import { useCallback, useRef, useState } from "react";
import FridgeScreen from "@/components/FridgeScreen";
import AddIngredientModal from "@/components/AddIngredientModal";
import { initialIngredients } from "@/data/sampleData";
import { addIngredientToList } from "@/lib/ingredientUtils";
import type { Ingredient } from "@/types";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [showAddModal, setShowAddModal] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const addIngredient = useCallback(
    (newIng: Omit<Ingredient, "id" | "daysLeft" | "available">) => {
      setIngredients((curr) => addIngredientToList(curr, newIng));
      setShowAddModal(false);
      // 모달 닫힌 뒤 포커스 복귀 (선택)
      setTimeout(() => addBtnRef.current?.focus(), 0);
    },
    []
  );

  return (
    <>
      <FridgeScreen
        ingredients={ingredients}
        onAddIngredient={() => setShowAddModal(true)}
      />
      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setTimeout(() => addBtnRef.current?.focus(), 0);
        }}
        onAdd={addIngredient}
      />
    </>
  );
}
