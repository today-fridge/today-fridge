// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import WebHeader from "@/components/WebHeader";

export const metadata: Metadata = {
  title: "나만의 냉장고 요리사",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* 헤더는 클라이언트 상호작용 필요하면 컴포넌트에 "use client" 추가 */}
        <WebHeader />
        <main className="min-h-screen">{children}</main>
        {/* 데스크톱 푸터가 App.tsx에 있었는데, 필요 시 여기로 이동 */}
      </body>
    </html>
  );
}
