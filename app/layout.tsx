import type { Metadata } from "next";
import "./globals.css";
import WebHeader from "@/components/WebHeader";
import AppProvider from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "오늘의 냉장고",
  icons:{
    icon:"/favicon.png"
  }
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
