/**
 * 分頁欄位——一律攤平在回應第一層，不包 meta（2026-07-29 全站統一）。
 * 清單型回應以 `extends Pagination` 併入。
 */
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 分頁請求參數（皆選填；page 1 起算預設 1、pageSize 預設 50，預設值由 server 套用）。
 * 分頁型請求以 `PaginationParams & {...}` 併入。
 */
export type PaginationParams = Partial<Pick<Pagination, "page" | "pageSize">>;

/**
 * Cursor-based 分頁欄位——一律攤平在回應第一層，不包 meta。
 * 清單型回應以 `extends CursorPagination` 併入；跟 page-based 的 `Pagination`
 * 不同（沒有 page/pageSize，改用 hasMore/nextCursor 表示是否還有下一批、
 * 下一批要帶的游標），兩套機制不互通，呼叫端依各自 API 決定要用哪一套。
 */
export interface CursorPagination {
  total: number;
  hasMore: boolean;
  /** 下一批的起始游標；hasMore 為 false 時為 null */
  nextCursor: string | null;
}

/**
 * Cursor-based 分頁請求參數（皆選填；cursor 不帶＝第一批，limit 由 server
 * 套用預設值與上限）。分頁型請求以 `CursorPaginationParams & {...}` 併入。
 */
export interface CursorPaginationParams {
  /** 下一批的起始游標；不帶＝第一批 */
  cursor?: string;
  limit?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}
