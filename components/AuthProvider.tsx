"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // 인증이 필요 없는 페이지들
  const publicPaths = ["/intro", "/login", "/login/callback"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      // 사용자가 있고, 로그인 페이지에 있다면 홈으로 리다이렉션
      if (user && pathname === "/login" && isPublicPath) {
        router.push("/");
        return;
      }

      // 사용자가 없고, 보호된 페이지에 있다면 로그인 페이지로 리다이렉션
      if (!user && !isPublicPath) {
        router.push("/login");
        return;
      }
    });
  }, [pathname, router, isPublicPath]);

  return <>{children}</>;
}
