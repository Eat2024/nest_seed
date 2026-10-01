import { ROUTES, SESSION_EXPIRED_LOGIN_HREF } from "@/constants/routes";
import axios from "axios";

// 在這些頁面收到 401 不做 redirect（登入頁本身未登入；
// 統一登入回呼頁自行處理失敗導向，不能被通用 401 攔截成循環）
const AUTH_PATHS = [ROUTES.login.href, ROUTES.oauthCallback.href];

/**
 * axios 沒帶 paramsSerializer 時，陣列參數的預設序列化是 `key[]=a&key[]=b`（bracket
 * 語法）；後端多選查詢參數（如 supplierNo）走的是 `toStringArray` 這套 helper，只認
 * 重複 query key（`key=a&key=b`）、逗號分隔字串、或單值三種形狀，不吃 bracket 語法
 * ——帶 bracket 送出等於 supplierNo 完全沒被解析到，後端會當成必填欄位缺漏拒絕。
 * 這裡自己序列化成重複 key，陣列以外的參數（string/number/boolean）維持原樣。
 */
const serializeParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    (Array.isArray(value) ? value : [value]).forEach((item) => {
      if (item !== undefined && item !== null) {
        searchParams.append(key, String(item));
      }
    });
  });
  return searchParams.toString();
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 帶上 HttpOnly cookie（token）
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: serializeParams,
});

api.interceptors.response.use(
  (response) => {
    // 後端統一包裝格式：{ success: true, data: {...} }
    // 攔截後直接回傳 data，讓 caller 不需要再解一層
    if (response.data?.success === true && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // 條件一：針對 HTTP 401（未授權）才做 redirect。其他錯誤（403、500 等）不應該把使用者踢回登入頁，交給 Snackbar 通知即可
    // 條件二：確保只在 client 端（window 是否存在）才做 redirect
    // 條件三：登入頁本身打 /login API 時，密碼錯誤後端也回 401 如果沒有這個排除，使用者輸入錯誤密碼，頁面就會立刻被 redirect 到 /login，變成死循環，且登入表單也無法顯示錯誤訊息
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !AUTH_PATHS.some((path) => window.location.pathname.startsWith(path))
    ) {
      window.location.href = SESSION_EXPIRED_LOGIN_HREF;
    }

    // 仍 reject 讓 ReactQueryProvider 的 onError 可以選擇性處理（401 在那裡會被略過）
    return Promise.reject(error);
  },
);

export default api;
