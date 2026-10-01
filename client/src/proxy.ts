import { SESSION_EXPIRED_PARAM } from "@/constants/routes";
import { NextRequest, NextResponse } from "next/server";

// 登入 token 的 HttpOnly cookie 名稱，須與後端 AUTH_COOKIE_NAME 一致
const AUTH_COOKIE_NAME = "NEST_SEED_AUTH_TOKEN";

// 不需要登入就能存取的路由
const PUBLIC_PATHS = ["/login"];

// 統一登入回呼頁：無條件放行（不論 cookie 是否存在或已過期），API 驗證由後端負責；
// 已有舊 cookie 也不能導回首頁，否則新登入永遠無法完成。
const OAUTH_CALLBACK_PATH = "/oauth/callback";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith(OAUTH_CALLBACK_PATH)) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // 未登入且存取是受保護的路由 → 重導向到登入頁，帶原頁路徑供登入後返回
  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") loginUrl.searchParams.set("redirectTo", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 統一登入失敗回登入頁顯示錯誤：即使殘留舊 cookie 也放行，否則會被導回首頁、訊息永遠看不到
  if (pathname === "/login" && req.nextUrl.searchParams.has("oauthError")) {
    return NextResponse.next();
  }

  // cookie 已失效（API 回 401 後導向登入頁並帶 expired）→ 清掉 cookie 再放行登入頁。
  // HttpOnly cookie 前端 JS 刪不掉，只能在這裡清；否則下面「有 cookie 就導回首頁」
  // 會與「首頁打 /me 得 401 再導回登入頁」形成無限重導。
  if (token && isPublic && req.nextUrl.searchParams.has(SESSION_EXPIRED_PARAM)) {
    const res = NextResponse.next();
    res.cookies.delete(AUTH_COOKIE_NAME);
    return res;
  }

  // 已登入且存取登入頁（重複登入）→ 重導向到首頁
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// 套用 proxy 的路由範圍
// 直接通過，不做登入檢查：API 路由（/api/*）、Next.js 內部資源（/_next/*）、favicon.ico、SVG 檔案
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\.svg).*)"],
};
