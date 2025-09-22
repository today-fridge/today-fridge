"use client";

import { ChefHat, Refrigerator } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/config/supabase";

const Login = () => {
  const handleOAuthLogin = async (provider: "kakao" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/login/callback`,
        },
      });
      if (error) console.error(`${provider} 로그인 에러:`, error);
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-20 w-20 h-20 bg-teal-200/40 rounded-full blur-lg"></div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl px-10 pt-10 pb-6 max-w-lg w-full shadow-2xl border border-white/20 relative">
        {/* 메인 로고 섹션 */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 mb-6">
            {/* PR #13(favicon 관련) 머지 후 아이콘 교체 예정 */}
            <Refrigerator className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            오늘의 냉장고
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            신선한 재료로 만드는
            <br />
            <span className="font-semibold text-emerald-600">
              스마트한 요리 라이프
            </span>
            를 시작해보세요
          </p>
        </div>

        {/* 특징 카드들 */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Refrigerator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  스마트 재료 관리
                </h4>
                <p className="text-sm text-gray-600">
                  유통기한부터 재료 추천까지
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI 맞춤 레시피</h3>
                <p className="text-sm text-gray-600">
                  내 냉장고 재료로 완벽한 요리
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 소셜 로그인 */}
        <div className="relative flex items-center justify-center mb-6">
          <hr className="w-full h-px bg-gray-300 border-0" />
          <span className="absolute px-3 bg-white text-xs text-gray-500">
            간편 로그인
          </span>
        </div>

        <div className="space-y-4 w-full">
          {/* 구글 로그인 */}
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
          >
            <Image
              src="/login/btnGoogle.svg"
              alt="구글 로그인"
              width={22}
              height={22}
            />
            <span className="text-gray-700 font-medium group-hover:text-gray-900">
              Google 로그인
            </span>
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={() => handleOAuthLogin("kakao")}
            className="w-full flex items-center justify-center gap-3 bg-yellow-300 rounded-xl py-4 px-6 hover:bg-yellow-400 transition-all duration-200"
          >
            <Image
              src="/login/btnKakao.svg"
              alt="카카오 로그인"
              width={22}
              height={22}
            />
            <span className="text-gray-800 font-medium">카카오 로그인</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            로그인 시&nbsp;
            <span className="text-emerald-600 font-medium">이용약관</span> 및
            <span className="text-emerald-600 font-medium">
              &nbsp;개인정보보호정책
            </span>
            에 동의하게 됩니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
