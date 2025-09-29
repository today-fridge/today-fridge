import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDifficultyText,
  transformPrismaRecipes,
} from "@/lib/recipeTransform";
import { AiRecipe } from "@/types";
import { createClient } from "@/lib/supabase/server";

const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  return user;
};

export async function GET() {
  try {
    const user = await getUser();
    const prismaRecipes = await prisma.aiRecipe.findMany();

    if (!prismaRecipes || prismaRecipes.length === 0) {
      return NextResponse.json(
        { error: "레시피가 없습니다." },
        { status: 404 }
      );
    }

    const myAiRecipes = prismaRecipes.filter(
      (recipe) => user && recipe.RGTR_ID === user.id
    );

    const recipes = transformPrismaRecipes(myAiRecipes);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("[GET/api/recipes/ai-recipes] 서버 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { availableIngredients, ingredientDetails, requestCount = 3 } = body;

    if (!availableIngredients || !ingredientDetails) {
      return NextResponse.json(
        { error: "보유 재료 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // OpenAI API 호출
    const aiRecipes: AiRecipe[] = await callOpenAIAPI(
      availableIngredients,
      requestCount
    );

    if (!aiRecipes || aiRecipes.length === 0) {
      throw new Error("AI가 레시피를 생성하지 못했습니다.");
    }

    // 데이터베이스에 저장
    const savedRecipes = await saveRecipesToDB(aiRecipes);

    return NextResponse.json({ recipes: savedRecipes });
  } catch (error) {
    console.error("AI 레시피 생성 오류:", error);

    // 에러 시 기본 레시피 제공
    const fallbackRecipes = createDummyAIRecipes();
    return NextResponse.json({ recipes: fallbackRecipes });
  }
}

// OpenAI API 호출 함수
async function callOpenAIAPI(
  availableIngredients: string,
  requestCount: number
) {
  const prompt = `You are a STRICT Korean recipe validator. Your PRIMARY goal is to reject impossible recipes.

**CRITICAL: You must recommend EXACTLY ${requestCount} recipes. Not more, not less.**

**STEP 1: AVAILABLE INGREDIENTS LIST**
${availableIngredients}

**STEP 2: VALIDATION RULES (ABSOLUTE)**
- You can ONLY use ingredients explicitly listed above
- If "소금" is not listed, you CANNOT use salt
- If "식용유" is not listed, you CANNOT use oil
- If "밀가루" is not listed, you CANNOT make jeon/pancakes
- If "물" is not listed, you CANNOT use water
- NO substitutions, NO assumptions, NO creativity

**STEP 3: ALLOWED RECIPE PATTERNS**
Select ONLY from these verified Korean combinations:

Pattern A: IF (고기 + 김치) exist → 김치고기볶음
Pattern B: IF (달걀 + 밥 + 채소 1개 이상) exist → 볶음밥  
Pattern C: IF (두부 + 김치) exist → 두부김치
Pattern D: IF (감자 + 양파) exist → 감자볶음 (requires 식용유)
Pattern E: IF (요거트 + 과일) exist → 요거트볼
Pattern F: IF (계란 + 채소) exist → 계란볶음 (requires 식용유)
Pattern G: IF (고기 ONLY) exist → 구운고기 or 삶은고기
Pattern H: IF (채소 ONLY) exist → 생채소 or 데친채소

**FORBIDDEN PATTERNS:**
- Any meat + any fruit → NEVER
- Any meat + any jam/sweet spread → NEVER  
- Dairy + meat/fish → NEVER
- Any recipe requiring ingredients not in the list → NEVER

**STEP 4: RECIPE GENERATION PROCESS**
1. Identify ALL patterns (A-H) that match available ingredients
2. For each pattern, verify ALL required ingredients exist
3. If a pattern requires 식용유 but it's not listed, SKIP that pattern
4. Select ${requestCount} different recipes from verified patterns
5. Each recipe must use a different pattern or different ingredient combination
6. If fewer than ${requestCount} valid patterns exist, create variations using different ingredients from the same pattern
7. If still impossible to create ${requestCount} recipes, return as many valid recipes as possible

**STEP 5: mainIngredients FORMATTING RULES (CRITICAL)**
"mainIngredients" array must follow these rules strictly:

CORRECT examples:
- "감자"
- "양파"
- "견과류"
- "돼지고기"
- "채소"

WRONG examples (NEVER use):
- "견과류(아몬드)" ← NO parentheses
- "돼지고기(삼겹살)" ← NO parentheses
- "볶은 양파" ← NO cooking states
- "숙성 김치" ← NO descriptive states
- "신선한 채소" ← NO adjectives
- "CJ 햇반" ← NO brand names

**Rules:**
1. Use ONLY basic ingredient names
2. NO parentheses () allowed
3. NO cooking states (볶은, 삶은, 구운)
4. NO adjectives (신선한, 숙성된)
5. NO brand names
6. Use category names: "견과류" NOT "견과류(아몬드)"

**STEP 6: JSON OUTPUT FORMAT**

CRITICAL: Output must be valid JSON array with EXACTLY ${requestCount} recipe objects.

[
  {
    "name": "요리명1",
    "mainIngredients": ["재료1", "재료2"],
    "difficulty": 2,
    "cookingTime": 15,
    "servings": 1,
    "ingredients": ["재료명 분량"],
    "steps": ["조리과정1", "조리과정2"],
    "description": "요리 설명",
    "tips": "조리 팁"
  },
  {
    "name": "요리명2",
    "mainIngredients": ["재료3", "재료4"],
    "difficulty": 3,
    "cookingTime": 20,
    "servings": 1,
    "ingredients": ["재료명 분량"],
    "steps": ["조리과정1", "조리과정2"],
    "description": "요리 설명",
    "tips": "조리 팁"
  }
]

**Field Requirements:**
- "name": String
- "mainIngredients": Array of strings (NO parentheses)
- "difficulty": Number (1-5)
- "cookingTime": Number (minutes)
- "servings": Number (always 1)
- "ingredients": Array of strings
- "steps": Array of strings
- "description": String
- "tips": String

**JSON Validation:**
- Use numbers not strings: "difficulty": 3 NOT "difficulty": "3"
- Use numbers not strings: "cookingTime": 15 NOT "cookingTime": "15분"
- Use double quotes only
- Array must contain EXACTLY ${requestCount} recipe objects

**If cannot create ${requestCount} valid recipes:**
Return as many valid recipes as possible (minimum 1).

**FINAL CHECK:**
□ Output has EXACTLY ${requestCount} recipes?
□ Valid JSON format?
□ difficulty and cookingTime are numbers?
□ Every ingredient exists in Available Ingredients?
□ NO parentheses in mainIngredients?
□ NO cooking states in mainIngredients?
□ NO brand names?
□ All strings use double quotes?

OUTPUT ONLY THE JSON ARRAY. NO other text, explanation, or markdown.`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return createDummyAIRecipes();
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신은 실용적인 요리 전문가입니다. 한국식 요리에 특화되어 있고, 현실적이고 간단한 레시피만 추천합니다.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 오류: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    try {
      // [ ] 안의 JSON 배열 찾기
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // {} 형태의 JSON 객체 찾기
        const objMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (objMatch) {
          const obj = JSON.parse(objMatch[0]);
          return [obj]; // 배열로 변환
        }
      }

      throw new Error("JSON 형식을 찾을 수 없습니다.");
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError);
      return createDummyAIRecipes();
    }
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    return createDummyAIRecipes();
  }
}

// 데이터베이스 저장 함수
async function saveRecipesToDB(aiRecipes: AiRecipe[]) {
  const savedRecipes = [];
  const user = await getUser();

  for (const aiRecipe of aiRecipes) {
    try {
      // Prisma로 저장
      const savedRecipe = await prisma.aiRecipe.create({
        data: {
          RCP_TTL: aiRecipe.name,
          CKG_NM: aiRecipe.name,
          RGTR_ID: user?.id ?? "AI",
          RGTR_NM: "AI 셰프",
          CKG_MTH_ACTO_NM: "볶음",
          CKG_STA_ACTO_NM: "일상",
          CKG_MTRL_ACTO_NM: "기타",
          CKG_KND_ACTO_NM: "한식",
          CKG_IPDC: aiRecipe.description || "AI가 추천하는 요리",
          CKG_MTRL_CN: aiRecipe.ingredients?.join(", ") || "",
          CKG_INBUN_NM: `${aiRecipe.servings || 1}인분`,
          CKG_DODF_NM: getDifficultyText(aiRecipe.difficulty || 2),
          CKG_TIME_NM: `${aiRecipe.cookingTime || 20}분`,
          FIRST_REG_DT: BigInt(Date.now()),
          IMAGE_URL: "/ai-recipe.png",
          WEB_INGREDIENTS: aiRecipe.ingredients?.join(", ") || "",
          WEB_RECIPE_STEPS: aiRecipe.steps?.join("\n") || "",
          WEB_STEP_COUNT: aiRecipe.steps?.length || 3,
          WEB_INGREDIENT_COUNT: aiRecipe.ingredients?.length || 3,
          DATA_COLLECTED: "AI_GENERATED",
        },
      });

      savedRecipes.push({
        id: savedRecipe.id,
        name: savedRecipe.CKG_NM,
        ingredients: (aiRecipe.ingredients || []).map((ing: string) => {
          const parts = ing.split(" ");
          return {
            name: parts[0] || "재료",
            quantity: parts.slice(1).join(" ") || "적당량",
          };
        }),
        steps: aiRecipe.steps || ["요리하세요"],
        difficulty: aiRecipe.difficulty || 2,
        cookingTime: aiRecipe.cookingTime || 20,
        servings: aiRecipe.servings || 1,
        imageUrl: savedRecipe.IMAGE_URL,
        userName: savedRecipe.RGTR_NM,
      });
    } catch (saveError) {
      console.error("레시피 저장 실패:", saveError);
    }
  }

  return savedRecipes;
}

// 더미 AI 레시피 (Open AI가 작동되지 않을 때)
function createDummyAIRecipes() {
  return [
    {
      name: "간단한 계란 볶음요리",
      mainIngredients: ["계란", "밥"],
      difficulty: 2,
      cookingTime: 15,
      servings: 1,
      ingredients: ["계란 2개", "밥 1공기", "간장 1큰술", "식용유 1큰술"],
      steps: [
        "계란을 풀어주세요.",
        "팬에 식용유를 두르고 달궈주세요.",
        "계란을 넣고 스크램블을 만들어주세요.",
        "밥을 넣고 골고루 볶아주세요.",
        "간장으로 간을 맞춰 완성해주세요.",
      ],
      description: "간단하고 맛있는 한 끼 식사",
    },
  ];
}
