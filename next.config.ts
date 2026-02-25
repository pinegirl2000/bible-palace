import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway 배포용 standalone 출력
  output: "standalone",

  // FLUX 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
      },
      {
        protocol: "https",
        hostname: "*.huggingface.co",
      },
    ],
  },
};

export default nextConfig;
