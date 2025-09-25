"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const NavLoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // 로그인/로그아웃 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
      >
        <Image
          src={user.user_metadata.avatar_url}
          alt="프로필 이미지"
          width={24}
          height={24}
          className="w-6 h-6 md:w-6 md:h-6 rounded-full object-cover"
        />
        <span className="hidden md:inline text-sm text-[#374151]">
          로그아웃
        </span>
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
    >
      <UserIcon className="w-5 h-5 md:w-5 md:h-5 text-[#6B7280]" />
      <span className="hidden md:inline text-sm text-[#374151]">로그인</span>
    </Link>
  );
};

export default NavLoginButton;
