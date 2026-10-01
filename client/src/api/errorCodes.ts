/**
 * 後端 error.code 對照表
 * 新增 code 時在此維護，getErrorMessage 會自動套用。
 */
export const ERROR_CODE_MAP: Record<string, string> = {
  // --- Auth ---
  ACCOUNT_DISABLED: "帳號已停用，請聯繫管理員",
  TOKEN_EXPIRED: "登入已過期，請重新登入",
  TOKEN_INVALID: "登入憑證無效，請重新登入",
  AUTH_SESSION_UNAVAILABLE: "無法確認登入撤銷，請稍後再試",
  CSRF_ORIGIN_REJECTED: "請求來源不允許，請重新整理頁面後再試",

  // --- 饗賓統一登入 ---
  OAUTH_TRANSACTION_INVALID: "登入已逾時或已使用，請重新登入",
  OAUTH_LOGIN_CANCELLED: "已取消統一登入，請重新登入",
  OAUTH_RESPONSE_INVALID: "統一登入身分驗證失敗，請重新登入",
  OAUTH_UNAVAILABLE: "統一登入暫時無法使用，請稍後再試",

  // --- Permission ---
  PERMISSION_DENIED: "您沒有執行此操作的權限",

  // --- Resource ---
  NOT_FOUND: "找不到相關資料",
  DUPLICATE_ENTRY: "資料已存在，請勿重複新增",

  // --- Validation ---
  VALIDATION_ERROR: "輸入資料格式有誤，請確認後再試",
  MISSING_REQUIRED_FIELD: "有必填欄位未填寫",

  // --- Server ---
  INTERNAL_SERVER_ERROR: "伺服器發生錯誤，請稍後再試",
  SERVICE_UNAVAILABLE: "服務暫時無法使用，請稍後再試",
  TIMEOUT: "請求逾時，請稍後再試",
};
