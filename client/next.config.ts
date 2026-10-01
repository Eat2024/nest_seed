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

  experimental: {
    // 關閉 Turbopack 的 dev 持久快取（16.1 起預設開啟）。開啟時共用的 root layout
    // chunk list 每次頁面請求都會被重寫、且不同頁面寫出不同內容，瀏覽器剛好在寫入
    // 當下抓到就會 ChunkLoadError（頁面無法 hydrate，如卡在 /oauth/callback），
    // 快取錯亂時還會讓 HMR 一直發 restart 造成無限 reload。只影響 next dev。
    turbopackFileSystemCacheForDev: false,
  },

  // 統一登入回呼頁：query 帶一次性 code／state，不快取、不外洩 Referer。
  async headers() {
    return [
      {
        source: "/oauth/callback",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },


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
