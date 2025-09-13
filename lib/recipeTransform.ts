import { Recipe, RecipeIngredient, PrismaRecipe } from "@/types";

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

// 재료 문자열을 배열로 변환
const UNITS = [
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
  "개",
  "줌",
  "봉지",
  "장",
  "알",
  "공기",
  "송이",
  "적당량",
  "약간",
  "조금",
];

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
        const qty = match[2] ? match[2].trim() : null;
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
