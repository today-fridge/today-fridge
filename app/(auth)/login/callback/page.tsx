"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Loader from "@/app/loading";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 정보 가져오기
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("인증 에러:", error);
          router.push("/login");
          return;
        }

        if (data.session) {
          await saveUserToPrisma(data.session.user);
          router.push("/");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("콜백 처리 실패:", error);
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  // Prisma로 사용자 정보 저장하는 함수
  const saveUserToPrisma = async (user: User) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar: user.user_metadata?.avatar_url,
          provider: user.app_metadata?.provider,
        }),
      });

      if (!response.ok) {
        throw new Error("사용자 저장 실패");
      }
    } catch (error) {
      console.error("Prisma 저장 에러:", error);
    }
  };

  return <Loader />;
}
