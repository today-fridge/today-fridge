import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 구글, 카카오 로그인 후 사용자 이미지 가져오기
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
