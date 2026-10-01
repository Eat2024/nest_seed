"use client";

import { useGetEmployeesQuery, useGetRolesQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { updateUser } from "@/api/requests";
import { JobKey, PermissionAction } from "@/api/types";
import AccountForm, {
  AccountFormValues,
} from "@/components/features/accountManagement/AccountForm";
import PageTitle from "@/components/layouts/PageTitle";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import useRequirePermission from "@/hooks/useRequirePermission";
import { useAuthContext } from "@/providers/AuthProvider";
import { useDialogContext } from "@/providers/DialogProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CreateAccountManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData: authUser } = useAuthContext();
  const { openDialog, closeDialog } = useDialogContext();

  const [empIdSearch, setEmpIdSearch] = useState("");
  const debouncedEmpIdSearch = useDebounce(empIdSearch, 400);

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

  const { data: rolesData } = useGetRolesQuery({ enabled: hasAccess });

  const { data: employeeOptions } = useGetEmployeesQuery(debouncedEmpIdSearch, {
    enabled: hasAccess && debouncedEmpIdSearch.length >= 5,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AccountFormValues) =>
      updateUser(formData.empId, {
        roleId: formData.roleId ?? undefined,
        isActive: formData.enabled,
        description: formData.remark || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });
      // 若編輯的是自己的帳號，角色變更可能影響自身權限，需同步更新其權限快取（userData）
      queryClient.invalidateQueries({ queryKey: [queryKeys.ME] });
      openDialog({
        title: "加入成功",
        content: "帳號已成功加入到該角色。",
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

  const roleOptions = (rolesData ?? []).map((r) => ({
    id: r.id,
    roleName: r.roleName,
  }));

  const handleSave = (data: AccountFormValues) => {
    if (data.empId === authUser?.user.empId && !data.enabled) {
      openDialog({
        title: "無法操作",
        content: "無法停用自己的帳號。",
        status: "warning",
        actions: [{ label: "確認", onClick: closeDialog }],
      });
      return;
    }
    mutate(data);
  };

  if (!hasAccess) return null;

  return (
    <>
      <PageTitle title="加入同仁" />
      <AccountForm
        roleOptions={roleOptions}
        employeeOptions={employeeOptions ?? []}
        onEmpIdSearch={setEmpIdSearch}
        isPending={isPending}
        onCancel={() => router.back()}
        onSave={handleSave}
      />
    </>
  );
};

export default CreateAccountManagementPage;
