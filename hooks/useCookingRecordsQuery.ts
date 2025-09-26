// hooks/useCookingRecordsQuery.ts
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCookingRecords,
  createCookingRecord,
  getIngredientUsageHistory,
  getRecipeCookingHistory,
  type CookingRecordsResponse,
  type UsedIngredient,
} from "@/services/cookingRecords";

// 쿼리 키 상수
export const COOKING_RECORDS_QUERY_KEY = ["cookingRecords"];
export const ingredientUsageQueryKey = (ingredientName: string) => [
  "ingredientUsage",
  ingredientName,
];
export const recipeCookingHistoryQueryKey = (recipeId: number) => [
  "recipeCookingHistory",
  recipeId,
];

// 요리 기록 전체 조회 (통계 포함) - 항상 실행되는 쿼리
export const useCookingRecords = (limit?: number) => {
  return useSuspenseQuery<CookingRecordsResponse>({
    queryKey: [...COOKING_RECORDS_QUERY_KEY, { limit }],
    queryFn: () => getCookingRecords(limit),
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: 2, // 실패시 2번 재시도
  });
};

// 요리 기록 생성 mutation
export const useCreateCookingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCookingRecord,
    onSuccess: (newRecord) => {
      // 모든 요리 기록 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COOKING_RECORDS_QUERY_KEY });

      console.log("요리 기록이 성공적으로 저장되었습니다:", newRecord);
    },
    onError: (error) => {
      console.error("요리 기록 생성 실패:", error);
    },
  });
};

// 이번 달 요리 통계만 조회
export const useMonthlyStats = () => {
  const { data } = useCookingRecords();
  return data.monthlyStats;
};

// 자주 사용한 재료 5개 조회
export const useFrequentIngredients = (limit: number = 5) => {
  const { data } = useCookingRecords();
  return data.frequentIngredients.slice(0, limit);
};

// 즐겨찾기 레시피 상위 조회 (지금은 자주 완성한 레시피보여줌)
export const useFavoriteRecipes = (limit: number = 5) => {
  const { data } = useCookingRecords();
  return data.favoriteRecipes.slice(0, limit);
};

// 최근 요리 기록 조회
export const useRecentCookings = (limit: number = 10) => {
  const { data } = useCookingRecords(limit);
  return data.recentRecords;
};
