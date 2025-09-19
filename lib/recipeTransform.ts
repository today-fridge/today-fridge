import {
  Recipe,
  RecipeIngredient,
  PrismaRecipe,
  IngredientForRecipe,
} from "@/types";

// 난이도 텍스트를 숫자로 변환
const getDifficultyNumber = (difficultyText: string): number => {
  if (difficultyText.includes("초급") || difficultyText.includes("아무나"))
    return 1;
  if (difficultyText.includes("중급")) return 3;
  if (difficultyText.includes("고급")) return 5;
  return 2;
};

// 조리시간 텍스트에서 숫자만 추출
const getCookingTimeNumber = (timeText: string): number => {
  const hourMatch = timeText.match(/(\d+)\s*시간/);
  const minuteMatch = timeText.match(/(\d+)\s*분/);

  let totalMinutes = 0;
  if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
  if (minuteMatch) totalMinutes += parseInt(minuteMatch[1], 10);

  return totalMinutes > 0 ? totalMinutes : 10;
};

// 통합된 단위 설정
const INGREDIENT_UNITS = {
  COUNT: ["개", "알", "송이", "장", "봉지", "공기"],
  WEIGHT_VOLUME: [
    "g",
    "kg",
    "ml",
    "L",
    "컵",
    "큰술",
    "작은술",
    "스푼",
    "숟가락",
    "T",
    "t",
  ],
  ABSTRACT: ["줌", "적당량", "약간", "조금"],
};

const UNITS = Object.values(INGREDIENT_UNITS).flat();
const pattern = new RegExp(
  `([가-힣a-zA-Z]+)\\s*([\\d./~\\-]*\\s*(?:${UNITS.join("|")})?)?`
);

const parseIngredients = (ingredientsText: string): RecipeIngredient[] => {
  return ingredientsText
    .split(",")
    .filter((item) => item.trim())
    .map((item) => {
      const match = item.trim().match(pattern);
      if (match) {
        const name = match[1];
        const qty = match[2] ? match[2].trim() : 0;
        return { name: name, quantity: qty };
      }
      return null;
    })
    .filter(Boolean) as RecipeIngredient[];
};

// 조리법 문자열을 배열로 변환
const parseSteps = (stepsText: string): string[] => {
  return stepsText
    .split(/\n/)
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.?\s*/, "").trim())
    .filter((line) => line);
};

// Prisma 데이터를 Recipe 형태로 변환
export const transformPrismaRecipe = (prismaRecipe: PrismaRecipe): Recipe => {
  return {
    id: prismaRecipe.id,
    name: prismaRecipe.CKG_NM,
    ingredients: parseIngredients(prismaRecipe.WEB_INGREDIENTS),
    steps: parseSteps(prismaRecipe.WEB_RECIPE_STEPS),
    difficulty: getDifficultyNumber(prismaRecipe.CKG_DODF_NM),
    cookingTime: getCookingTimeNumber(prismaRecipe.CKG_TIME_NM),
    servings: 1,
    imageUrl: prismaRecipe.IMAGE_URL || "/default-recipe.jpg",
    userName: prismaRecipe.RGTR_NM,
  };
};

// 여러 개의 Prisma 데이터를 Recipe 형태로 변환
export const transformPrismaRecipes = (
  prismaRecipes: PrismaRecipe[]
): Recipe[] => {
  return prismaRecipes.map(transformPrismaRecipe);
};

// 재료 보유율 계산
export const calculateAvailabilityRatio = ({
  userIngredientList,
  recipe,
}: {
  userIngredientList: IngredientForRecipe[];
  recipe?: Recipe;
}) => {
  if (!recipe) return 0;
  const availableCount = recipe.ingredients.filter((recipeIngredient) =>
    userIngredientList.some(
      (userIngredient) =>
        userIngredient.name.toLowerCase() ===
          recipeIngredient.name.toLowerCase() &&
        (userIngredient.available || userIngredient.quantity > 0)
    )
  ).length;
  return Math.round((availableCount / recipe.ingredients.length) * 100);
};

