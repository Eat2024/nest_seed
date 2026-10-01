import { PermissionAction } from "@/api/types";
import { permissionActions } from "@/configs/permissionActions";
import { useState } from "react";

// 角色的權限勾選狀態：jobKey → action → 是否勾選
export type Permissions = Record<string, Record<string, boolean>>;

// 依 permissionActions 設定檔展開的「全未勾選」狀態，作為新增角色時的初始值
export const emptyPermissions: Permissions = Object.fromEntries(
  permissionActions.flatMap((group) =>
    group.jobs.map((job) => [
      job.jobKey,
      Object.fromEntries(job.permissions.map((p) => [p.action, false])),
    ]),
  ),
);

// 角色權限勾選狀態的管理 hook（RoleForm 使用，新增/編輯角色頁共用）：
// 以 permissionActions 設定檔為結構來源，提供群組全選、單一 job 全選與
// 單一權限的切換；編輯頁把 API 回傳的既有權限轉成 Permissions 後
// 當 initialPermissions 傳入。兩個「全選」只影響 visibility=true 的權限，
// 不可見的權限維持原值。
const useRolePermissions = (
  initialPermissions: Permissions = emptyPermissions,
) => {
  const [permissions, setPermissions] =
    useState<Permissions>(initialPermissions);

  // 將指定群組內所有 job 的可見權限全部設為 value（全選或全取消）
  const handleGroupSelectAll = (groupName: string, value: boolean) => {
    const group = permissionActions.find((g) => g.groupName === groupName);
    if (!group) return;
    setPermissions((prev) => ({
      ...prev,
      ...Object.fromEntries(
        group.jobs.map((job) => [
          job.jobKey,
          {
            ...prev[job.jobKey],
            ...Object.fromEntries(
              job.permissions
                .filter((p) => p.visibility)
                .map((p): [string, boolean] => [p.action, value]),
            ),
          },
        ]),
      ),
    }));
  };

  // 將 job 的可見權限全部設為 value（全選或全取消）
  const handleSelectAll = (jobKey: string, value: boolean) => {
    const job = permissionActions
      .flatMap((g) => [...g.jobs])
      .find((j) => j.jobKey === jobKey);
    if (!job) return;
    setPermissions((prev) => ({
      ...prev,
      [jobKey]: {
        ...prev[jobKey],
        ...Object.fromEntries(
          job.permissions
            .filter((p) => p.visibility)
            .map((p): [string, boolean] => [p.action, value]),
        ),
      },
    }));
  };

  // 設定單一權限；啟用非檢視（view）的權限時會自動強制開啟檢視（view）
  const handlePermission = (jobKey: string, action: string, value: boolean) => {
    setPermissions((prev) => {
      const updated = { ...prev[jobKey], [action]: value };
      if (value && action !== PermissionAction.VIEW)
        updated[PermissionAction.VIEW] = true;
      return { ...prev, [jobKey]: updated };
    });
  };

  return {
    permissions,
    handleGroupSelectAll,
    handleSelectAll,
    handlePermission,
  };
};

export default useRolePermissions;
