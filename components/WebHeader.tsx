"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import NavLoginButton from "./NavLoginButton";

export default function WebHeader() {
  const pathname = usePathname();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 기본 네비게이션 (모든 사용자에게 보임)
  const publicNav = [{ href: "/intro", label: "소개" }];

  // 로그인한 사용자만 볼 수 있는 네비게이션
  const privateNav = [
    { href: "/", label: "냉장고 관리" },
    { href: "/recipes", label: "레시피" },
    { href: "/records", label: "기록" },
  ];

  // 로그인 상태에 따라 네비게이션 결정
  const nav = isLoggedIn ? [...publicNav, ...privateNav] : publicNav;

  const isActive = (href: string) => {
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
              href={isLoggedIn ? "/" : "/intro"}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/favicon.png"
                alt="오늘의 냉장고 로고"
                width={38}
                height={38}
              />
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
            <Link
              href={isLoggedIn ? "/" : "/intro"}
              className="flex items-center gap-2"
            >
              <Image
                src="/favicon.png"
                alt="오늘의 냉장고 로고"
                width={25}
                height={25}
              />
              <h1 className="font-semibold text-[#374151]">오늘의 냉장고</h1>
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

      {/* 모바일 하단 네비게이션 - 로그인한 사용자만 표시 */}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-4 px-2 py-1">
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
      )}
    </>
  );
}
