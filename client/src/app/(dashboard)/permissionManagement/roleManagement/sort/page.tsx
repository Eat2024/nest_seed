"use client";

import { useGetRolesQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { deleteRole, sortRole } from "@/api/requests";
import { JobKey, PermissionAction, Role } from "@/api/types";
import DraggableRoleItem from "@/components/features/roleManagement/DraggableRoleItem";
import TableHeader from "@/components/features/roleManagement/TableHeader";
import PageTitle from "@/components/layouts/PageTitle";
import BottomActionBar from "@/components/ui/BottomActionBar";
import Flex from "@/components/ui/Flex";
import StickyBox from "@/components/ui/StickyBox";
import { ROUTES } from "@/constants/routes";
import useRequirePermission from "@/hooks/useRequirePermission";
import { useDialogContext } from "@/providers/DialogProvider";
import { useSnackbarContext } from "@/providers/SnackbarProvider";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { Box, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_WIDTH = 600;
const RIGHT_COLUMNS = ["人數", "刪除"];

const SortRoleManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openDialog, closeDialog } = useDialogContext();
  const { showSnackbar } = useSnackbarContext();

  // null 代表尚未拖曳，沿用伺服器順序；拖曳後存放使用者自訂的 id 排列
  const [orderedIds, setOrderedIds] = useState<number[] | null>(null);
  const [editedNames, setEditedNames] = useState<Record<number, string>>({});

  // 權限檢查
  const { hasAccess } = useRequirePermission(
    JobKey.ROLE_MANAGEMENT,
    PermissionAction.VIEW,
    PermissionAction.DELETE,
    PermissionAction.CREATE_EDIT,
  );

  const { data: rolesData } = useGetRolesQuery({
    enabled: hasAccess,
  });

  // 依 orderedIds 重排；null 時沿用伺服器原始順序
  const items: Role[] =
    orderedIds && rolesData
      ? orderedIds
          .map((id) => rolesData.find((r) => r.id === id)!)
          .filter(Boolean)
      : (rolesData ?? []);

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      // 角色列表已變更
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });
      closeDialog();
      showSnackbar("角色刪除成功", "success");
    },
    onError: () => {
      // 通用錯誤提示交給全域 MutationCache onError；這裡只補關閉確認對話框
      closeDialog();
    },
  });

  const { mutate: handleSort, isPending: isSortPending } = useMutation({
    mutationFn: sortRole,
    onSuccess: () => {
      // 角色列表已變更
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });
      showSnackbar("排序儲存成功", "success");
      router.push(ROUTES.roleManagement.href);
    },
    // 一般失敗交給全域 MutationCache onError 顯示提示（見 ReactQueryProvider）
  });

  const confirmDelete = (roleId: number, roleName: string, count: number) => {
    if (count > 0) {
      openDialog({
        title: "無法刪除",
        content: `角色「${roleName}」目前有 ${count} 名使用者，請先移除所有使用者後再執行刪除。`,
        status: "error",
        actions: [{ label: "確定", onClick: closeDialog }],
      });
      return;
    }

    openDialog({
      title: "確認刪除",
      content: `確定要刪除角色「${roleName}」嗎？此操作無法復原。`,
      status: "warning",
      actions: [
        { label: "確定", onClick: () => handleDelete(roleId) },
        {
          label: "取消",
          variant: "outlined",
          color: "secondary",
          onClick: closeDialog,
        },
      ],
    });
  };

  const handleSave = () => {
    const hasEmptyName = items.some(
      (role) => editedNames[role.id]?.trim() === "",
    );

    if (hasEmptyName) {
      showSnackbar("角色名稱不可為空白", "error");
      return;
    }

    handleSort({
      roles: items.map((role) => ({
        roleId: role.id,
        roleName: editedNames[role.id] ?? role.roleName,
      })),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // 拖曳中途取消（如按下 Escape）則不更新排序
    if (event.canceled) return;

    const { source } = event.operation;

    // 確認拖曳來源是 sortable item，才能取得 initialIndex / index
    if (!isSortable(source)) return;

    // initialIndex：拖曳開始時的原始位置
    // index：OptimisticSortingPlugin 計算出的最終落點
    const { initialIndex, index } = source;

    if (initialIndex === index) return;

    // 依目前 items 順序取得 id 陣列，再執行 splice 搬移
    const currentIds = items.map((role) => role.id);
    const nextIds = [...currentIds];
    const [movedId] = nextIds.splice(initialIndex, 1);
    nextIds.splice(index, 0, movedId);

    setOrderedIds(nextIds);
  };

  if (!hasAccess) return null;

  return (
    <Flex
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <PageTitle title="排序角色" />

      <Box
        sx={{ flex: 1, minWidth: MIN_WIDTH, bgcolor: "common.white", pb: 12 }}
      >
        <StickyBox>
          <TableHeader leftColumn="角色名稱" rightColumns={RIGHT_COLUMNS} />
        </StickyBox>

        <DragDropProvider onDragEnd={handleDragEnd}>
          <Box>
            {items.map((role, index) => (
              <DraggableRoleItem
                key={role.id}
                id={role.id}
                index={index}
                column={role.roleName}
                count={role.userCount}
                onDelete={() =>
                  confirmDelete(role.id, role.roleName, role.userCount)
                }
                onNameChange={(name) =>
                  setEditedNames((prev) => ({ ...prev, [role.id]: name }))
                }
              />
            ))}
          </Box>
        </DragDropProvider>
      </Box>

      <BottomActionBar>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push(ROUTES.roleManagement.href)}
        >
          取消
        </Button>
        <Button
          variant="contained"
          disabled={isSortPending}
          onClick={handleSave}
        >
          儲存
        </Button>
      </BottomActionBar>
    </Flex>
  );
};

export default SortRoleManagementPage;
