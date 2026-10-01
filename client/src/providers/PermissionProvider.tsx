"use client";

import { JobKey, PermissionAction } from "@/api/types";
import { createContext, ReactNode, useContext } from "react";
import { useAuthContext } from "./AuthProvider";

type PermissionContextValue = {
  hasPermission: (jobKey: JobKey, ...actions: PermissionAction[]) => boolean;
};

type Props = {
  children: ReactNode;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

const PermissionProvider = ({ children }: Props) => {
  const { userData } = useAuthContext();

  // 檢查當前使用者對某功能（jobKey）是否擁有指定的操作權限（action）
  // job.enabled 為 false 代表該功能整組被停用，即使單一 permission.checked 為 true 也不放行
  const hasPermission = (jobKey: JobKey, ...actions: PermissionAction[]) => {
    if (!userData) return false;

    const job = userData.jobPermissions.find((item) => item.jobKey === jobKey);

    if (!job || !job.enabled) return false;

    return actions.every(
      (action) =>
        job.permissions.find((item) => item.action === action)?.checked ??
        false,
    );
  };

  return (
    <PermissionContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx)
    throw new Error(
      "usePermissionContext must be used within PermissionProvider",
    );
  return ctx;
};

export default PermissionProvider;
