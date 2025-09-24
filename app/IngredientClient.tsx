"use client";

import { useCallback, useRef, useState } from "react";
import FridgeScreen from "@/components/FridgeScreen";
import AddIngredientModal from "@/components/AddIngredientModal";
import UpdateIngredientsModal from "@/components/UpdateIngredientModal";
import type { Ingredient } from "@/types";
import {
  useIngredients,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from "@/hooks/useIngredientQuery";

const IngredientClient = () => {
  // useSuspenseQuery를 사용하는 훅 - 자동으로 Suspense 모드 활성화
  const { data: ingredients } = useIngredients();

  // React Query mutations
  const createIngredientMutation = useCreateIngredient();
  const updateIngredientMutation = useUpdateIngredient();
  const deleteIngredientMutation = useDeleteIngredient();

  // 모달 가시성
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const openUpdateModal = useCallback((ing: Ingredient) => {
    setEditing(ing);
    setShowUpdateModal(true);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setShowUpdateModal(false);
    setEditing(null);
  }, []);

  const handleUpdated = useCallback(
    (updated: Ingredient) => {
      // React Query mutation 사용하여 서버 업데이트 + 캐시 무효화
      updateIngredientMutation.mutate(
        { id: updated.id, data: updated },
        {
          onSuccess: () => {
            setShowUpdateModal(false);
            setEditing(null);
          },
          onError: (err) => {
            alert(
              err instanceof Error
                ? err.message
                : "수정 중 오류가 발생했습니다."
            );
          },
        }
      );
    },
    [updateIngredientMutation]
  );

  const handleDeleted = useCallback(
    (id: string) => {
      // React Query mutation 사용하여 서버에서 삭제 + 캐시 무효화
      deleteIngredientMutation.mutate(id, {
        onSuccess: () => {
          setShowUpdateModal(false);
          setEditing(null);
        },
        onError: (err) => {
          alert(
            err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
          );
        },
      });
    },
    [deleteIngredientMutation]
  );

  const addIngredient = useCallback(
    (newIng: Omit<Ingredient, "id" | "daysLeft" | "available">) => {
      // React Query mutation 사용하여 서버에 추가 + 캐시 무효화
      createIngredientMutation.mutate(newIng, {
        onSuccess: () => {
          setShowAddModal(false);
          setTimeout(() => addBtnRef.current?.focus(), 0);
        },
        onError: (err) => {
          alert(
            err instanceof Error ? err.message : "추가 중 오류가 발생했습니다."
          );
        },
      });
    },
    [createIngredientMutation]
  );
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
};

export default IngredientClient;
