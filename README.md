# <img width="40" height="40" alt="favicon" src="https://github.com/user-attachments/assets/a5f562c5-16c8-4d09-a019-9b5ea78d0e09" /> today-fridge(오늘의 냉장고)
- **사용 기술.** Next.js, TypeScript, Tanstack Query, Tailwind CSS, Prisma ORM, Naver OCR, OpenAI API, Supabase, Jira
- **개발 기간.** 2025.09.01 ~ 2025.09.30
- **팀 구성.** 2인 (프론트엔드 개발자)
- **배포 링크**: [https://tofresh.today](https://tofresh.today)

<br>

## 프로젝트 소개

**오늘의 냉장고**는 1인 가구의 식재료 관리 문제를 해결하기 위한 웹 애플리케이션입니다. 냉장고 재료 관리, AI 기반 레시피 추천, 요리 기록 통계를 하나의 플랫폼에서 제공하여 식재료 낭비를 줄이고 효율적인 식생활을 지원합니다.

<br>

## 개발 배경

이미 시중에는 많은 냉장고 관리 서비스가 있지만, 오늘의 냉장고는 경쟁 차별점이 있습니다.

| 구분 | 기존 냉장고 관리 서비스 | ✅ 오늘의 냉장고 |
|------|---------------------|-------------|
| **UI/UX** | 오래된 디자인 | 모던하고 직관적 디자인 |
| **AI 연동** | 미연동이거나 느린 응답 | ChatGPT 맞춤 추천 |
| **재료 관리** | 재료 등록 -> 요리 후 사용자 수기 변경 | 재료 등록 → 레시피 추천 → 요리 완료 → 자동 재료 차감까지 전 과정 통합 관리 |
| **레시피 제공** | URL을 통해서 이동되거나 미제공 | 사이트 내에서 직접 제공 |
| **핵심 가치** | 요리 중심<br>요리를 하기 위해 재료 구매 필요 | 재료 중심<br>보유한 재료로 만들 수 있는 요리 추천 |
| **통합서비스 제공** | 냉장고 관리 또는 레시피만 단독 제공 | 냉장고 관리 + 보유재고 기반 기본 레시피와 AI 레시피 + 요리 기록까지 원스톱 솔루션 |

<br>

## 역할 분담

| 담당 | 역할 및 상세 활동 |
|:------:|------------------|
| <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/8df93e36-9a88-4fb9-8949-b2e7607d0124" /><br/>**[김태희](https://github.com/Cloud-bb)** | **식재료 관리 담당**<br>• 재료 관리 UI/UX구현<br>• 냉장고 재료 입력/수정/삭제 기능<br>• 재료 유통기한 관리<br>• 재료별 카테고리 분류 기능<br>• 식재로 검색 및 필터링<br>• 영수증 OCR로 재료 자동 등록<br><br>**요리 기록**<br>• 월 별 요리 횟수, 자주 찾는 재료와 레시피 확인 기능 |
| <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/af7eec79-f431-4074-a5a8-dfc68f55f17a" /><br/>**팀장) [강지유](https://github.com/syg0629)** | **AI 레시피 추천 및 상세 요리 담당**<br>• 레시피 UI/UX 구현<br>• 기본 레시피 데이터 관리<br>• 요리 난이도별 필터링 기능<br>• Chat GPT를 통한 다양한 레시피 추천<br>• 사용자 보유 재료 기반 맞춤 레시피 제공<br><br>**소셜 로그인 기능**<br>• 카카오, 구글 <br><br>**오늘의 냉장고 소개 페이지**|

<br>

## 주요 기능

### 1. 냉장고 재료 관리

- **CRUD 기능**: 재료 등록, 수정, 삭제, 조회
- **영수증 OCR**: Naver Clova OCR API를 활용한 자동 재료 등록
- **유통기한 시각화**: 색상 코드로 재료 상태 구분 (빨강: 3일 이내, 노랑: 4-7일, 초록: 7일 이상)
- **카테고리 관리**: 채소, 과일, 육류, 해산물 등 체계적인 분류
- **검색 및 필터링**: 재료명 검색, 유통기한순 정렬

### 2. 레시피 추천

- **보유 재료 기반 매칭**: 냉장고 재료 매칭 알고리즘으로 조리 가능한 레시피 우선 표시
- **부족 재료 표시**: 1-2개 부족한 레시피도 함께 제공하여 선택 폭 확대
- **AI 레시피 생성**: ChatGPT API 연동으로 맞춤형 레시피 생성
- **난이도별 필터링**: 쉬움, 보통, 어려움 3단계 난이도 구분
- **재료 보유율 시각화**: 프로그레스 바로 조리 가능 여부 직관적 표시
- **요리 후 재료 자동 차감**: 레시피 완성 시 사용한 재료 수량 업데이트

### 3. 내 기록

- **월별 통계**: 요리 횟수, 자주 사용한 재료 분석
- **자주 사용한 재료**: 재료 사용 빈도 분석
- **즐겨찾기**: 완성 횟수 기반 TOP 레시피 표시

### 4. 사용자 인증

- **소셜 로그인**: 구글, 카카오 간편 인증

<br>

## 데이터 플로우

1. **재료 등록**: 사용자 입력 → Prisma ORM → Supabase DB
2. **레시피 조회**: TanStack Query → Next.js API → Supabase DB
3. **OCR 처리**: 이미지 업로드 → Naver OCR API → 결과 파싱 → DB 저장
4. **AI 레시피**: 재료 정보 → OpenAI API → 레시피 생성 → 화면 표시

<br>

## 작업 내용

각 이미지를 클릭해 보시면 더 자세히 보실 수 있습니다.

<table style="width: 100%; table-layout: fixed; text-align: center; vertical-align: middle;">
  <tr>
    <th align="center">소개</th>
    <th align="center">로그인</th>
  </tr>
  <tr>
    <td align="center"><img src="https://github.com/user-attachments/assets/9f866af5-41a0-4ce0-a914-ca8e44441918" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
    <td align="center"><img src="https://github.com/user-attachments/assets/e44b3324-233e-44e2-9260-34458a661985" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
  </tr>
  <tr>
    <th colspan="2" align="center">냉장고 관리</th>
  </tr>
  <tr>
    <td align="center">필터, 정렬, 검색</td>
    <td align="center">재료 추가시 영수증 OCR</td>
  </tr>
  <tr>
    <td align="center"><img src="https://github.com/user-attachments/assets/0bf6b56c-94cb-4727-b749-d386cac4e026" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
    <td align="center"><img src="https://github.com/user-attachments/assets/b097aac9-b62b-40ee-9821-47763a35908b" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
  </tr>
  <tr>
    <th colspan="2" align="center">레시피</th>
  </tr>
  <tr>
    <td align="center">필터, 보유율순 정렬, 검색</td>
    <td align="center">AI 레시피</td>
  </tr>
  <tr>
    <td align="center"><img src="https://github.com/user-attachments/assets/b39c9fd9-296f-4870-b8b1-dd962382fc4f" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
    <td align="center"><img src="https://github.com/user-attachments/assets/d40b41e1-b15c-44dd-a029-f4e7df7e20f3" style="width: 100%; height: auto; display: block; margin: 0 auto;"></td>
  </tr>
  <tr>
    <th colspan="2" align="center">기록</th>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/728b9b97-5da2-4907-91b5-dba19e624c9c" style="width: 48%; height: auto; display: block; margin: 0 auto;">
    </td>
  </tr>
</table>

<br>

## 향후 개발 계획

### Phase 1 - 게이미피케이션 강화

- 성취도 뱃지 시스템 구현
- 사용자 레벨링 및 경험치 시스템
- 활동 기반 포인트 및 리워드 제공

### Phase 2 - 웹 접근성 개선

- WCAG 2.1 AA 등급 달성
- 스크린 리더 최적화

### Phase 3 - 알림 시스템 구축

- 냉장고 재료 유통기한 임박 카카오톡 알림
- 실시간 푸시 알림 기능

### Phase 4 - 커머스 기능 확장

- 부족한 재료 자동 장바구니 추가
- PG사 연동 결제 시스템 구현
  
<br>
