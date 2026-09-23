/**
 * 穩定業務錯誤碼（單一事實來源）。新增 feature 時於此擴充。
 */
export const AppErrorCode = {
  /** DTO / ValidationPipe 驗證失敗（泛用） */
  INVALID_REQUEST: 'INVALID_REQUEST',
  /** 未帶 / 無效 / 已撤銷 token */
  UNAUTHORIZED: 'UNAUTHORIZED',
  /** 權限不足 */
  FORBIDDEN: 'FORBIDDEN',
  /** 資源不存在 */
  NOT_FOUND: 'NOT_FOUND',
  /** 請求過於頻繁（速率限制） */
  REFUSE_SERVICE: 'REFUSE_SERVICE',
  /** 請求 Origin 不在允許清單（跨站請求防護） */
  CSRF_ORIGIN_REJECTED: 'CSRF_ORIGIN_REJECTED',
  /** 未預期錯誤（既有 handler 預設） */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];
