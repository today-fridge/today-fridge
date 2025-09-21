// app/api/ocr/route.ts
import { NextRequest, NextResponse } from "next/server";

interface OCRRequest {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    format: string | null | undefined;
    name: string;
    data: string;
  }>;
}

interface NaverOCRResponse {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    uid: string;
    name: string;
    inferResult: string;
    message: string;
    matchedTemplate?: {
      id: string;
      name: string;
    };
    validationResult?: {
      result: string;
    };
    fields: Array<{
      name: string;
      valueType: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
      inferText: string;
      inferConfidence: number;
      type: string;
      lineBreak: boolean;
    }>;
  }>;
}

// 요청 데이터 검증
function validateRequest(body: OCRRequest) {
  if (!body.images || body.images.length === 0) {
    throw new Error("이미지 데이터가 없습니다.");
  }

  const image = body.images[0];
  if (!image.data || !image.format) {
    throw new Error("이미지 형식이나 데이터가 올바르지 않습니다.");
  }
}

function getErrorMessage(status: number): string {
  const errorMessages: Record<number, string> = {
    400: "잘못된 요청 형식입니다. 이미지 데이터를 확인해주세요.",
    401: "API 인증에 실패했습니다. Secret Key를 확인해주세요.",
    413: "이미지 파일이 너무 큽니다. 5MB 이하로 업로드해주세요.",
    429: "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    500: "서버 내부 오류입니다. 잠시 후 다시 시도해주세요.",
  };

  return errorMessages[status] || `OCR API 호출 실패: ${status}`;
}

// api호출 함수
async function callOCRAPI(
  body: OCRRequest,
  apiUrl: string,
  secretKey: string
): Promise<NaverOCRResponse> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-OCR-SECRET": secretKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorMessage = getErrorMessage(response.status);
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    return await processOCRRequest(request);
  } catch (error: any) {
    console.error("OCR API 오류:", error.message);
    return NextResponse.json(
      {
        error: error.message || "OCR 처리 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// 로직 분리
async function processOCRRequest(request: NextRequest) {
  // 환경 변수 가져오기
  const NAVER_API_URL : string = process.env.NAVER_CLOVA_OCR_API_URL!;
  const NAVER_SECRET_KEY : string = process.env.NAVER_CLOVA_SECRET_KEY!;

  // 요청 데이터 파싱 및 검증
  let body: OCRRequest;
  try {
    body = await request.json();
  } catch (error) {
    throw new Error("잘못된 JSON 형식입니다.");
  }

  validateRequest(body);

  // 네이버 OCR API 호출
  const ocrResponse = await callOCRAPI(
    body,
    NAVER_API_URL,
    NAVER_SECRET_KEY
  );

  return NextResponse.json(ocrResponse);
}
