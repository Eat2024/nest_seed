import type { NextConfig } from "next";
import path from "path";

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  // 允許非 localhost 裝置（如同網段的 iPad）存取 dev server 的 HMR WebSocket 與 RSC payload
  // allowedDevOrigins 只在 next dev（開發模式）下有作用。
  // Production build（next build + next start）完全忽略這個設定，因為 production 環境不存在 HMR WebSocket 和 RSC dev payload 這些機制。
  allowedDevOrigins: [],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),


  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
