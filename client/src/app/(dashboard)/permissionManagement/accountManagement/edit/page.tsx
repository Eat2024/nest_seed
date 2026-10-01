"use client";

import { useGetRolesQuery, useGetUserQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { updateUser } from "@/api/requests";
import { JobKey, PermissionAction } from "@/api/types";
import AccountForm, {
  AccountFormValues,
} from "@/components/features/accountManagement/AccountForm";
import PageTitle from "@/components/layouts/PageTitle";
import { ROUTES } from "@/constants/routes";
import useRequirePermission from "@/hooks/useRequirePermission";
import { useAuthContext } from "@/providers/AuthProvider";
import { useDialogContext } from "@/providers/DialogProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const EditAccountManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { userData: authUser } = useAuthContext();
  const { openDialog, closeDialog } = useDialogContext();

  const accountId = Number(searchParams.get("accountId"));

  const { hasAccess } = useRequirePermission(
    JobKey.ACCOUNT_MANAGEMENT,
    PermissionAction.VIEW,
    PermissionAction.CREATE_EDIT,
  );

  // 若編輯的是自己的帳號並變更了角色，儲存後 hasAccess 會隨 ME 資料刷新而變化
  // 用 ref 記錄最新值，避免 Dialog 的 onClick 在建立時就把舊的 hasAccess 鎖進 closure
  const hasAccessRef = useRef(hasAccess);

  useEffect(() => {
    hasAccessRef.current = hasAccess;
  }, [hasAccess]);

  const { data: userData, isPending: isUserPending } = useGetUserQuery(
    accountId,
    { enabled: hasAccess && !!accountId },
  );

  const { data: rolesData } = useGetRolesQuery({ enabled: hasAccess });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AccountFormValues) =>
      updateUser(userData!.empId, {
        roleId: formData.roleId ?? undefined,
        isActive: formData.enabled,
        description: formData.remark,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USER, { id: accountId }],
      });
      // 若編輯的是自己的帳號，角色變更可能影響自身權限，需同步更新其權限快取（userData）
      queryClient.invalidateQueries({ queryKey: [queryKeys.ME] });

      openDialog({
        title: "儲存成功",
        content: "帳號資料已更新。",
        status: "success",
        actions: [
          {
            label: "確認",
            onClick: () => {
              closeDialog();
              if (hasAccessRef.current) {
                router.back();
              } else {
                router.push(ROUTES.home.href);
              }
            },
          },
        ],
      });
    },
    // 一般失敗交給全域 MutationCache onError 顯示提示（見 ReactQueryProvider）
  });

  const roleOptions = (rolesData ?? []).map((role) => ({
    id: role.id,
    roleName: role.roleName,
  }));

  const defaultValues: Partial<AccountFormValues> = userData
    ? {
        empId: userData.empId,
        name: userData.name ?? "",
        division: userData.departmentName ?? "",
        enabled: userData.isActive,
        roleId: userData.role?.id ?? null,
        remark: userData.description,
      }
    : {};

  const handleSave = (data: AccountFormValues) => {
    if (
      userData?.empId === authUser?.user.empId &&
      data.enabled !== userData?.isActive
    ) {
      openDialog({
        title: "無法操作",
        content: "無法變更自己帳號的啟用狀態。",
        status: "warning",
        actions: [{ label: "確認", onClick: closeDialog }],
      });
      return;
    }
    mutate(data);
  };

  if (!hasAccess || isUserPending) return null;

  return (
    <>
      <PageTitle title="編輯帳號" />
      <AccountForm
        defaultValues={defaultValues}
        roleOptions={roleOptions}
        isPending={isPending}
        onCancel={() => router.back()}
        onSave={handleSave}
      />
    </>
  );
};

export default EditAccountManagementPage;
