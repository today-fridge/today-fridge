"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import NavLoginButton from "./NavLoginButton";

export default function WebHeader() {
  const pathname = usePathname();

  // 라우트 매핑: 기존 'fridge' → '/', 'recipe-search' → '/recipes/search'
  const nav = [
    { href: "/", label: "냉장고 관리", icon: "📦" },
    { href: "/recipes", label: "레시피", icon: "🔍" },
    { href: "/records", label: "내 기록", icon: "📊" },
  ] as const;

  const isActive = (href: string) => {
    // 홈은 정확히 '/', 레시피는 /recipes 하위 전부 활성 처리
    if (href === "/") return pathname === "/";
    if (href.startsWith("/recipes")) return pathname.startsWith("/recipes");
    return pathname === href;
  };

  return (
    <>
      {/* 데스크톱/태블릿 상단 헤더 */}
      <header className="hidden md:block bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* 로고 */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {/* PR #13(favicon 관련) 머지 후 아이콘 교체 예정 */}
              <div className="text-2xl lg:text-3xl">🌿</div>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-[#374151]">
                  오늘의 냉장고
                </h1>
                <p className="hidden lg:block text-xs text-[#6B7280]">
                  신선한 재료로 건강한 요리를
                </p>
              </div>
            </Link>

            {/* 가운데 네비게이션 */}
            <nav className="flex items-center justify-center gap-6 lg:gap-8 flex-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-2 px-6 lg:px-8 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(n.href)
                      ? "bg-[#10B981] text-white shadow-md"
                      : "text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <span className="text-base">{n.icon}</span>
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* 우측 아이콘들 */}
            <div className="flex items-center gap-2">
              {/* TODO: 카카오 알림까지 진행하면 해당 주석 해제 예정 */}
              {/* <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full" />
              </button> */}
              <NavLoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 상단 헤더 */}
      <header className="md:hidden bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl">🌿</div>
              <h1 className="font-semibold text-[#374151]">냉장고 요리사</h1>
            </Link>
            {/* TODO: 카카오 알림까지 진행하면 해당 주석 해제 예정 */}
            {/* <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
              <Bell className="w-5 h-5 text-[#6B7280]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button> */}

            <NavLoginButton />
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3 px-2 py-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200 ${
                isActive(n.href)
                  ? "text-[#10B981] bg-[#F0FDF4]"
                  : "text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              <span className="text-2xl mb-1">{n.icon}</span>
              <span
                className={`text-sm leading-tight text-center ${
                  isActive(n.href) ? "font-semibold" : "font-medium"
                }`}
              >
                {n.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
