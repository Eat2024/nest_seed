"use client";

import AppShell from "@/components/layouts/AppShell";
import { SESSION_EXPIRED_LOGIN_HREF } from "@/constants/routes";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const router = useRouter();
  const { userData, isLoading } = useAuthContext();

  // proxy 只擋沒有 cookie 的情況，此處負責處理 cookie 失效的 fallback
  useEffect(() => {
    // /me 載入完成且沒有 userData，代表 cookie 存在但已過期或無效，需重新導向登入頁
    if (!isLoading && !userData) {
      router.push(SESSION_EXPIRED_LOGIN_HREF);
    }
  }, [isLoading, userData, router]);

  // /me 還在載入中，避免畫面閃爍先不渲染
  if (isLoading) return null;

  // /me 載入完成但無 userData（cookie 失效），等待上方 useEffect 重新導向
  if (!userData) return null;

  return <AppShell>{children}</AppShell>;
};

export default DashboardLayout;
