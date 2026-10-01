import { ROUTES } from "@/constants/routes";

/**
 * 登入後返回位置只接受站內相對路徑：以單一 `/` 開頭、不是 `//`／`/\`（會被當成站外網址）、
 * 不是登入／回呼頁本身。不合法一律回首頁。後端 OAuth 回呼另有同規則的檢查，這裡是
 * 前端導向用的版本。
 */
export const redirectToUri = (value: string | null | undefined): string => {
  if (!value || !value.startsWith("/")) return ROUTES.home.href;
  if (value.startsWith("//") || value.startsWith("/\\")) return ROUTES.home.href;
  if (
    value.startsWith(ROUTES.login.href) ||
    value.startsWith(ROUTES.oauthCallback.href)
  ) {
    return ROUTES.home.href;
  }
  return value;
};
