// hooks/useIngredients.ts
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Ingredient } from "@/types";
import {
  getAllIngredients,
  getOneIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "@/services/ingredients";

// 캐시 키 상수
export const INGREDIENTS_QUERY_KEY = ["ingredients"];
export const ingredientQueryKey = (id: string) => ["ingredient", id];

// 재료 전체 조회
export const useIngredients = () => {
  console.log("🔍 useIngredients 훅 호출됨", {
    timestamp: new Date().toISOString(),
    // 호출 위치 추적
    stack: new Error().stack?.split("\n").slice(1, 4).join("\n"),
  });

  return useSuspenseQuery({
    queryKey: INGREDIENTS_QUERY_KEY,
    queryFn: () => {
      console.log("🌐 queryFn 실행 - API 호출 시작", {
        timestamp: new Date().toISOString(),
      });
      return getAllIngredients();
    },
    select: (data) => {
      console.log("📦 select 함수 실행:", {
        count: data?.items?.length,
        timestamp: new Date().toISOString(),
      });
      return data?.items ?? [];
    },
    // 디버깅용 추가 옵션
    staleTime: 0, // 일단 캐싱 완전 비활성화
    gcTime: 0,
  });
};
// 개별 재료 조회 훅
export const useIngredient = (id: string) => {
  return useSuspenseQuery({
    queryKey: ingredientQueryKey(id),
    queryFn: () => getOneIngredient(id),
  });
};

// 재료 추가
export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIngredient,
    onSuccess: (newIngredient) => {
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("재료 추가 실패:", error);
    },
  });
};

// 재료 수정 mutation
export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ingredient> }) =>
      updateIngredient(id, data),
    onSuccess: (updatedIngredient, { id }) => {
      // 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });

      // 개별 재료 캐시 업데이트
      queryClient.setQueryData(ingredientQueryKey(id), updatedIngredient);
    },
    onError: (error) => {
      console.error("재료 수정 실패:", error);
    },
  });
};

// 재료 삭제 mutation
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIngredient,
    onSuccess: (_, deletedId) => {
      // 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });

      // 개별 재료 캐시 삭제
      queryClient.removeQueries({ queryKey: ingredientQueryKey(deletedId) });
    },
    onError: (error) => {
      console.error("재료 삭제 실패:", error);
    },
  });
};
