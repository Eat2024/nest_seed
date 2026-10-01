"use client";

import { useGetRolesQuery, useGetUsersQuery } from "@/api/queries";
import { queryKeys } from "@/api/query-keys";
import { updateUsersStatus } from "@/api/requests";
import { JobKey, PermissionAction, UserItem } from "@/api/types";
import AccountManagementToolbar from "@/components/features/accountManagement/AccountManagementToolbar";
import PageTitle from "@/components/layouts/PageTitle";
import AppDataGrid from "@/components/ui/AppDataGrid";
import Flex from "@/components/ui/Flex";
import StickyBox from "@/components/ui/StickyBox";
import TabBar from "@/components/ui/TabBar";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import useRequirePermission from "@/hooks/useRequirePermission";
import { useAuthContext } from "@/providers/AuthProvider";
import { useDialogContext } from "@/providers/DialogProvider";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";

import { GridFilterModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useMemo, useState } from "react";

const MIN_WIDTH = 600;

const AccountManagementPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userData } = useAuthContext();
  const { openDialog, closeDialog } = useDialogContext();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: "include", ids: new Set() });
  const debouncedKeyword = useDebounce(keyword, 400);

  const { hasAccess } = useRequirePermission(
    JobKey.ACCOUNT_MANAGEMENT,
    PermissionAction.VIEW,
    PermissionAction.CREATE_EDIT,
  );

  // 取得所有角色列表，含各角色的使用者人數
  const { data: rolesData } = useGetRolesQuery({ enabled: hasAccess });

  const tabs = (rolesData ?? []).map((role) => ({
    value: role.id,
    label: `${role.roleName}（${role.userCount}）`,
    roleCode: role.roleCode,
  }));

  const activeRoleId = selectedRoleId ?? tabs[0]?.value ?? null;

  // 取得使用者分頁列表
  const { data: usersData, isFetching } = useGetUsersQuery(
    {
      keyword: debouncedKeyword || undefined,
      roleId: activeRoleId,
      page: 1,
    },
    { enabled: hasAccess },
  );

  const allUsers = usersData?.users ?? [];

  const selectedUsers =
    rowSelectionModel.type === "include"
      ? allUsers.filter((u) => rowSelectionModel.ids.has(u.id))
      : allUsers.filter((u) => !rowSelectionModel.ids.has(u.id));

  const hasSelection =
    rowSelectionModel.type === "exclude" || rowSelectionModel.ids.size > 0;

  const { mutate: updateStatus } = useMutation({
    mutationFn: updateUsersStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.ROLES] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.USERS] });
      setRowSelectionModel({ type: "include", ids: new Set() });
    },
    // 一般失敗交給全域 MutationCache onError 顯示提示（見 ReactQueryProvider）
  });

  // 切換 tab 時同步清空搜尋字串與勾選狀態，避免跨角色殘留
  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setSelectedRoleId(newValue);
    setKeyword("");
    setRowSelectionModel({ type: "include", ids: new Set() });
  };

  // DataGrid filterMode="server" 時不做 client-side 篩選，改由此 handler 更新 keyword 觸發 API
  const handleFilterModelChange = (model: GridFilterModel) => {
    const quickFilterValues = model.quickFilterValues?.join(" ").trim() ?? "";
    setKeyword(quickFilterValues);
  };

  // 啟用 / 停用共用邏輯：不允許對超級管理員或自己操作，提前攔截並顯示警告
  const handleStatusUpdate = (isActive: boolean) => {
    if (selectedUsers.some((u) => u.isSystemAdmin)) {
      openDialog({
        title: "無法操作",
        content: "選取的帳號中包含超級管理員，無法進行啟用或停用操作。",
        status: "warning",
        actions: [{ label: "確認", onClick: closeDialog }],
      });
      return;
    }
    if (selectedUsers.some((u) => u.empId === userData?.user.empId)) {
      openDialog({
        title: "無法操作",
        content: "無法對自己的帳號進行啟用或停用操作。",
        status: "warning",
        actions: [{ label: "確認", onClick: closeDialog }],
      });
      return;
    }
    if (!activeRoleId || selectedUsers.length === 0) return;
    updateStatus({
      empIds: selectedUsers.map((u) => u.empId),
      isActive,
      roleId: activeRoleId,
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "empId",
        headerName: "員工編號",
        minWidth: 120,
        flex: 1,
        headerAlign: "center" as const,
        align: "center" as const,
      },
      {
        field: "name",
        headerName: "姓名",
        minWidth: 120,
        flex: 1,
        headerAlign: "center" as const,
        align: "center" as const,
      },
      {
        field: "role",
        headerName: "權限",
        minWidth: 120,
        headerAlign: "center" as const,
        align: "center" as const,
        valueGetter: (_: unknown, row: UserItem) => row.role?.roleName ?? "",
      },
      {
        field: "departmentName",
        headerName: "事業部",
        minWidth: 120,
        headerAlign: "center" as const,
        align: "center" as const,
        valueFormatter: (value: string) => value ?? "-",
      },
      {
        field: "lastLoginAt",
        headerName: "上次登入",
        minWidth: 120,
        flex: 1,
        headerAlign: "center" as const,
        align: "center" as const,
        valueFormatter: (value: string) =>
          value ? dayjs(value).format("YYYY/MM/DD HH:mm") : "-",
      },
      {
        field: "personStatus",
        headerName: "狀態",
        width: 100,
        headerAlign: "center" as const,
        align: "center" as const,
        renderCell: ({ row }: { row: UserItem }) => {
          return (
            <Flex sx={{ gap: 1 }}>
              {row.isActive ? (
                <CheckIcon sx={{ fontSize: 20, color: "primary.main" }} />
              ) : (
                <BlockIcon sx={{ fontSize: 20, color: "text.primary" }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: row.isActive ? "primary.main" : "text.primary" }}
              >
                {row.isActive ? "啟用" : "停用"}
              </Typography>
            </Flex>
          );
        },
      },
      {
        field: "edit",
        headerName: "編輯",
        width: 80,
        headerAlign: "center" as const,
        align: "center" as const,
        renderCell: ({ row }: { row: UserItem }) => (
          <IconButton
            disabled={row.isSystemAdmin}
            onClick={() =>
              router.push(
                `${ROUTES.editAccountManagement.href}?accountId=${row.id}`,
              )
            }
          >
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    [router],
  );

  if (!hasAccess) return null;

  return (
    <>
      <PageTitle title="帳號管理" />

      <StickyBox sx={{ minWidth: MIN_WIDTH }}>
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            bgcolor: "custom.background",
            borderBottom: "1px solid",
            borderBottomColor: "custom.black10",
          }}
        >
          <TabBar tabs={tabs} value={activeRoleId} onChange={handleTabChange} />
        </Flex>
      </StickyBox>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          minWidth: MIN_WIDTH,
          bgcolor: "common.white",
        }}
      >
        <AppDataGrid
          columns={columns}
          rows={usersData?.users ?? []}
          loading={isFetching}
          autoHeight={false}
          showToolbar
          filterMode="server"
          onFilterModelChange={handleFilterModelChange}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          slots={{ toolbar: AccountManagementToolbar }}
          slotProps={{
            toolbar: {
              onCheck: () => handleStatusUpdate(true),
              onBlock: () => handleStatusUpdate(false),
              hasSelection,
            },
          }}
        />
      </Box>
    </>
  );
};

export default AccountManagementPage;
