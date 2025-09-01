// components/WebHeader.tsx
"use client";

import { User, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WebHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "홈", icon: "🏠" },
    { href: "/fridge", label: "냉장고관리", icon: "📦" },
    { href: "/recipe", label: "레시피검색", icon: "🔍" },
    { href: "/records", label: "내기록", icon: "📊" },
  ];

  return (
    <>
      {/* 데스크톱/태블릿 상단 헤더 */}
      <header className="hidden md:block bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* 로고 */}
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl lg:text-3xl">🌿</div>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-[#374151]">
                  나만의 냉장고 요리사
                </h1>
                <p className="hidden lg:block text-xs text-[#6B7280]">
                  신선한 재료로 건강한 요리를
                </p>
              </div>
            </Link>

            {/* 네비게이션 */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-[#F3F4F6] ${
                    pathname === item.href
                      ? "bg-[#10B981] text-white hover:bg-[#059669]"
                      : "text-[#374151]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* 우측 아이콘들 */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full text-xs"></span>
              </button>
              <Link
                href="/login"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
              >
                <User className="w-5 h-5 text-[#6B7280]" />
                <span className="text-sm text-[#374151]">로그인</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 상단 헤더 */}
      <header className="md:hidden bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="text-xl">🌿</div>
              <h1 className="font-semibold text-[#374151]">냉장고 요리사</h1>
            </Link>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50">
        <div className="grid grid-cols-4 px-2 py-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "text-[#10B981] bg-[#F0FDF4]"
                  : "text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span
                className={`text-xs leading-tight text-center ${
                  pathname === item.href ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
