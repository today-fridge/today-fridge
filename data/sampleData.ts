import { Ingredient, Recipe } from '../types';

export const initialIngredients: Ingredient[] = [
  {
    id: '1',
    name: '당근',
    category: '야채',
    quantity: 2,
    unit: '개',
    purchaseDate: '2025-08-23',
    expiryDate: '2025-09-06',
    daysLeft: 7,
    emoji: '🥕',
    available: true
  },
  {
    id: '2',
    name: '우유',
    category: '유제품',
    quantity: 1,
    unit: '팩',
    purchaseDate: '2025-08-29',
    expiryDate: '2025-08-31',
    daysLeft: 1,
    emoji: '🥛',
    available: true
  },
  {
    id: '3',
    name: '계란',
    category: '기타',
    quantity: 8,
    unit: '개',
    purchaseDate: '2025-08-25',
    expiryDate: '2025-09-10',
    daysLeft: 11,
    emoji: '🥚',
    available: true
  },
  {
    id: '4',
    name: '양파',
    category: '야채',
    quantity: 3,
    unit: '개',
    purchaseDate: '2025-08-20',
    expiryDate: '2025-09-15',
    daysLeft: 16,
    emoji: '🧅',
    available: true
  },
  {
    id: '5',
    name: '양파',
    category: '야채',
    quantity: 3,
    unit: '개',
    purchaseDate: '2025-08-20',
    expiryDate: '',
    daysLeft: 16,
    emoji: '🧅',
    available: true
  }
];

export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: '간단한 당근볶음',
    difficulty: 2,
    cookingTime: 15,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    ingredients: [
      { name: '당근', quantity: '1개', available: true },
      { name: '마늘', quantity: '2쪽', available: false },
      { name: '간장', quantity: '1큰술', available: false },
      { name: '식용유', quantity: '1큰술', available: false }
    ],
    steps: [
      '당근을 채 썰어 준비합니다.',
      '팬에 기름을 두르고 마늘을 볶습니다.',
      '당근을 넣고 중불에서 볶아줍니다.',
      '간장으로 간을 맞춰줍니다.',
      '접시에 담아 완성합니다.'
    ],
    availableIngredients: 1,
    totalIngredients: 4
  },
  {
    id: '2',
    name: '당근 오믈렛',
    difficulty: 2,
    cookingTime: 20,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    ingredients: [
      { name: '계란', quantity: '2개', available: true },
      { name: '당근', quantity: '1/2개', available: true },
      { name: '우유', quantity: '2큰술', available: true },
      { name: '소금', quantity: '조금', available: false }
    ],
    steps: [
      '당근을 잘게 다져줍니다.',
      '계란을 풀어 우유와 섞습니다.',
      '팬에 기름을 두르고 당근을 볶습니다.',
      '계란물을 부어 오믈렛을 만듭니다.',
      '접시에 담아 완성합니다.'
    ],
    availableIngredients: 3,
    totalIngredients: 4
  },
  {
    id: '3',
    name: '계란볶음밥',
    difficulty: 3,
    cookingTime: 25,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    ingredients: [
      { name: '계란', quantity: '3개', available: true },
      { name: '밥', quantity: '2공기', available: false },
      { name: '대파', quantity: '1대', available: false },
      { name: '간장', quantity: '2큰술', available: false }
    ],
    steps: [
      '계란을 잘 풀어줍니다.',
      '팬에 기름을 두르고 계란을 스크램블합니다.',
      '밥을 넣고 볶아줍니다.',
      '대파와 간장을 넣어 마무리합니다.',
      '접시에 담아 완성합니다.'
    ],
    availableIngredients: 1,
    totalIngredients: 4
  },
  {
    id: '4',
    name: '양파볶음',
    difficulty: 1,
    cookingTime: 10,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop',
    ingredients: [
      { name: '양파', quantity: '1개', available: true },
      { name: '식용유', quantity: '1큰술', available: false },
      { name: '소금', quantity: '조금', available: false }
    ],
    steps: [
      '양파를 채 썰어줍니다.',
      '팬에 기름을 두르고 양파를 볶습니다.',
      '소금으로 간을 맞춰줍니다.',
      '접시에 담아 완성합니다.'
    ],
    availableIngredients: 1,
    totalIngredients: 3
  }
];