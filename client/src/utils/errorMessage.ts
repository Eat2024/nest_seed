import { ERROR_CODE_MAP } from "@/api/errorCodes";
import { ApiErrorResponse } from "@/api/types";
import axios from "axios";

export const getErrorMessage = (
  error: unknown,
  defaultValue: string = "發生錯誤，請稍後再試",
) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const code = error.response?.data?.error?.code;
    if (code && ERROR_CODE_MAP[code]) return ERROR_CODE_MAP[code];
    return error.response?.data?.error?.message ?? defaultValue;
  }
  return defaultValue;
};

/** 取出後端 error.code；不是 axios 錯誤或沒有 code 時回傳 undefined。 */
export const getErrorCode = (error: unknown): string | undefined =>
  axios.isAxiosError<ApiErrorResponse>(error)
    ? error.response?.data?.error?.code
    : undefined;
