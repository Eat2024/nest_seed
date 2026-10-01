import api from "@/api/config";
import { endpoints } from "@/api/endpoints";
import {
  LoginOptionsResponse,
  LogoutResponse,
  OauthCallbackResponse,
  OauthStartResponse,
  UserResponse,
} from "@/api/types";

export type OauthStartRequest = {
  /** 登入完成後返回的站內路徑；後端會再驗證，不合法則進首頁 */
  redirectTo?: string;
};

export type OauthCallbackRequest = {
  state: string;
  code?: string;
  error?: string;
  /** 上游回傳的 issuer，交後端 OIDC 套件驗證。 */
  iss?: string;
};

/**
 * @name 登出
 * @description 本地一律完成；upstreamLogout 為統一登入的上游結果，unconfirmed 時附提示
 */
export const logout = async (): Promise<LogoutResponse> => {
  const res = await api<LogoutResponse>({
    method: "POST",
    url: endpoints.LOGOUT,
  });
  return res.data;
};

/**
 * @name 登入入口旗標
 * @description 登入頁依此決定顯示統一登入／開發者登入按鈕
 */
export const getLoginOptions = async (): Promise<LoginOptionsResponse> => {
  const res = await api<LoginOptionsResponse>({
    method: "GET",
    url: endpoints.LOGIN_OPTIONS,
  });
  return res.data;
};

/**
 * @name 開發者登入
 * @description 僅後端 DEVMOD=true 時開放；以超級管理員登入，token 以 HttpOnly cookie 下發
 */
export const devLogin = async (): Promise<UserResponse> => {
  const res = await api<UserResponse>({
    method: "POST",
    url: endpoints.DEV_LOGIN,
  });
  return res.data;
};

/**
 * @name 發起Oauth2.0登入
 * @description 後端建立登入交易並回授權網址；呼叫端整頁導向該網址
 */
export const oauthStart = async (
  data: OauthStartRequest,
): Promise<OauthStartResponse> => {
  const res = await api<OauthStartResponse>({
    method: "POST",
    url: endpoints.OAUTH_START,
    data,
  });
  return res.data;
};

/**
 * @name 統一登入回呼
 * @description 回呼頁擷取 code／state 後同源 POST；成功即下發 HttpOnly cookie
 */
export const oauthCallback = async (
  data: OauthCallbackRequest,
): Promise<OauthCallbackResponse> => {
  const res = await api<OauthCallbackResponse>({
    method: "POST",
    url: endpoints.OAUTH_CALLBACK,
    data,
  });
  return res.data;
};

/**
 * @name 取得目前登入者資料、角色與導覽
 */
export const getMe = async (): Promise<UserResponse> => {
  const res = await api<UserResponse>({
    method: "GET",
    url: endpoints.ME,
  });
  return res.data;
};
