// app/api/ocr/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface OCRRequest {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    format: string;
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

export async function POST(request: NextRequest) {
  try {
    console.log('=== OCR API 호출 시작 ===');
    
    const body: OCRRequest = await request.json();
    console.log('1. 요청 데이터 수신:', {
      version: body.version,
      requestId: body.requestId,
      imagesCount: body.images?.length || 0,
      firstImageFormat: body.images?.[0]?.format,
      firstImageDataLength: body.images?.[0]?.data?.length || 0
    });

    // 환경 변수 확인
    const NAVER_API_URL = process.env.NAVER_CLOVA_OCR_API_URL;
    const NAVER_SECRET_KEY = process.env.NAVER_CLOVA_SECRET_KEY;

    // 요청 데이터 검증
    if (!body.images || body.images.length === 0) {
      console.error('4. 이미지 데이터 없음');
      throw new Error('이미지 데이터가 없습니다.');
    }

    const image = body.images[0];
    if (!image.data || !image.format) {
      console.error('5. 이미지 정보 불완전:', { hasData: !!image.data, format: image.format });
      throw new Error('이미지 형식이나 데이터가 올바르지 않습니다.');
    }

    console.log('6. 네이버 CLOVA OCR API 호출 시작');
    
    // 네이버 CLOVA OCR API 호출
    const response = await fetch(NAVER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': NAVER_SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    console.log('7. 네이버 API 응답:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('8. 네이버 API 오류 응답:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500) // 처음 500자만 로깅
      });
      
      // 네이버 API 오류 코드에 따른 처리
      let errorMessage = `OCR API 호출 실패: ${response.status}`;
      switch (response.status) {
        case 400:
          errorMessage = '잘못된 요청 형식입니다. 이미지 데이터를 확인해주세요.';
          break;
        case 401:
          errorMessage = 'API 인증에 실패했습니다. Secret Key를 확인해주세요.';
          break;
        case 413:
          errorMessage = '이미지 파일이 너무 큽니다. 5MB 이하로 업로드해주세요.';
          break;
        case 429:
          errorMessage = 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 500:
          errorMessage = '서버 내부 오류입니다. 잠시 후 다시 시도해주세요.';
          break;
      }
      
      throw new Error(errorMessage);
    }

    const ocrResult: NaverOCRResponse = await response.json();

    // 결과 상세 로깅
    if (ocrResult.images && ocrResult.images[0]) {
      const imageResult = ocrResult.images[0];
      console.log('11. 첫 번째 이미지 결과:', {
        uid: imageResult.uid,
        name: imageResult.name,
        inferResult: imageResult.inferResult,
        message: imageResult.message,
        fieldsCount: imageResult.fields?.length || 0
      });

      if (imageResult.fields && imageResult.fields.length > 0) {
        imageResult.fields.slice(0, 10).forEach((field, index) => { // 처음 10개만 로깅
          console.log(`  [${index}] "${field.inferText}" (신뢰도: ${field.inferConfidence})`);
        });
      }
    }

    console.log('=== OCR API 호출 성공 ===');
    return NextResponse.json(ocrResult);

  } catch (error: any) {
    console.error('=== OCR API 호출 실패 ===');
    console.error('오류 상세:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500) // 스택 추적 일부만
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'OCR 처리 중 오류가 발생했습니다.',
        details: error.toString(),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}