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
  const prompt = `You are a Korean recipe AI. Create REALISTIC, EDIBLE recipes only.

**AVAILABLE INGREDIENTS:**
${availableIngredients}

**CRITICAL: FLAVOR COMPATIBILITY RULES**

**ABSOLUTELY FORBIDDEN COMBINATIONS:**
1. 요거트/우유 + 파/마늘/양파 → NEVER (단맛/신맛 + 매운맛 = 불가)
2. 단 재료 (잼, 꿀, 설탕) + 짠 재료 (생선, 고기) → NEVER (디저트 ≠ 메인요리)
3. 생선 + 우유/치즈 → NEVER (비린내 증폭)
4. 과일 + 고기 → NEVER (한식에서는 비현실적)
5. 요거트 + 김치/된장 → NEVER (발효식품 충돌)

**FLAVOR CATEGORY GROUPING:**
- **단맛 그룹**: 요거트, 우유, 과일, 꿀, 잼, 견과류, 시리얼
- **매운/짠맛 그룹**: 김치, 고추, 파, 마늘, 고추장, 된장, 간장
- **담백 그룹**: 두부, 계란, 밥, 면, 감자
- **고기/생선 그룹**: 소고기, 돼지고기, 닭고기, 생선

**COMBINATION RULES:**
- 단맛 그룹 끼리만 조합 (예: 요거트 + 견과류 + 과일)
- 매운/짠맛 그룹 + 담백 그룹 (예: 김치 + 두부 + 밥)
- 고기/생선 그룹 + 담백 그룹 + 야채 (예: 돼지고기 + 양파 + 밥)

**REALISTIC KOREAN RECIPE PATTERNS:**

**A. 요거트/우유 있을 때:**
- 요거트 + 견과류 + 과일 → 요거트볼
- 우유 + 시리얼 + 과일 → 시리얼볼
- 요거트 + 꿀 + 견과류 → 그릭요거트
- ❌ 절대 파/마늘/김치와 섞지 않기

**B. 밥 있을 때:**
- 밥 + 계란 + 야채 + 간장 → 볶음밥
- 밥 + 김치 + 참기름 → 김치볶음밥
- 밥 + 고기 + 야채 → 덮밥

**C. 고기 있을 때:**
- 고기 + 양파 + 간장 → 불고기
- 고기 + 야채 + 고추장 → 제육볶음
- ❌ 잼/요거트와 섞지 않기

**D. 야채만 있을 때:**
- 야채 + 참기름 + 소금 → 나물무침
- 야채 + 식초 + 설탕 → 샐러드

**E. 김치 있을 때:**
- 김치 + 두부 + 파 → 김치찌개
- 김치 + 밥 + 참기름 → 김치볶음밥
- ❌ 우유/요거트와 섞지 않기

**RECIPE GENERATION PROCESS:**
1. Identify the MAIN ingredient flavor category
2. Select ONLY compatible ingredients from the same/complementary category
3. Follow established Korean recipe patterns
4. Verify the combination is actually edible

**QUALITY VALIDATION:**
Before outputting each recipe, ask yourself:
□ Would a real Korean person eat this?
□ Do these flavors actually go together?
□ Is this a recognized recipe pattern?
□ Am I mixing sweet + savory incorrectly?

**OUTPUT FORMAT:**
Generate EXACTLY ${requestCount} realistic recipes in JSON:

\`\`\`json
[
  {
    "name": "요리명",
    "mainIngredients": ["주재료1", "주재료2"],
    "difficulty": 2,
    "cookingTime": 15,
    "servings": 1,
    "ingredients": ["재료명 수량"],
    "steps": ["단계1", "단계2"],
    "description": "설명",
    "tips": "팁"
  }
]
\`\`\`

**EXAMPLE (Current ingredients: 요거트, 건과류, 파):**
❌ WRONG: "요거트 건과류 파 샐러드" (파와 요거트는 맛이 안 맞음!)
✅ CORRECT: Two separate recipes:
   1. "요거트 건과류볼" (요거트 + 건과류만)
   2. "파 무침" (파 + 참기름 + 소금)

OUTPUT ONLY JSON. NO explanations.`;

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
