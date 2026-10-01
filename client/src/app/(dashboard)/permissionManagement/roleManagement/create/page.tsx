"use client";

import { useGetPermissionsQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { createRole } from "@/api/requests";
import { JobKey, PermissionAction } from "@/api/types";
import RoleForm from "@/components/features/roleManagement/RoleForm";
import { Permissions } from "@/components/features/roleManagement/useRolePermissions";
import PageTitle from "@/components/layouts/PageTitle";
import Flex from "@/components/ui/Flex";
import { ROUTES } from "@/constants/routes";
import useRequirePermission from "@/hooks/useRequirePermission";
import { useSnackbarContext } from "@/providers/SnackbarProvider";
import { extractPermissionIds } from "@/utils/permissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const CreateRoleManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  // 權限檢查
  const { hasAccess } = useRequirePermission(
    JobKey.ROLE_MANAGEMENT,
    PermissionAction.VIEW,
    PermissionAction.CREATE_EDIT,
  );

  // 取得所有權限，並用於驗證使用者是否至少選擇一項權限
  const { data: permissionGroups } = useGetPermissionsQuery({
    enabled: hasAccess,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      // 角色列表已變更
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });

      showSnackbar("角色新增成功", "success");
      router.push(ROUTES.roleManagement.href);
    },
    // 一般失敗交給全域 MutationCache onError 顯示提示（見 ReactQueryProvider）
  });

  const handleSave = (roleName: string, permissions: Permissions) => {
    if (!permissionGroups) return;

    const permissionIds = extractPermissionIds(permissionGroups, permissions);

    // 風險提醒：拿掉這個驗證後，後端允許非 ADMIN 角色被存成 0 權限（DTO 未擋、DB 也無「至少一筆」約束），
    // 不會造成資料錯誤或意外放行（前後端 hasPermission 皆 fail-closed）。
    // 但目前系統只擋「ADMIN 角色」被清空，沒有擋「使用者清空自己目前所屬角色的權限」，
    // 若真的發生會立即被鎖在角色/權限管理功能外，只能靠另一個 ADMIN 帳號救援。
    // 若要移除此驗證，建議改在後端補上「不可清空目前登入者所屬角色權限」的保護。
    // if (permissionIds.length === 0)
    //   return showSnackbar("請至少選擇一項權限", "error");

    mutate({ roleName, permissionIds });
  };

  if (!hasAccess) return null;

  return (
    <Flex sx={{ flexDirection: "column", height: "100%", minHeight: 0 }}>
      <PageTitle title="新增角色" />

      <RoleForm
        onSave={handleSave}
        onCancel={() => router.push(ROUTES.roleManagement.href)}
        isPending={isPending}
      />
    </Flex>
  );
};

export default CreateRoleManagementPage;
