import type { Metadata } from "next";
import "./globals.css";
import WebHeader from "@/components/WebHeader";
import AppProvider from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "나만의 냉장고 요리사",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <WebHeader />
        <main className="min-h-screen">
          <AppProvider>{children}</AppProvider>
        </main>
      </body>
    </html>
  );
}
