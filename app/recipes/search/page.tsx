"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SearchClient = dynamic(() => import("./SearchClient"), { ssr: false });

export default function AllRecipesClient() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/recipes"
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#6B7280]" />
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#374151]">
                전체 레시피 모음
              </h1>
            </div>
          </div>
          <p className="text-[#6B7280] ml-14">
            보유 재료 순으로 정렬된 모든 레시피를 확인해보세요.
          </p>
        </div>
        
        <SearchClient />
      </div>
    </div>
  );
}
