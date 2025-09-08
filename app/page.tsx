// app/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FridgeScreen from "@/components/FridgeScreen";
import AddIngredientModal from "@/components/AddIngredientModal";
import { addIngredientToList } from "@/lib/ingredientList";
import UpdateIngredientsModal from "@/components/UpdateIngredientModal";
import type { Ingredient } from "@/types";

export default function HomePage() {
  //  DB에서 불러온 재료 목록을 담는 상태
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  //  최초 로딩/에러 표시용
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 모달 가시성
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);


  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const fetchIngredients = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const res = await fetch("/api/ingredients", { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "재료 목록을 불러오지 못했어요.");
      }
      const data = await res.json();
      setIngredients((data?.items ?? []) as Ingredient[]);
    } catch (e: any) {
      setLoadError(e.message || "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  }, []);


  const openUpdateModal = useCallback((ing: Ingredient) => {
  setEditing(ing);
  setShowUpdateModal(true);
}, []);

const closeUpdateModal = useCallback(() => {
  setShowUpdateModal(false);
  setEditing(null);
}, []);

const handleUpdated = useCallback((updated: Ingredient) => {
    setIngredients((curr) =>
      curr.map((it) => (it.id === updated.id ? updated : it))
    );
  }, []);

  // 삭제 반영
  const handleDeleted = useCallback((id: string) => {
    setIngredients((curr) => curr.filter((it) => it.id !== id));
  }, []);

  // DB에서 목록 불러오기
  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const addIngredient = useCallback(
    (newIng: Omit<Ingredient, "id" | "daysLeft" | "available">) => {
      setIngredients((curr) => addIngredientToList(curr, newIng));
      setShowAddModal(false);
      setTimeout(() => addBtnRef.current?.focus(), 0);
    },
    [/* fetchIngredients */]
  );

  const refresh = useCallback(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  if (isLoading) {
    return (
      <main className="container mx-auto p-6">
        <div className="text-gray-600">불러오는 중…</div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="container mx-auto p-6">
        <div className="text-red-600 mb-4">목록을 불러오지 못했어요: {loadError}</div>
        <button
          onClick={refresh}
          className="rounded-lg px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          다시 시도
        </button>
      </main>
    );
  }

  

  // 화면 렌더링
  return (
    <>
      <FridgeScreen
        ingredients={ingredients}
        onAddIngredient={() => setShowAddModal(true)}
        onEditIngredient={openUpdateModal} 
      />
      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
        }}
        onAdd={addIngredient}
      />
      <UpdateIngredientsModal
        isOpen={showUpdateModal}
        ingredient={editing}
        onClose={closeUpdateModal}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </>
  );
}
