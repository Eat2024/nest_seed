import { queryKeys } from "@/api/query-keys";
import { queryOptions } from "@/api/query-options";
import { getLoginOptions, getMe } from "@/api/requests";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetMeQuery<
  TData = Awaited<ReturnType<typeof getMe>>,
  TError = AxiosError,
>(
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.ME],
    queryFn: () => getMe(),
    ...queryOptions.useGetMeQuery,
    ...options,
  });
}

/** 登入頁可用入口（統一登入、開發者登入）。 */
export function useLoginOptionsQuery() {
  return useQuery({
    queryKey: [queryKeys.LOGIN_OPTIONS],
    queryFn: () => getLoginOptions(),
    ...queryOptions.useLoginOptionsQuery,
  });
}
