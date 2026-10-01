"use client";

import { useGetMeQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { UserResponse } from "@/api/types";
import { ROUTES } from "@/constants/routes";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

type AuthContextValue = {
  userData: UserResponse | null;
  setUserData: (data: UserResponse) => void;
  isLoading: boolean;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  // 統一登入回呼頁不打 /me：舊 cookie 的使用者資料不能蓋掉即將換取的新身分，
  // 過期 cookie 的 401 也不該在這頁觸發任何導向。
  const isOauthCallback = pathname === ROUTES.oauthCallback.href;

  // 頁面載入或刷新時呼叫 /me，用 cookie 補水使用者資料
  // isPending 為 true 代表尚未取得資料（初始載入中）
  const { data = null, isPending } = useGetMeQuery({ enabled: !isOauthCallback });

  // 登入成功後：先寫入 ME 資料（避免 isPending 閃 true 造成白畫面），再移除其他使用者的快取
  const setUserData = (userData: UserResponse) => {
    queryClient.setQueryData([queryKeys.ME], userData);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== queryKeys.ME,
    });
  };

  return (
    <AuthContext.Provider
      value={{ userData: data, setUserData, isLoading: isPending }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};

export default AuthProvider;
