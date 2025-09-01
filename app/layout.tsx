import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import WebHeader from "@/components/WebHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "나만의 냉장고 요리사",
  description: "신선한 재료로 건강한 요리를",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <WebHeader />
        {children}
      </body>
    </html>
  );
}