// 부족한 재료
export const getMissingIngredients = ({
  userIngredientList,
  recipe,
}: {
  userIngredientList: IngredientForRecipe[];
  recipe?: Recipe;
}) => {
  return (
    recipe?.ingredients
      .filter(
        (recipeIngredient) =>
          !userIngredientList.some(
            (userIngredient) =>
              userIngredient.name.toLowerCase() ===
                recipeIngredient.name.toLowerCase() &&
              (userIngredient.available || userIngredient.quantity > 0)
          )
      )
      .map((ingredient) => ingredient.name) ?? []
  );
};

// 레시피 난이도
export const getDifficultyText = (difficulty: number) => {
  if (difficulty <= 2) return "쉬움";
  if (difficulty === 3) return "보통";
  return "어려움";
};

// 재료 보유율에 따른 색상
export const getAvailabilityColor = (ratio: number) => {
  if (ratio >= 80) return "#10B981"; // 초록색 (80% 이상)
  if (ratio >= 50) return "#F59E0B"; // 주황색 (50% 이상)
  return "#EF4444"; // 빨간색 (50% 미만)
};

// 재료 보유율에 따른 배경색
export const getAvailabilityBgColor = (ratio: number) => {
  if (ratio >= 80) return "#F0FDF4"; // 연한 초록색
  if (ratio >= 50) return "#FFFBEB"; // 연한 주황색
  return "#FEF2F2"; // 연한 빨간색
};

// 레시피 재료 보유율 순으로 정렬하는 함수
export const sortRecipesByAvailability = (
  recipes: Recipe[],
  userIngredientList: IngredientForRecipe[]
): Recipe[] => {
  return recipes.sort((a, b) => {
    const ratioA = calculateAvailabilityRatio({
      recipe: a,
      userIngredientList,
    });
    const ratioB = calculateAvailabilityRatio({
      recipe: b,
      userIngredientList,
    });
    return ratioB - ratioA;
  });
};

const UNIT_MAP = new Map<string, "COUNT" | "WEIGHT_VOLUME" | "ABSTRACT">(
  Object.entries(INGREDIENT_UNITS).flatMap(([type, units]) =>
    units.map((unit) => [unit, type as "COUNT" | "WEIGHT_VOLUME" | "ABSTRACT"])
  )
);

const UNIT_REGEX = new RegExp(
  `(${Array.from(UNIT_MAP.keys()).join("|")})`,
  "i"
);
const NUMBER_REGEX = /([0-9.]+)/;

const getUnitType = (
  quantityText: string
): "COUNT" | "WEIGHT_VOLUME" | "ABSTRACT" => {
  const match = quantityText.match(UNIT_REGEX);
  if (!match) return "COUNT";

  return UNIT_MAP.get(match[1].toLowerCase()) || "COUNT";
};

// 재료 정규화 함수
export const normalizeIngredientForDisplay = (ingredient: RecipeIngredient) => {
  const { name, quantity } = ingredient;
  const quantityText = quantity.toString();
  const unitType = getUnitType(quantityText);

  const numericMatch = quantityText.match(NUMBER_REGEX);
  const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;

  let displayQuantity = 0;

  switch (unitType) {
    case "COUNT":
      displayQuantity = Math.max(0, Math.round(numericValue));
      break;
    case "WEIGHT_VOLUME":
    case "ABSTRACT":
      displayQuantity = numericValue > 0 ? 1 : 0;
      break;
  }

  return {
    name,
    displayQuantity,
    unitType,
    originalQuantity: quantity,
  };
};

// 재료 차감 로직
export const processIngredientUpdates = (
  originalFridgeIngredients: IngredientForRecipe[],
  modalUpdatedIngredients: { name: string; quantity: number }[]
) => {
  const usedIngredientsMap = new Map(
    modalUpdatedIngredients.map((item) => [
      item.name.toLowerCase(),
      item.quantity,
    ])
  );

  return originalFridgeIngredients.map((fridgeItem) => {
    const usedQuantity = usedIngredientsMap.get(fridgeItem.name.toLowerCase());

    if (usedQuantity !== undefined) {
      const newQuantity = Math.max(0, fridgeItem.quantity - usedQuantity);

      return {
        ...fridgeItem,
        quantity: newQuantity,
        available: newQuantity > 0,
      };
    }

    return fridgeItem;
  });
};
