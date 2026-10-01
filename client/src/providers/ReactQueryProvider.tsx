"use client";

import { getErrorMessage } from "@/utils/errorMessage";
import { minutes } from "@/utils/time";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import { ReactNode, useState } from "react";
import { useSnackbarContext } from "./SnackbarProvider";

// 讓個別 mutation 可以宣告 meta.suppressGlobalErrorToast，跳過下面全域的
// showSnackbar；用在該 mutation 自己會依錯誤類型分流處理（例如 409 樂觀鎖
// 衝突要顯示 RemoteUpdateBanner 而非通用錯誤提示），避免全域跟元件各跳一次。
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      suppressGlobalErrorToast?: boolean;
    };
  }
}

interface Props {
  children: ReactNode;
}

const ReactQueryProvider = ({ children }: Props) => {
  const { showSnackbar } = useSnackbarContext();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(error) {
            // 401 由 Axios interceptor 負責 redirect，此處略過
            if (axios.isAxiosError(error) && error.response?.status === 401) return;
            showSnackbar(getErrorMessage(error), "error");
          },
        }),
        mutationCache: new MutationCache({
          onError(error, _variables, _onMutateResult, mutation) {
            if (axios.isAxiosError(error) && error.response?.status === 401) return;
            // 該 mutation 自己會處理錯誤顯示（例如樂觀鎖衝突走 banner 而非
            // 通用錯誤提示），避免全域跟元件重複跳兩次 Snackbar。
            if (mutation.meta?.suppressGlobalErrorToast) return;
            showSnackbar(getErrorMessage(error), "error");
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: minutes(5),
            gcTime: minutes(30),
            refetchOnWindowFocus: false,
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
