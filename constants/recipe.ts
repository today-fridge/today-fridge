// 재료 모두 소유
export const MAX_AVAILABILITY_RATIO = 100;

// 재료 단위 설정
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
} as const 

export type IngredientUnitKeys = keyof typeof INGREDIENT_UNITS;

const INGREDIENT_UNITS_VALUES = Object.values(INGREDIENT_UNITS).flat();
export const INGREDIENT_UNITS_PATTERN = new RegExp(
  `([가-힣a-zA-Z]+)\\s*([\\d./~\\-]*\\s*(?:${INGREDIENT_UNITS_VALUES.join(
    "|"
  )})?)?`
);

export const INGREDIENT_UNITS_MAP = new Map<string, IngredientUnitKeys>(
  Object.entries(INGREDIENT_UNITS).flatMap(([type, units]) =>
    units.map((unit) => [unit, type as IngredientUnitKeys])
  )
);

export const INGREDIENT_UNITS_REGEX = new RegExp(
  `(${Array.from(INGREDIENT_UNITS_MAP.keys()).join("|")})`,
  "i"
);
export const INGREDIENT_UNITS_NUMBER_REGEX = /([0-9.]+)/;
